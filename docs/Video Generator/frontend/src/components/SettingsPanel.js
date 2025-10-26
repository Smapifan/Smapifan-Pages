import React, { useState } from 'react';
import axios from 'axios';

function SettingsPanel() {
  const [fps, setFps] = useState(30);
  const [volume, setVolume] = useState(100);
  const [script, setScript] = useState('');

  const handleGenerate = async () => {
    const response = await axios.post('http://localhost:5000/api/video/generate', {
      fps,
      volume,
      script,
      voices: {} // TODO: Stimme Daten einfügen
    });
    alert(response.data.message);
  };

  return (
    <div>
      <h2>Einstellungen</h2>
      <label>FPS: <input type="number" value={fps} onChange={e => setFps(e.target.value)} /></label>
      <label>Lautstärke: <input type="number" value={volume} onChange={e => setVolume(e.target.value)} /></label>
      <label>Skript: <textarea value={script} onChange={e => setScript(e.target.value)} /></label>
      <button onClick={handleGenerate}>Video generieren</button>
    </div>
  );
}

export default SettingsPanel;
