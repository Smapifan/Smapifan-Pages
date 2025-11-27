import React, { useState } from "react";

export default function Block({node,updateNode,level}){
  const [expanded,setExpanded]=useState(true);
  const indent=level*20;
  const toggleExpand=()=>setExpanded(!expanded);
  const updateChild=(idx,newChild)=>{
    const newChildren=[...(node.children||[])]; newChildren[idx]=newChild;
    updateNode({...node, children:newChildren});
  }

  const addChild=()=>{
    const newChildren=[...(node.children||[]), {id:"sendMessage", params:{text:"Neue Nachricht"}, children:[]}];
    updateNode({...node, children:newChildren});
  }

  return (
    <div style={{marginLeft:indent, border:"1px solid #888", padding:5, marginBottom:5}}>
      <div>
        <strong>{node.id}</strong>
        <button onClick={toggleExpand}>{expanded?"-":"+"}</button>
        <button onClick={addChild}>+Child</button>
      </div>
      {expanded && (node.children||[]).map((c,i)=>(
        <Block key={i} node={c} updateNode={(n)=>updateChild(i,n)} level={level+1}/>
      ))}
    </div>
  );
}