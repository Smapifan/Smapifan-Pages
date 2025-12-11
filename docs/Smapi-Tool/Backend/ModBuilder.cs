using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.IO.Compression;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/api/build", async (HttpContext ctx) =>
{
    using var reader = new StreamReader(ctx.Request.Body);
    var body = await reader.ReadToEndAsync();
    var files = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,string>>(body)!;

    string tmp = Path.Combine(Path.GetTempPath(),"mod_"+Guid.NewGuid().ToString("N"));
    Directory.CreateDirectory(tmp);

    try
    {
        // Dateien speichern
        foreach(var kv in files)
        {
            string path = Path.Combine(tmp, kv.Key);
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            var bytes = Convert.FromBase64String(kv.Value);
            await File.WriteAllBytesAsync(path, bytes);
        }

        // Minimal .csproj erzeugen
        string csprojPath = Path.Combine(tmp,"Mod.csproj");
        await File.WriteAllTextAsync(csprojPath, @"
<Project Sdk=""Microsoft.NET.Sdk"">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <OutputType>Library</OutputType>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include=""StardewModdingAPI"" Version=""3.19.1"" />
  </ItemGroup>
</Project>");

        // dotnet build
        var psi = new ProcessStartInfo("dotnet", $"build {csprojPath} -o {Path.Combine(tmp,"mod")}")
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false
        };
        var proc = Process.Start(psi)!;
        string output = await proc.StandardOutput.ReadToEndAsync();
        string errors = await proc.StandardError.ReadToEndAsync();
        proc.WaitForExit();

        if(proc.ExitCode != 0)
        {
            ctx.Response.StatusCode = 500;
            await ctx.Response.WriteAsync("Build failed:\n" + errors);
            return;
        }

        // ZIP erzeugen
        using var ms = new MemoryStream();
        using(var zip = new ZipArchive(ms,ZipArchiveMode.Create,true))
        {
            foreach(var file in Directory.GetFiles(Path.Combine(tmp,"mod")))
                zip.CreateEntryFromFile(file, Path.GetFileName(file));
        }
        ms.Seek(0, SeekOrigin.Begin);
        ctx.Response.ContentType = "application/zip";
        ctx.Response.Headers["Content-Disposition"] = "attachment; filename=ModExport.zip";
        await ms.CopyToAsync(ctx.Response.Body);
    }
    finally
    {
        Directory.Delete(tmp,true);
    }
});

app.Run();
