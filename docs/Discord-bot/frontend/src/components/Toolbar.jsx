export default function Toolbar({projectName,setProjectName,handleExport}){
  return (
    <div className="toolbar">
      <input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="Project Name"/>
      <button onClick={handleExport}>Export ZIP</button>
    </div>
  );
}