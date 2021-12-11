require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const db = require('../db/controllers.js');;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const multer = require('multer');
// const upload = multer({dest: 'uploads/'});
// const uploadToS3 = require('./s3.js');
// const AWS = require('aws-sdk');
// const fs = require('fs');

app.use(express.static(path.resolve('bundle')));
app.use(express.static(path.resolve('client')));
// import path, then path.join(__dirname, bundle)

  // question - why can't I use the default route anymore?
    /* app.get('/', (req, res) => {
      res.send('Connected to Server!')
    }) */

app.get('/test', (req, res) => {
  console.log('page load');
  res.send('The Comeback');
});

app.post('/newSpot', (req, res) => {
  console.log('this is the body', req.body);
  const address = req.body.street.split(' ').join('+') + '+' + req.body.city + '+' + req.body.state;
  console.log(address);
  db.addLocale(req, res, address, (data)=>{
    console.log(data);
  })
  res.send('Success!');
})

app.get('/findSpot', (req, res) => {
  console.log(req.query);
  const name = req.query.name.split(' ').join('+');
  console.log(name);
  db.getLocale(name, (data)=>{
    console.log(data);
    res.send(data);
  })
});

app.get('/showCity', (req, res) => {
  const name = req.query.name.split(' ').join('+');
  axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + name + '&inputtype=textquery&key=' + process.env.API_KEY + '&fields=formatted_address%2Cgeometry')
  .then(data => {
    console.log('geometry is', data.data.candidates[0].geometry)
    res.send(data.data.candidates[0].geometry.location)
  })
  .catch(err => console.error(err))
})

app.get('/findplacefromtext', (req, res) => {
  console.log(req.query.name)
  const name = req.query.name.split(' ').join('%20')
  axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + name + '&inputtype=textquery&key=' + process.env.API_KEY + '&fields=formatted_address%2Cgeometry%2Crating%2Cprice_level%2Ctypes')
    .then(data => {
      console.log(data.data.candidates)
      // console.log(data.data.candidates[0].photos)
      res.send(data.data.candidates)
    })
    .catch(err => console.error(err))
})

app.get('/photos', (req, res) => {
  console.log(req.query.name)
  axios.get('https://www.googleapis.com/customsearch/v1?key=' + process.env.SEARCH_API_KEY + '&cx=' + process.env.SEARCH_NGN + '&q=' + req.query.name + '&searchType=IMAGE')
    .then(data => res.send(data.data.items))
    .catch(err => console.error(err))
})

app.listen(process.env.PORT, ()=>{
  console.log(`Listening on port: ${process.env.PORT}`);
})

