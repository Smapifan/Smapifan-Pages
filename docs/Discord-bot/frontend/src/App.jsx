import React, { useState, useEffect } from "react";
import Mindmap from "./components/Mindmap";
import Toolbar from "./components/Toolbar";

export default function App(){
  const [tree,setTree]=useState(()=>JSON.parse(localStorage.getItem("cordBotTree")||"null") || {
    id:"onMessage", params:{name:"messageCreate"}, children:[
      {id:"sendMessage", params:{text:"Hallo Welt!"}, children:[]}
    ]
  });
  const [projectName,setProjectName]=useState(()=>localStorage.getItem("cordBotProjectName")||"MeinBot");

  useEffect(()=>{ localStorage.setItem("cordBotTree", JSON.stringify(tree)); }, [tree]);
  useEffect(()=>{ localStorage.setItem("cordBotProjectName", projectName); }, [projectName]);

  const handleExport=async()=>{
    const body={ projectInfo:{name:projectName}, blockTree: tree };
    const resp=await fetch("/api/generate-zip",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const blob=await resp.blob();
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`${projectName.replace(/\s+/g,'_')}_export.zip`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="app-container">
      <h1>Cord Builder Pro</h1>
      <Toolbar projectName={projectName} setProjectName={setProjectName} handleExport={handleExport}/>
      <Mindmap tree={tree} setTree={setTree}/>
    </div>
  );
}