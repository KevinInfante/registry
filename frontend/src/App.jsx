import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import './myIndex.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Add from './pages/Add'
import Search from './pages/Search'
import View from './pages/View'

let url = window.location.host;
      //if on port 5173, then we're running locally, therefore make call to 4001, otherwise use current url
  (url == "localhost:5173") ? url = "http://localhost:4001" : url = window.location.origin; //eg ...localhost:4001

function App() {
  const [clients, setClients] = useState([]);
  function loadClients(){
    axios.get(url+"/searching/")
    .then((res)=>{
        console.log("res.data: ", res.data);
        if(res.data != "received")
        setClients(res.data);
    });
  }
  // used to highlighting the active tab on the navbar
  const [addActive, setAddActive] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [view, showView] = useState(false);
  const [client, setClient] = useState();

  //stateful vars that track if the inputs are in an invalid state
  // const [validName, setValidName] = useState(false); //starts as false

  function toggleAdd(){
    //if it's true, set to false, else set to true
    setAddActive(true);
    if(searchActive) setSearchActive(false);
    showView(false);
  }
  function toggleSearch(){
    showView(true);
    
    if(addActive)setAddActive(false);
    setSearchActive(true);
    showView(false);
  }
  function toggleView(){
    if(searchActive) {
      setSearchActive(false);
      showView(true);
    }
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
        <li><Link className={searchActive ? 'active':''} to='/search'
          onClick={()=>{toggleSearch(); loadClients();}}>Search</Link></li>
        { view &&
          <li> <Link className='active'>View</Link></li>
        }
      </ul>

      {/**(as I understand it)
       * Here we define the routes, so that if the url matches the paths,
       * then the corresponding components will be loaded
       * the component will actually be rendered here, as in, below the unordered list
       */}
      <Routes>
        <Route path='/' element={<Add />}></Route>
        <Route path='/Search' element={<Search clients={clients}
          toggleView={toggleView} setClients={setClients}
           client={client} setClient={setClient}/>}> </Route>
        <Route path='/View' element={<View client={client} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
