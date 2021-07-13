import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { MAP_TOKEN } from './config';
import './App.css';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import axios from 'axios';
import {format} from "timeago.js"
function App() {
  const currentUser = "jain"
  const [pins, setPins] = useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getPins();
  }, [])

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})
    console.log(currentPlaceId)
  }

  const handleAddClick = (e) =>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      long,lat
    })
    console.log(newPlace)
}

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/dizzyhip/ckr1kxrrvez0817nw6anz0urk"
        onClick={handleAddClick}
        transitionDuration="1000"
      >
        
        {pins.map((p,index) => (
          
          <>
          
          <Marker latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-10}>
            <RoomIcon style={{ fontSize: viewport.zoom * 5, color: p.username=== currentUser ? "tomato":"slateblue",cursor:"pointer" }}  onClick={() =>handleMarkerClick(p._id,p.lat,p.long)}/>
          </Marker>
          {p._id === currentPlaceId && (<Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            onClose={()=>setCurrentPlaceId(null)}
            anchor="left" >
            <div className="card">
              <label>Place</label>
              <h4 className="place">Eiffe Tower</h4>
              <label>Review</label>
              <p className="desc">Beautiful place. I like it.</p>
              <label>Rating</label>
              <div className="stars">
               
                <StarIcon className="star" />
                <StarIcon className="star" />
                <StarIcon className="star" />
                <StarIcon className="star" />
                <StarIcon className="star" />
              </div>

              <label>Information</label>
              <span className="username">Created by <b>{p.username}</b></span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
        </Popup>)
          }
          {newPlace &&
       <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={()=>setNewPlace(null)}
            anchor="left" >
           <div>
            <form>
              <label>Title</label>
              <input placeholder="Enter a title"></input>
              <label>Review</label>
              <textarea placeholder="Say us something about this place."/>
              <label>Rating</label>
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>

           </div>
        </Popup>
        
           }
        </>

        ))}
        
      </ReactMapGL>

    </>
  );
}

export default App;
