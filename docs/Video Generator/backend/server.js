const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const videoRoutes = require('./routes/videoRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/video', videoRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});