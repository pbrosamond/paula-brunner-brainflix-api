const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

const router = express.Router();

// Load initial data from the JSON file
let videosData = loadVideosData();

router
  .route("/")
  .get((req, res) => {
    const newVideoData = JSON.parse(JSON.stringify(videosData)).map(el => {
      if (!el.image.match(/^https?:\/\//)) { 
        el.image = `http://127.0.0.1:5050/upload-images/${el.image}`
      }
      delete el.views;
      delete el.likes;
      delete el.duration;
      delete el.video;
      delete el.timestamp;
      delete el.comments;
      return el;
    }); 
    res.json(newVideoData);
  })
  .post(async (req, res) => {
    const newVideo = req.body;
    if (!newVideo.title || !newVideo.description || !newVideo.image)
      return res
        .status(404)
        .send("All new video uploads must have a title and a description");

    newVideo.id = uuidv4(); // Use uuid to generate a unique ID

    const imageFetchResponse = await fetch(newVideo.image);
    const extName = path.extname(newVideo.image);
    const fileName = newVideo.id + extName

    imageFetchResponse.body.pipe(fs.createWriteStream(`./public/upload-images/${fileName}`));

    newVideo.image = fileName
    newVideo.channel = "Lord of the Abyss";
    newVideo.views = "Too many to count";
    newVideo.likes = "Too many to count";
    newVideo.duration = "The perfect duration";
    newVideo.video = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    newVideo.timestamp = new Date().getTime();
    newVideo.comments = [];
    videosData.push(newVideo);

    // Update the JSON file with the new data
    saveVideosData(videosData);

    res.status(201).json(newVideo);
  });

// Endpoint to get a specific video by ID
router.get("/:id", (req, res) => {
  const videoId = req.params.id;
  const video = videosData.find((video) => video.id === videoId);

  const newVideo = JSON.parse(JSON.stringify(video))
  if (!newVideo.image.match(/^https?:\/\//)) { 
  newVideo.image = `http://127.0.0.1:5050/upload-images/${newVideo.image}`
  }

  if (video) {
    res.status(200).json(newVideo);
  } else {
    res.status(404).json({ error: "Video not found" });
  }
});

// Helper function to load video data from the JSON file
function loadVideosData() {
  try {
    const data = fs.readFileSync("./data/videos.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

// Helper function to save video data to the JSON file
function saveVideosData(data) {
  fs.writeFileSync("./data/videos.json", JSON.stringify(data, null, 2), "utf8");
}

module.exports = router;
