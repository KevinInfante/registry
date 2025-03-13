import { useState } from 'react'
import axios from 'axios'


function Add(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd; //format: 2025-03-12

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [added, showAdded] = useState(false);

  //stateful vars that track if the inputs are in an invalid state
  // const [validName, setValidName] = useState(false); //starts as false
  const [err, setErr] = useState("");

  function processResponse(){
    //note, what I want to do: get rid of the form, use controlled component method - 
    // ("one source of truth") so that I can modify the text in the inputs by changing
    // the stateful variables. Then I will be able to do more checking to make sure
    // that the responses match the desired format.

    setLoading(true);
    //note/ TODO: i need to clear the stateful vars after submitting, or else submit
    // btn works again (with fields empty)

    console.log("Submit button pressed");
    console.log("name: ", name);
    console.log("last name: ", lastName)
    console.log("number: ", number);
    console.log("address: ", address);
    console.log("date: ", today);

    let nameMsg, numberMsg, addressMsg;
    nameMsg = numberMsg = addressMsg = "";
    if(isNaN(number) || number.length != 10) numberMsg = "Phone number must be 10 digits. "

    if(name=="" || lastName =="") nameMsg = "Name required. ";
    if(number=="") numberMsg = "Phone number required. ";
    if(address=="") addressMsg = "address required. ";

    let errMsg = nameMsg + numberMsg + addressMsg;

    if(errMsg != ""){
      setErr(errMsg);
      return;
    }
    setErr("");

    let formattedDate = today.slice(5, 10) + '-'+today.slice(0, 4);

    const url = "http://localhost:4000";
    //make a call, using the phone number (lol)
    // if client is not in the database, add them
    // if client is already in the database for today, set err to "client already added today"
      // if client is in the database for previous day, create prompt:
       //client last came on ..., add for today? (enter code?)
    axios.get(url+`/search/${number}`)
    .then(function(response){
      console.log("client already added:");
      console.log(response);
      //check if the last pick up date matches today's date...
      console.log("DATE:", response.data.date);
      let lastPickUp = response.data.date[response.data.date.length-1]
      let dates = response.data.date;
      if(lastPickUp==formattedDate){
        setErr("Client already added today");
        setLoading(false);
        return;
      }
      else{
        if(confirm(`Client last picked up on ${lastPickUp}. Add again for today?`)){
          console.log("update request...")
          dates.push(formattedDate);
          axios.put(url+`/update/${number}`, {
            number:number,
            dates:dates
          })
          .then(res=>{
            console.log(res);
            //set loading
            //set added
            setLoading(false);
            showAdded(true);
            setTimeout(()=>showAdded(false), 3000);
            return;
          })
          .catch(erro=>{
            console.log("error: ",erro);
            setLoading(false);
            setErr("Server error, couldn't update");
          })
        } else {
          setLoading(false);
          return;
        }
      }
    })
    .catch(function(error){
      console.log("New client, adding...");
      axios.post(url+"/add", {
        name:name,
        number:number,
        address:address,
        lastName: lastName,
        date: [formattedDate]
      })
      .then(function(response){
        console.log("response: ", response);
        setLoading(false);
        showAdded(true);
        setTimeout(()=>showAdded(false), 3000);
      })
      .catch(function(error){
        console.log("error: ", error);
        setLoading(false);
      });
    })
    
  }

  function changeDate(e){ //temporary
    console.log(e.target);
    today = e.target.value;
  }

  return (
    <>
      <form action={processResponse}>
      <p>First Name</p>
      <input onChange={(e)=>{setName(e.target.value); }} type="text"></input>
      <p>Last Name</p>
      <input onChange={(e)=>{setLastName(e.target.value); }} type="text"></input>
      <p>Phone Number</p>
      <input onChange={(e)=>{setNumber(e.target.value); }}type="text"></input>
      <p>Address</p>
      <input onChange={(e)=>{setAddress(e.target.value); }} type="text"></input>
      {/* <br></br>
      <label for="pickupDay">Date:</label> */}
      <p>date</p>
      <input type="date" id="pickupDay" name="Date" onChange={changeDate}
      defaultValue={today}></input>
      <br></br>
      <br></br>
      <button type='submit'>Submit</button>
      { loading &&
        <p style={{color:'yellow'}}>Loading</p>
      }
      { added &&
        <div className='success'>Added</div>
      }
      {err &&
       <div className='error'>{err}</div>
      }
      </form>
    </>
  )
}

export default Add;