import React from 'react';
import SettingsPanel from './components/SettingsPanel';
import VideoPlayer from './components/VideoPlayer';
import VoiceManager from './components/VoiceManager';

function App() {
  return (
    <div className="App">
      <h1>Video Generator</h1>
      <SettingsPanel />
      <VoiceManager />
      <VideoPlayer />
    </div>
  );
}

export default App;
