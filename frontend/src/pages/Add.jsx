import { useState } from 'react'
import axios from 'axios'


function Add(){
    const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  //stateful vars that track if the inputs are in an invalid state
  // const [validName, setValidName] = useState(false); //starts as false

  function processResponse(){
    //note, what I want to do: get rid of the form, use controlled component method - 
    // ("one source of truth") so that I can modify the text in the inputs by changing
    // the stateful variables. Then I will be able to do more checking to make sure
    // that the responses match the desired format.

    console.log("Submit button pressed");
    console.log("name: ", name);
    console.log("number: ", number);
    console.log("address: ", address);

    if(name=="") return;
    if(number=="") return;
    if(address=="") return;

    const url = "http://localhost:4000/add";

    axios.post(url, {
      name:name,
      number:number,
      address:address
    })
    .then(function(response){
      console.log("response: ", response);

    })
    .catch(function(error){
      console.log("error: ", error);
    });
    
  }

  return (
    <>
      <form action={processResponse}>
      <p>name</p>
      <input onChange={(e)=>{setName(e.target.value); }} type="text"></input>
      <p>phone number</p>
      <input onChange={(e)=>{setNumber(e.target.value); }}type="text"></input>
      <p>address</p>
      <input onChange={(e)=>{setAddress(e.target.value); }} type="text"></input>
      <br></br>
      <br></br>
      <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Add;