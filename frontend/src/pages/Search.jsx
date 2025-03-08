import { useState } from 'react'
import axios from 'axios'

function Search(props){
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredList, setFilter] = useState("");
    // stateful variable for list from db
    // const [clients, setClients] = useState([]);

    //function that makes call to the db
    const url = "http://localhost:4000/search/";
    function sendSearch(e){
        setSearchTerm(e.target.value);
        if(e.target.value=="") setFilter(props.clients);
        else{
            setFilter([]);
            let arr = [];
            let len = e.target.value.length;
            if(isNaN(e.target.value)){
            props.clients.forEach(client=>{
                if(client.name.slice(0, len)==e.target.value){
                    //setFilter([...filteredList, client])
                    arr.push(client);
                }
            })
            }
            else{
            props.clients.forEach(client=>{
                if(client.number.slice(0, len)==e.target.value){
                    //setFilter([...filteredList, client])
                    arr.push(client);
                }
                //else{console.log(e.target.value, client.number.slice(0, len));}
            })
            }
            setFilter(arr);
        }
    }

    // function handleChange(event){
    //     console.log(event.target.value);
    //     setSearchTerm(event.target.value);
    //     console.log(searchTerm);
    // }

    function createTable(client, index){
        return (
            <tr>
                <th scope='row'>{index}</th>
                <td>{client.name}</td>
                <td>{client.number}</td>
                <td>{client.address}</td>
            </tr>
        );
    }

    return (
        <>
            <h1>Search</h1>
            <input type="text" placeholder="name or phone #"
            onChange={sendSearch} value={searchTerm}></input>
            
            {/*filteredList ? ( */}
            
            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        {/* <th>Last</th> */}
                        <th scope="col">Phone</th>
                        <th scope="col">address</th>
                    </tr>
                </thead>
                <tbody>
                
                {filteredList ? 
                    (filteredList.map(createTable))  
                :
                (
                    (props.clients.map(createTable))
                )}
            </tbody>
            </table>
            
        </>
    )
}

export default Search;