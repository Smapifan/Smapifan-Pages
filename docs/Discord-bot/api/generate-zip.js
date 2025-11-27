import { normalizeBlocks, BlockEngine } from "../lib/blocks";
import { buildBuilderJs, buildBlocksJs, buildBlockTreeJs, buildPatchTxt, createZipStream } from "../lib/exporter";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { projectInfo = {}, blockTree, blocks: incomingBlocks, assets } = req.body;
    if (!blockTree) return res.status(400).json({ error: "blockTree required" });

    const normalized = normalizeBlocks(incomingBlocks || {});
    const engine = new BlockEngine(normalized);

    const generatedCode = engine.generate(blockTree);
    const builderJs = buildBuilderJs(generatedCode, projectInfo);
    const blocksJs = buildBlocksJs(normalized);
    const blockTreeJs = buildBlockTreeJs(blockTree);
    const patchTxt = buildPatchTxt();

    const filesToZip = [
      { name: "builder.js", content: builderJs },
      { name: "blocks.js", content: blocksJs },
      { name: "blockTree.js", content: blockTreeJs },
      { name: "PATCH.txt", content: patchTxt },
      { name: "project.json", content: JSON.stringify(projectInfo, null, 2) }
    ];

    res.setHeader("Content-Disposition", `attachment; filename="${(projectInfo.name||'project').replace(/\s+/g,'_')}_export.zip"`);
    res.setHeader("Content-Type", "application/zip");

    const zipStream = await createZipStream(filesToZip, null, assets);
    zipStream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}