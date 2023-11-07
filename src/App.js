import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// static flickr api link for fetching images 
const FLICKR_API_KEY = '64a081be870a0a06ef33bc9cf16b2f6b';
const FLICKR_API_URL = 'https://www.flickr.com/services/rest/';
const App = () => {

  // our use states for this project
  let [query, setQuery] = useState("");
  let [photos, setPhotos] = useState([]);
  let [d, setD] = useState("");
  const navigate = useNavigate();  // used for routing purposes 

  let [imageUrls, setImageUrls] = useState([]);

  let [previous, setPrevious] = useState([]);

  // useEffect for fetching previous searches of a user 
  useEffect(() => {
    var myData = localStorage.getItem('myDataStorage');
    if (myData === null) {
      return;
    }
    myData = JSON.parse(myData);
    setPrevious(myData);
  }, [])

  // useEffect for fetching images for a particular keyword
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const apiKey = '64a081be870a0a06ef33bc9cf16b2f6b';
        // const apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${apiKey}&format=json&nojsoncallback=1`;



        // const res = await fetch(apiUrl);
        const res = await axios.get(FLICKR_API_URL, {
          params: {
            method: 'flickr.photos.search',
            api_key: FLICKR_API_KEY,
            format: 'json',
            nojsoncallback: 1,
            text: query,
            safe_search: 1
          }
        });

        console.log(res);
        if (!res.ok) {
          // return;
        }

        // const data = await res.json();
        const photos = res.data.photos.photo;
        const urls = photos.map(photo => {
          return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        });

        if (urls.length === 0) {
          return;
        }

        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [query]); // Empty dependency array to run this effect only once





  // Function to fetch recent photos by default
  const fetchRecentPhotos = async () => {
    try {
      const response = await axios.get(FLICKR_API_URL, {
        params: {
          method: 'flickr.photos.getRecent',
          api_key: FLICKR_API_KEY,
          format: 'json',
          nojsoncallback: 1,
          safe_search: 1
        }
      });

      console.log(response.data.photos.photo);

      let urls = response.data.photos.photo.map(photo => {
        return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
      });


      setPhotos(urls);
      //  console.log(photos);
    } catch (error) {
      console.error('Error fetching recent photos:', error);
    }
  };

  // Fetch recent photos by default on component mount
  useEffect(() => {
    fetchRecentPhotos();
  }, []);

  // event for click on a search button
  let handleClick = (e) => {
    setQuery(d);
    let arr = [...previous];
    // Method (return element > 0).
    let found = arr.indexOf(d);

    console.log(found);

    if(found===-1){
      arr.unshift(d);
    }
    else{
      // Removing the specified element from the array 
      let spliced = arr.splice(found, 1);
      // arr = spliced;
      console.log(arr);
      arr.unshift(d);
    }
    
    while(arr.length>5){
      arr.pop();
    }

    setPrevious(arr);
    // set the data 
    localStorage.setItem('myDataStorage', JSON.stringify(arr));
  }

  const handleChange = event => {
    setD(event.target.value);
    // console.log(d);
  };

  let reset = () => {
    setQuery("");
    setD("");
  }

  let handleImageHandler = (e) => {
    // console.log(e.target.src);
    navigate("/image", { state: e.target.src });
  }

  return (
    <div className='page'>
      <h1 onClick={reset}>Reactjs Assignment</h1>
      <div className='input'>
        <input list='programmingLanguages' type='text' onChange={handleChange}
          value={d} />
        <datalist id="programmingLanguages">
          {previous.map((pre, index) => (
            <option key={index} value={pre} />
          ))}
        </datalist>
        <button onClick={handleClick}>Search</button>
      </div>

      <div className="image-container">
        {imageUrls.length !== 0 ?
          (imageUrls.map((url, index) => (
            <img onClick={handleImageHandler} key={index} src={url} alt={`Flickr ${index}`} style={{ width: '300px', height: 'auto', margin: '5px' }} />
          ))) :
          (photos.map((url, index) => (
            <img onClick={handleImageHandler} key={index} src={url} alt={`Flickr ${index}`} style={{ width: '300px', height: 'auto', margin: '5px' }} />
          )))
        }
      </div>
    </div>
  );
};

export default App;



