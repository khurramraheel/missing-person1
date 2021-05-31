import React, { useEffect, useState } from 'react';
import Cards from './components/content/content';
import NavBar from './components/header/navbar';
import { BrowserRouter as Router, Route,Routes,Outlet } from 'react-router-dom';
import PostAd from './components/header/postAd';
import { Provider } from 'react-redux';
import myStore from './store/store';
import axios from 'axios';
import './App.css';
import UpdateAd from './components/content/updateAd';
import SinglePerson from './components/ad/ad';

function App() {
  return (
    <Router className='flow'>
      <Provider store={myStore}>
        <Route exact path='/'/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/detail/:_id' element={<SinglePerson/>}/>
          <Route path='/updatead/:id' element={<UpdateAd/>} />
          <Route path='/postad' element={<PostAd/>} />
          <Route path='*' element={<Nothing/>}/>

        </Routes>
        
      </Provider>
    </Router>
  );
}

function Home(){
  let [cards, setCards] = useState([]);

  useEffect(async () => {
    let token= localStorage.getItem('token');
    if (token!=null) {
      try {

        let resp = await axios.post(window.ip+'/checksession', { token });
        // console.log(resp.data);
        myStore.dispatch({
          type:"LOGIN_OK",
          payload:resp.data
        })
      } catch (e) {
        console.log(e);
      }
    }
  }, [])
  return<div>
    <NavBar  setCards={setCards} />
    <Cards  setCards={setCards} cards={cards} />
    <Outlet/>
  </div>
}
function Nothing(){
  return<h1>Not Found</h1>
}
export default App;
