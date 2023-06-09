const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const multer = require('multer');
const videoSchema = require("../models/video-schema")
const bodyParser = require("body-parser")
const checkAuth = require("../middleware/check-auth")
const fs = require('fs')

router.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Route để upload video
router.post('/', checkAuth, upload.single('video'), async (req, res) => {
  try {
    const videoUrl = req.file.path
    const { videoName, genres } = req.body
    await videoSchema.create(
      {
        _id: new mongoose.Types.ObjectId(),
        name: videoName,
        videoUrl: videoUrl,
        genres: genres
      })
    res.send('Video uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.get('/', async(req, res)=>{
  return res.status(200).send({
    title: "Express Testing",
    message: "The app is working properly!",
  });
})

router.get('/getall', async (req, res) => {
  try {
    videoSchema.find().then((data) => {
      res.send(data)
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

router.get('/getvideo', async (req, res) => {
  const id = req.query.id
  console.log(id)
  videoSchema.findOne({ _id: id })
    .then((data) => {
      res.send(data)
    })
    .catch(err => console.error(err))
})

router.get('/getvideo', async (req, res) => {
  const genre = req.query.genre
  //console.log(id)
  try {
    videoSchema.find({ genres: genre })
      .then((data) => {
        res.status(200).send(data)
      })
      .catch(err => console.error(err))
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

router.patch('/update',checkAuth, async (req, res) => {
  const id = req.query.id
  const { videoName, genres } = req.body
  try {
    await videoSchema.findOne({ _id: id })
      .then(async (data) => {
        if (data) {
          await videoSchema.updateOne(
            {
              _id: id
            }, {
            name: videoName,
            genres: genres,
          }).then((result) => {
            if (result) {
              res.status(200).send("Cập nhật thành công")
            } else return res.status(401).send("Có lỗi xảy ra!!")
          })
        } else return res.status(401).send("Không tìm thấy")
      })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

router.delete('/delete',checkAuth, async (req, res) => {
  const id = req.query.id
  try {
    await videoSchema.findOne({ _id: id })
      .then(async (data) => {
        if (data) {
          const filePath = data.videoUrl
          await videoSchema.deleteOne({ _id: id })
          .then((result)=>{
            if (result) {
              fs.unlink(filePath, (err => {
                if (err) {
                  console.error(err)
                }
                console.log('File deleted successfully');
              }))
              return res.status(200).send({ message: "Đã xóa" })
            }
          })
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
      })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

module.exports = router;