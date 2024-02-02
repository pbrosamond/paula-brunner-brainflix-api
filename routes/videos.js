const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const router = express.Router();

// Load initial data from the JSON file
let videosData = loadVideosData();

router.route('/')
  .get((req, res) => {
    res.json(videosData);
  })
  .post((req, res) => {
    const newVideo = req.body;
    if (!newVideo.title || !newVideo.description) return res.status(404).json("All new video uploads must have a title and a description") 
    newVideo.id = uuidv4(); // Use uuid to generate a unique ID
    videosData.push(newVideo);
  
    // Update the JSON file with the new data
    saveVideosData(videosData);
  
    res.status(201).json(newVideo);
})

// Endpoint to get a specific video by ID
router.get('/:id', (req, res) => {
  const videoId = req.params.id;
  const video = videosData.find((video) => video.id === videoId);

  if (video) {
    res.status(200).json(video);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

// Helper function to load video data from the JSON file
function loadVideosData() {
  try {
    const data = fs.readFileSync('./data/videos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error)
  }
}

// Helper function to save video data to the JSON file
function saveVideosData(data) {
  fs.writeFileSync('./data/videos.json', JSON.stringify(data, null, 2), 'utf8');
}

module.exports = router;
