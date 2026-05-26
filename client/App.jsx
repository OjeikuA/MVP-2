import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map.jsx';

const App = () => {
  const [init, setInit] = useState('This is the Deployed App!');
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
  const [candidates, setCandidates] = useState([]);
  const [photos, setPhotos] = useState(null);
  const [zoom, setZoom] = useState(13);
  const [formData, setFormData] = useState({
    name: '', street: '', city: '', state: '', zip: '', menu: '', comments: ''
  });

  const fetchCity = async (cityName) => {
    try {
      const options = cityName.split(' ').join('+');
      const [spotsRes, cityRes] = await Promise.all([
        axios.get('/findSpot?name=' + options),
        axios.get('/showCity?name=' + options)
      ]);
      setPlaces(spotsRes.data);
      setMapHeader(cityName);
      setLocation({
        address: cityName,
        lat: cityRes.data.lat,
        lng: cityRes.data.lng
      });
      setZoom(13);
    } catch (err) {
      console.error('Error fetching city:', err);
    }
  };

  const findSpots = async (e) => {
    e.preventDefault();
    await fetchCity(e.target.name.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/newSpot', formData);
      setShowModal(false);
      setFormData({ name: '', street: '', city: '', state: '', zip: '', menu: '', comments: '' });
      await fetchCity(formData.city);
    } catch (err) {
      console.error('Error saving spot:', err);
    }
  };

  const handleModal = () => {
    setShowModal(prev => !prev);
  };

  const getDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get('/findplacefromtext?name=' + e.target.place.value);
      setCandidates(data);
    } catch (err) {
      console.error('Error getting place details:', err);
    }
  };

  const autofill = (e, address) => {
    e.preventDefault();
    const parts = address.split(', ');
    const stateZip = parts[2] ? parts[2].trim().split(' ') : [];
    setFormData(prev => ({
      ...prev,
      street: parts[0] || '',
      city: parts[1] || '',
      state: stateZip[0] || '',
      zip: stateZip[1] || '',
    }));
  };

  const getPhotos = async (name) => {
    try {
      const { data } = await axios.get('/photos?name=' + name);
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  };

  useEffect(() => {
    axios.get('/test')
      .then(({ data }) => setInit(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h1>{init}</h1>
      <button type="button" onClick={handleModal}>
        {showModal ? 'Hide Form' : 'Add a Point of Interest'}
      </button>
      {showModal && (
        <>
          <form className="content" id="newEdition" onSubmit={getDetails}>
            <input type="text" name="place" placeholder="Please enter the name of the locale" />
            <input type="submit" value="Submit" />
          </form>
          {candidates.length > 0 && (
            <div>
              {candidates.map((candidate, i) => (
                <div key={i}>
                  <a href="#" onClick={(e) => autofill(e, candidate.formatted_address)}>
                    {candidate.formatted_address}
                  </a>
                </div>
              ))}
            </div>
          )}
          <form className="form" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name of Location" />
            <input type="text" name="street" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} placeholder="Street Address" />
            <input type="text" name="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
            <input type="text" name="state" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="State" />
            <input type="text" name="zip" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} placeholder="Zip" />
            <input type="text" name="menu" value={formData.menu} onChange={e => setFormData({ ...formData, menu: e.target.value })} placeholder="Relevant Menu Items" />
            <input type="text" name="comments" value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })} id="Comments" size="100" placeholder="Comments" />
            <input type="submit" value="Submit" />
          </form>
        </>
      )}
      <div>
        <div>
          <div className="map"></div>
          <div className="content">
            <form onSubmit={findSpots} id="citySearch">
              <input type="text" name="name" placeholder="Search a City" />
              <input type="submit" value="Submit" />
            </form>
            <ul>
              {places.map(place => (
                <li
                  key={place._id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setLocation({ address: place.street, lat: place.lat, lng: place.lng });
                    setContent(place.comments);
                    setContentName(place.name);
                    setMapHeader(place.name + ', ' + place.street);
                    setZoom(17);
                    getPhotos(place.name);
                  }}
                >
                  {place.name}, {place.street}
                </li>
              ))}
            </ul>
            <Map location={location} zoomLevel={zoom} header={mapHeader} />
            {content && (
              <>
                <div id="contentName">{contentName}</div>
                <div id="contents">{content}</div>
                <div>
                  {photos && photos.map((photo, i) => (
                    <img key={i} src={photo.image.thumbnailLink} alt={contentName} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
