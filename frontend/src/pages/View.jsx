import {useState} from "react";
import axios from "axios";

function View(props){
    //const [cameToday, setCameToday] = useState(false);
    const [loading, setLoading] = useState(false);
    const [added, showAdded] = useState(false);
    const [err, setErr] = useState("");

    var cameToday = false;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy; 

    let url = window.location.host;
  (url == "localhost:5173") ? url = "http://localhost:4001" : url = window.location.origin;

    var dates = props.client.date;
    if(props.client.date[props.client.date.length-1]==today){
        //setCameToday(true);
        cameToday = true;
    } //else setCameToday(false);

    function addToday(){
        // check if dates contains today
        if(dates[dates.length-1] == today){
            cameToday=true; //doens't re-render since this isn't a hook
            setErr("Already added for today");
            setTimeout(()=>showAdded(""), 3000);
        }
        // if not, add
        else{
            dates.push(today);
            setLoading(true);
            axios.put(url+`/update/${props.client.number}`, {
                number:props.client.number,
                dates:dates
              })
              .then(res=>{
                console.log(res);
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
        }
    }

    console.log("dates:",props.client.date);
    return (
        <div className="container">
            <h1>{props.client.name} {props.client.lastName}</h1>
            <p>phone number: {props.client.number}</p>
            <p>adress: {props.client.address}</p>
            {/* <h1>Pick up dates:</h1> */}
            <p><strong>Pick up dates:</strong></p>
            {props.client.date.map((day)=>{
                return (
                    <p>{day}</p>
                )
            })}
            { cameToday  ?
                (<button disabled style={{backgroundColor:"gray"}} >
                    Add today</button>)
                :
                (<button onClick={addToday}
                    style={{backgroundColor:"darkgreen"}}>Add today</button>)
            }
            { loading &&
                <>
                <br></br>
                <div class="spinner-border" role="status">
                <span class="sr-only"></span>
                </div>
                </>
            }
            { added &&
                <div className='success'>Added</div>
            }
            {err &&
            <div className='error'>{err}</div>
            }

        </div>
    )
}

export default View;