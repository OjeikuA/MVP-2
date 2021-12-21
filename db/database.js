const mongoose = require('mongoose');
  const conn = mongoose.createConnection('mongodb://ec2-52-71-22-114.compute-1.amazonaws.com:27017/locales')
  .once('open', ()=> console.log(`Connected to Locales!`));

const localeSchema = new mongoose.Schema({
    name: String,
    street: String,
    city: String,
    state: String,
    zip: Number,
    menu: String,
    comments: String,
    lat: Number,
    lng: Number
})

module.exports = {
  localeSchema,
  conn
}