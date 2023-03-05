import React, { useState, Fragment, useEffect } from 'react';
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import axios from 'axios';

function Map() {
  const [mapRef, setMapRef] = useState(null);
  const [selectedBusker, setSelectedBusker] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [data, setData] = useState(() => {
    axios.get('/people').then((response) => setData(response.data));
});
  const [zoom, setZoom] = useState(5);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  //const [data, setData] = useState([]);
  // const [sampleData, setData] = useState(null);

//   useEffect(() => {
//     axios.get('/people')
//         .then(response => setData(response.data.total));
// }, []);
// const sampleData = [];
//   useEffect(() => {
//     axios.get('/people').then((response) => setData(response.data));
// }, [useLoadScript, setMapRef, setClickedLatLng]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA9WCwVPxocNs_WAMQOARzSL08i5NJn8u4'
  });

  const sampleData = [
    { id: "Spiderman", location: "New York City, United States", pos: { lat: 40.6728, lng: -74.3280 }, description: "Mr Stark, I don't feel so good", image: "https://www.gannett-cdn.com/-mm-/cc053686530ce446f0a27dc352961fac33dd12ac/c=1144-81-2630-920/local/-/media/2017/06/26/USATODAY/USATODAY/636340759929048028-XXX-SPIDER-MAN-HOMECOMING-87249008.JPG?width=660&height=373&fit=crop&format=pjpg&auto=webp"},
    { id: "Harry Potter", location: "New York City, United States", pos: { lat: 40.6818, lng: -74.1372 }, description: "You're a wizard, Harry", image: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/09/29/15/hp.jpg?width=982&height=726&auto=webp&quality=75"},
  ];

  const fitBounds = map => {
    const bounds = new window.google.maps.LatLngBounds();
    sampleData.map(busker => {
      bounds.extend(busker.pos);
      return busker.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = map => {
    setMapRef(map);
    fitBounds(map);
  };

  const markerLoadHandler = (marker, place) => {
    return setMarkerMap(prevState => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, busker) => {
    setSelectedBusker(busker);
    console.log(data);
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    if (zoom < 13) {
      setZoom(5);
    }
  };

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          onLoad={loadHandler}
          onClick={e => setClickedLatLng(e.latLng.toJSON())}
          center={center}
          zoom={zoom}
          mapContainerStyle={{
            height: "70vh",
            width: "150vh"
          }}
        >
          {sampleData.map(place => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={marker => markerLoadHandler(marker, place)}
              onClick={event => markerClickHandler(event, place)}
              icon={{
                path:
                  "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                fillColor: "#ff4500",
                fillOpacity: 1.0,
                strokeWeight: 0,
                scale: 1.25
              }}
            />
          ))}

          {infoOpen && selectedBusker && (
            <InfoWindow
              anchor={markerMap[selectedBusker.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedBusker.id}</h3>
                <div>{selectedBusker.description}</div>
                <div>
                <img src={selectedBusker.image} alt="display image" />
            </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <h3>
          Center {center.lat}, {center.lng}
        </h3>

        {clickedLatLng && (
          <h3>
            Current Location: {clickedLatLng.lat}, {clickedLatLng.lng}
          </h3>
        )}

        {selectedBusker && <h3>Selected Busker: {selectedBusker.id}<br></br> Location: {selectedBusker.location} <br></br>{selectedBusker.description} <br></br>
        <img src={selectedBusker.image} alt="display image" />
        </h3>}
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}

export default Map;