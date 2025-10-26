exports.generateVideo = (req, res) => {
  const { fps, volume, script, voices } = req.body;
  // TODO: Logik für Video + Stimmen generieren
  console.log('Video Daten:', fps, volume, script, voices);
  res.json({ message: 'Video generation gestartet' });
};
