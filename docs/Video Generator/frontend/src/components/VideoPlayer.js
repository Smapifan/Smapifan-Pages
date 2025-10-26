import React from 'react';

function VideoPlayer() {
  return (
    <div>
      <h2>Video Vorschau</h2>
      <video controls width="600">
        <source src="" type="video/mp4" />
        Dein Browser unterstützt kein Video-Tag.
      </video>
    </div>
  );
}

export default VideoPlayer;