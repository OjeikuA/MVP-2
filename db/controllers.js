const axios = require('axios');
const db = require('./database.js');
const Locale = db.conn.model('locales', db.localeSchema);

const addLocale = async (body, address) => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`
  );
  const { lat, lng } = data.results[0].geometry.location;
  const newLocale = new Locale({
    name: body.name,
    street: body.street,
    city: body.city,
    state: body.state,
    zip: body.zip,
    menu: body.menu,
    comments: body.comments,
    lat,
    lng
  });
  return newLocale.save();
};

const getLocale = async (name) => {
  const city = name.split('+').join(' ');
  return Locale.find({ city });
};

module.exports = {
  addLocale,
  getLocale
};
