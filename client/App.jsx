import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Map from './Map.jsx';

const App = (props) => {
  const [init, setInit] = useState('Hello World')
  const [map, setMap] = useState(null)
  const [location, setLocation] = useState({
    address: '301 Sullivan Pl Brooklyn, NY 11225',
    lat: 40.6650885,
    lng: -73.9513202
  })

  const handleClick = (e) => {
    e.preventDefault();
    console.log('clicked')
    axios.get('/test')
    .then(data => {
      console.log(data);
      setInit(data);
    })
    .catch(err => console.error(err));
  };

  const findSpots = (e) => {
    e.preventDefault();
    console.log(e.target.name.value)
    const options = e.target.name.value.split(' ').join('+');
    axios.get('/findSpot?name=' + options)
      .then(data => {
        setLocation({
        address: data.data[0].address,
        lat: data.data[0].lat,
        lng: data.data[0].lng
        });
        console.log(data.data);
      });
      console.log(location);
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('sending...', e.target.name.value);
    axios.post('/newSpot', {
      name: e.target.name.value,
      street: e.target.street.value,
      city: e.target.city.value,
      state: e.target.state.value,
      zip: e.target.zip.value,
      menu: e.target.menu.value,
      comments: e.target.comments.value
    })
      .then(data => console.log(data))
  };

  useEffect(()=>{
    axios.get('/test')
      .then(data => {
        // console.log(data, data.data);
        setInit(data.data);
      })
      .catch(err => console.error(err))
  }, []);

/*  return(
    <div onClick={handleClick}>
      Hello!
    </div>
  ) */

  return(
      <>
        <h1 onClick={handleClick}>{init}</h1>
        <Map location={location} zoomLevel={17} />

        <form onSubmit={findSpots}>
          <input type="text" name="name" placeholder="Name of Location" />
          <input type="submit" value="Submit" />
        </form>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name of Location" />
          <input type="text" name="street" placeholder="Street Address" />
          <input type="text" name="city" placeholder="City" />
          <input type="text" name="state" placeholder= "State" />
          <input type="text" name="zip" placeholder="Zip" />
          <input type="text" name="menu" placeholder="Relevant Menu Items" />
          <input type="text" name="comments" id="Comments" size="100" placeholder="Comments" />
          <input type="submit" value="Submit" />
        </form>

      </>
  );
}
export default App;