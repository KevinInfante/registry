import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import './myIndex.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import Add from './pages/Add'
import Search from './pages/Search'

function App() {
  const [clients, setClients] = useState([]);
  function loadClients(){
    const url = "http://localhost:4000/search/";
    axios.get(url)
    .then((res)=>{
        console.log("res.data: ", res.data);
        if(res.data != "received")
        setClients(res.data);
    });
  }
  // used to highlighting the active tab on the navbar
  const [addActive, setAddActive] = useState(true);
  

  //stateful vars that track if the inputs are in an invalid state
  // const [validName, setValidName] = useState(false); //starts as false

  function toggleAdd(){
    //if it's true, set to false, else set to true
    if(!addActive) setAddActive(true);
  }
  function toggleSearch(){
    if(addActive) setAddActive(false);
  }

  return (
    <BrowserRouter>
      

      {/**
       * Here is the mechanism for setting the path, instead of <a href='/...'>
       * we us <Link to='/...' />
       */}
      <ul>
        <li><Link className={addActive ? 'active':''} to="/"
          onClick={toggleAdd}>Add</Link></li>
        <li><Link className={addActive ? '':'active'} to='/search'
          onClick={()=>{toggleSearch(); loadClients();}}>Search</Link></li>
      </ul>

      {/**(as I understand it)
       * Here we define the routes, so that if the url matches the paths,
       * then the corresponding components will be loaded
       * the component will actually be rendered here, as in, below the unordered list
       */}
      <Routes>
        <Route path='/' element={<Add />}></Route>
        <Route path='/Search' element={<Search clients={clients}
          setClients={setClients} />}> </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
