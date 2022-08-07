let mongoose = require('mongoose')

let urlSchema = new mongoose.Schema({
    url: String,
    short_url: Number
  })
  
module.exports = mongoose.model('url', urlSchema)