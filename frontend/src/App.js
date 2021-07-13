import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { MAP_TOKEN } from './config';
import './App.css';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import axios from 'axios';
import {format} from "timeago.js"
import Register from './components/Register';
import Login from './components/Login';
function App() {
  const myStorage = window.localStorage;
  
  const [currentUser,setCurrentUser] = useState(null);

  const [pins, setPins] = useState([])
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(null);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  React.useEffect(() => {
    if(myStorage.getItem('user')){
      setCurrentUser(true);
    }

    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
   
      } catch (error) {
        console.log(error)
      }
    }
    getPins();
  }, [])

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})

  }

  const handleAddClick = (e) =>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      long,lat
    })

}
const handleLogout =() =>{
  myStorage.removeItem('user');
  setCurrentUser(null);
}
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin ={
      username:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }

    try {
      const res = await axios.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error)
    }
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
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p className="desc">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                {Array(parseInt(p.rating)).fill(<StarIcon className="star" />)}
         
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
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}></input>
              <label>Review</label>
              <textarea placeholder="Say us something about this place." onChange={(e)=>setDesc(e.target.value)}/>
              <label>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)}>
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
        {currentUser ? ( <button className="button logout" onClick={()=>handleLogout()}>Logout</button>) :(<div className="buttons">
        <button className="button login" onClick={() =>setShowLogin(true)}>Login</button>
        <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
        </div>)}
       
        {showRegister && <Register setShowRegister={setShowRegister}/>}      
        {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} myStorage={myStorage}/>}   
        </ReactMapGL>

    </>
  );
}

export default App;
