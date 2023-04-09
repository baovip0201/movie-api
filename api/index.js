const express = require('express');

const app = express();
const videoRouter=require("./routes/videos")
const userRouter=require("./routes/user")
const {connectDb}=require("../config/database")
require('dotenv').config()

connectDb()

app.use('/api/videos', videoRouter)
app.use('/api', userRouter)
// Khởi động server
app.listen(3000, () => {
  console.log('Server started on port 3000')
});
