require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const db = require('../db/controllers.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.resolve('bundle')));
app.use(express.static(path.resolve('client')));

app.get('/test', (req, res) => {
  res.send('Places to Visit (again)');
});

app.post('/newSpot', async (req, res) => {
  try {
    const address = req.body.street.split(' ').join('+') + '+' + req.body.city + '+' + req.body.state;
    await db.addLocale(req.body, address);
    res.send('Success!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving location');
  }
});

app.get('/findSpot', async (req, res) => {
  try {
    const data = await db.getLocale(req.query.name);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching locations');
  }
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX;

app.get('/showCity', async (req, res) => {
  try {
    const name = req.query.name.split(' ').join('+');
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&key=${GOOGLE_API_KEY}&fields=formatted_address%2Cgeometry`
    );
    res.send(data.candidates[0].geometry.location);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error finding city');
  }
});

app.get('/findplacefromtext', async (req, res) => {
  try {
    const name = req.query.name.split(' ').join('%20');
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&key=${GOOGLE_API_KEY}&fields=formatted_address%2Cgeometry%2Crating%2Cprice_level%2Ctypes`
    );
    res.send(data.candidates);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error finding place');
  }
});

app.get('/photos', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_CX}&q=${req.query.name}&searchType=IMAGE`
    );
    res.send(data.items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching photos');
  }
});

app.listen(3000, () => {
  console.log('Listening on port: 3000');
});
