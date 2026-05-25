const mongoose = require('mongoose');
  const conn = mongoose.createConnection(process.env.MONGODB_URI)
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