import React, { useState } from 'react';

function VoiceManager() {
  const [voices, setVoices] = useState([{ name: 'Laura', file: '' }]);

  const handleFileChange = (index, file) => {
    const newVoices = [...voices];
    newVoices[index].file = file;
    setVoices(newVoices);
  };

  return (
    <div>
      <h2>Stimmen Manager</h2>
      {voices.map((voice, index) => (
        <div key={index}>
          <label>{voice.name}: <input type="file" onChange={e => handleFileChange(index, e.target.files[0].name)} /></label>
        </div>
      ))}
    </div>
  );
}

export default VoiceManager;