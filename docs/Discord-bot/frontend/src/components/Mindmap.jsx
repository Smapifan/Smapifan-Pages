import React from "react";
import Block from "./Block";

export default function Mindmap({tree,setTree}){
  return (
    <div className="mindmap">
      <Block node={tree} updateNode={(newNode)=>setTree(newNode)} level={0}/>
    </div>
  );
}