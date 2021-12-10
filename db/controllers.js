const mongoose = require('mongoose');
const axios = require('axios');
const db = require('./database.js');
const Locale = db.conn.model('locales', db.localeSchema);

const addLocale = (req, res, address, callback) => {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=' + process.env.API_KEY)
    .then(data => {
      console.log(data.data.results[0].geometry.location)
      var newLocale = new Locale({
      name: req.body.name,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      menu: req.body.menu,
      comments: req.body.comments,
      lat: data.data.results[0].geometry.location.lat,
      lng: data.data.results[0].geometry.location.lng
      })
      newLocale.save()
        .then(response => callback(response))
    })
}

const getLocale = (name, callback) => {
  console.log('Hi! My name is: ', name);
  const locale = name.split('+').join(' ');
  Locale.find({name: locale})
    .then(data => callback(data))
}

module.exports = {
  addLocale,
  getLocale
}