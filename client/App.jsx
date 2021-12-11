import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Map from './Map.jsx';

const App = (props) => {
  const [init, setInit] = useState('Hello World');
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({
    address: '301 Sullivan Pl Brooklyn, NY 11225',
    lat: 40.6650885,
    lng: -73.9513202
  });
  const [places, setPlaces] = useState([]);
  const [content, setContent] = useState('');
  const [contentName, setContentName] = useState('');
  const [mapHeader, setMapHeader] = useState('Find a Locale of Interest');
  const [showModal, setShowModal] = useState(false);
  const [buttonCont, setButtonCont] = useState('Add a Point of Interest')

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
        setPlaces(data.data)
        console.log(data.data);
      });
      console.log(location);
    return;
  };

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
    setShowModal(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.name.value)
    axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/output?name=' + e.target.name.value)
      .then(data => console.log(data))
  };

  const handleModal = e => {
    e.preventDefault();
    setShowModal(!showModal)
    setButtonCont('Hide Form')
  }

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
        <h1 onClick={handleModal}>{init}</h1>
        {
          showModal ?
          <form className="form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name of Location" />
            <input type="text" name="street" placeholder="Street Address" />
            <input type="text" name="city" placeholder="City" />
            <input type="text" name="state" placeholder= "State" />
            <input type="text" name="zip" placeholder="Zip" />
            <input type="text" name="menu" placeholder="Relevant Menu Items" />
            <input type="text" name="comments" id="Comments" size="100" placeholder="Comments" />
            <input type="submit" value="Submit" />
          </form>
          : null
        }
        <button onClick={handleModal}>{buttonCont}</button>
        <div>
            <div>
              <div className="map">
                <Map location={location} zoomLevel={17} header={mapHeader}/>
              </div>
              <div className="content">
              <form onSubmit={findSpots} id="citySearch">
                <input type="text" name="name" placeholder="Search a City" />
                <input type="submit" value="Submit" />
              </form>
              {
                places ? <table>
                  <tbody>

                {
                  places.map(place => {
                    return (
                      <>
                        <tr border="1px solid black">
                          <th onClick={()=>{
                            setLocation({
                              address: place.street,
                              lat: place.lat,
                              lng: place.lng
                            });
                            setContent(place.comments)
                            setContentName(place.name)
                            setMapHeader(place.name + ', ' + place.street)
                          }}>{place.name}</th>
                        </tr>
                        <tr>
                          <td>{place.street}</td>
                        </tr>
                      </>
                    )
                  })
                }
                </tbody>
                </table> : null
              }
              {
                content ?
                <table>
                  <tbody>
                    <tr>
                      <th>{contentName}</th>
                    </tr>
                    <tr>
                      <td>{content}</td>
                    </tr>
                  </tbody>
                </table> : null
              }
              </div>
            </div>
        </div>
      </>
  );
}
export default App;