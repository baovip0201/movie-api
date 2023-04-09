const{model, Schema, default: mongoose}=require('mongoose')

const videoSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {type: String, require: true},
    videoUrl: {type: String, require: true},
    genres: [{type: String, require: true}]
  });
  
  // Tạo model từ schema
module.exports = model('Video', videoSchema);