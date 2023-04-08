const { model, Schema, default: mongoose } = require('mongoose')

const genreSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, require: true },
});

// Tạo model từ schema
module.exports = model('Genre', genreSchema);