require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const db = require('../db/controllers.js');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.resolve('bundle')));
app.use(express.static(path.resolve('client')));
// import path, then path.join(__dirname, bundle)

  // question - why can't I use the default route anymore?
    /* app.get('/', (req, res) => {
      res.send('Connected to Server!')
    }) */

app.get('/test', (req, res) => {
  console.log('page load');
  res.send('Test Successful!');
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
  // axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyA2alD8pmzJrvKCYYu6NaI-hF_o5dPX1O0')
  //   .then(data => console.log(data.data.results[0].geometry.location))
})



app.listen(process.env.PORT, ()=>{
  console.log(`Listening on port: ${process.env.PORT}`);
})

/*
// avoid talking about "migrating" databases
// focus more on non-database work

  migrated monolith to microservice

  when you think about API design - API is your routes; how you view the REST standard
  good answer to a lot of questions - test the system, find weaknesses/bottlenecks, and then fix them
  don't say that you use Redis to make the database smaller - mind your language

*/