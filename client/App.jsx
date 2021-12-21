import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Map from './Map.jsx';

const App = (props) => {
  const [init, setInit] = useState('This is the Deployed App!');
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({
    address: 'Brooklyn, NY',
    lat: 40.6781784,
    lng: -73.9441579
  });
  const [places, setPlaces] = useState([]);
  const [content, setContent] = useState('');
  const [contentName, setContentName] = useState('');
  const [mapHeader, setMapHeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [buttonCont, setButtonCont] = useState('Add a Point of Interest')
  const [candidates, setCandidates] = useState([]);
  const [photos, setPhotos] = useState(null);
  const [zoom, setZoom] = useState(13);

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
        setMapHeader(e.target.name.value)
      });
    axios.get('/showCity?name=' + options)
      .then(data => {
        setLocation({
          address: e.target.name.value,
          lat: data.data.lat,
          lng: data.data.lng
        });
        setZoom(13);
        console.log(data.data);
      });
      console.log(location);
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
      .then(data => findSpots(e.target.city.value))
    setShowModal(false);
    setButtonCont('Add another Point of Interest');
  };

  const handleModal = e => {
    e.preventDefault();
    setShowModal(!showModal)
    setButtonCont('Hide Form')
    if (buttonCont === 'Hide Form') {
      setButtonCont('Add another Point of Interest');
    }
  }

  const getDetails = e => {
    e.preventDefault();
    console.log(e.target.place.value)
    axios.get('/findplacefromtext?name=' + e.target.place.value)
      .then(data => {
        setCandidates(data.data)
      });
  };

  const autofill = e => {
    e.preventDefault();
    console.log(e.target.text)
  }

  const getPhotos = name => {
    console.log('getting photos for', name);
    axios.get('/photos?name=' + name)
      .then(data => setPhotos(data.data))
      .catch(err => console.error(err))
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
          <>
            <form className="content" id="newEdition" onSubmit={getDetails}>
              <input type="text" name="place" placeholder="Please enter the name of the locale"/>
              <input type="submit" value="Submit" />
            </form>
            {candidates ? candidates.map(candidate => <div><a onClick={autofill} href="#">{candidate.formatted_address}</a></div>) : null}
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
          </>
          : null
        }
        <button onClick={handleModal}>{buttonCont}</button>
        <div>
            <div>
              <div className="map">
              </div>
              <div className="content">
              <form onSubmit={findSpots} id="citySearch">
                <input type="text" name="name" placeholder="Search a City" />
                <input type="submit" value="Submit" />
              </form>
              {
                places ? places.map(place => {
                  return (
                    <>
                        <ul>
                          <li border="1px solid black" onClick={()=>{
                            setLocation({
                              address: place.street,
                              lat: place.lat,
                              lng: place.lng
                            });
                            setContent(place.comments);
                            setContentName(place.name);
                            setMapHeader(place.name + ', ' + place.street);
                            setZoom(17);
                            getPhotos(place.name);
                          }}>{place.name}, {place.street}</li>
                        </ul>
                      </>
                    )
                  }) : null
                }
                <Map location={location} zoomLevel={zoom} header={mapHeader}/>
              {
                content ?
                <>
                  <div id="contentName">
                    {contentName}
                  </div>
                  <div id="contents">
                    {content}
                  </div>
                  <div>
                    {
                      photos ? photos.map(photo => <img src={photo.image.thumbnailLink} />) : null
                    }
                  </div>
                </>
                : null
              }
              </div>
            </div>
        </div>
      </>
  );
}
export default App;