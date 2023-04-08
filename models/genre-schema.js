const{model, Schema}=require('mongoose')

const genreSchema = new Schema({
    name: {type: String, require: true},
  });
  
  // Tạo model từ schema
module.exports = model('Genre', genreSchema);