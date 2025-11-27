export const defaultBlocks = {
  onMessage: {
    id: "onMessage", name: "On Message", type: "event",
    params: { name: { type: "string", default: "messageCreate" } },
    generate({ params, children }) { return `client.on("${params.name||'messageCreate'}", async (msg)=>{\n${indent(children,2)}\n});`; }
  },
  sendMessage: {
    id: "sendMessage", name: "Send Message", type: "action",
    params: { text: { type: "string", default: "Hello!" } },
    generate({ params }) { return `await msg.reply(\`${params.text||''}\`);`; }
  },
  customCode: {
    id: "customCode", name: "Custom JS", type: "util",
    params: { code: { type: "code", default: "// custom code\n" } },
    generate({ params }) { return params.code||""; }
  }
};

export function normalizeBlocks(customBlocks) {
  const map = {}; for (const k in defaultBlocks) map[k] = defaultBlocks[k];
  if (!customBlocks) return map;
  for (const k in customBlocks) map[k] = customBlocks[k];
  return map;
}

export class BlockEngine {
  constructor(blockMap){ this.blocks=blockMap||{}; }
  renderBlock(node){
    if(!node||!node.id) return node.params?.code||"";
    const block=this.blocks[node.id]; if(!block) return node.params?.code||"";
    const childrenCode=(node.children||[]).map(c=>this.renderBlock(c)).join("\n");
    return block.generate({params:node.params||{}, children: childrenCode});
  }
  generate(tree){ return Array.isArray(tree)?tree.map(t=>this.renderBlock(t)).join("\n\n"):this.renderBlock(tree); }
}

function indent(s,n=1){if(!s)return"";const pad="  ".repeat(n);return s.split("\n").map(l=>l.trim()?pad+l:l).join("\n");}