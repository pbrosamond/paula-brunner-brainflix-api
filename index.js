const express = require('express');
const videoRoutes = require('./routes/videos');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;
// const { VERSION, BASE_PATH } = process.env; //It's one or the other not both.

app.use(express.static(path.join(__dirname, 'public')));

app.use(`/videos`, videoRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});