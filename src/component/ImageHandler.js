import React from 'react'
import { useLocation } from "react-router-dom";
import '../App.css'
function ImageHandler(props) {
  const location = useLocation();
  const data = location.state;
  return (
    <div className='name'> 
        <img src={data} alt={`Flickr`} style={{ width: '80vw', height: '100vh', margin: '15px' }} />
    </div>
  )
}

export default ImageHandler