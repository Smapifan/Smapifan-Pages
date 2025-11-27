import archiver from "archiver";

export function buildBuilderJs(generatedCode, projectInfo={}) {
  return `/**
 * builder.js
 * Project: ${projectInfo.name||'unnamed'}
 */\nmodule.exports = async function register(client){\nif(!client) throw new Error("client required");\n(async()=>{\n${indent(generatedCode,1)}\n})();\n};`;
}
export function buildBlocksJs(blockMap){ return "module.exports = "+JSON.stringify(Object.keys(blockMap))+";"; }
export function buildBlockTreeJs(tree){ return "module.exports = "+JSON.stringify(tree,null,2)+";"; }
export function buildPatchTxt(){ return "// PATCH.txt\nconst registerBuilder = require('./builder.js');\n(async()=>{await registerBuilder(client);})();\n"; }

export async function createZipStream(filesArray, assetsArray){
  const archive = archiver("zip",{zlib:{level:9}});
  const stream = archive;
  for(const f of filesArray) archive.append(f.content,{name:f.name});
  if(assetsArray){for(const a of assetsArray){let b64=a.base64||""; if(b64.startsWith("data:")) b64=b64.split(",")[1]; archive.append(Buffer.from(b64,"base64"),{name:`assets/${a.name}`});}}
  setImmediate(()=>archive.finalize());
  return stream;
}

function indent(s,n=1){if(!s)return"";const pad="  ".repeat(n);return s.split("\n").map(l=>l.trim()?pad+l:l).join("\n");}