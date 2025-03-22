import { useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'

function Search(props){ //props.clients and props.setClients()
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredList, setFilter] = useState([]);
    // stateful variable for list from db
    // const [clients, setClients] = useState([]);

    var checkedBoxes = []; //size needs to expand as the # of clients grows.

    //function that makes call to the db
    //const url = "http://localhost:4001/searching/";
    let url = window.location.host;
    (url == "localhost:5173") ? url = "http://localhost:4001" : url = window.location.origin; 
    function sendSearch(e){
        setSearchTerm(e.target.value);
        if(e.target.value=="") setFilter([]);
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
    function Table(contact){   /*I split Table and create table into 2 to get rid of the "each child in list ...unique key" warning */
        if(props.clients.length > checkedBoxes.length) checkedBoxes.push(0);
        return (
            <tr>
                <th scope='row'>{contact.index}</th>
                <td><Link to={'/view'} onClick={()=>{props.setClient(contact); props.toggleView();}}
                     className='view' >{contact.name}</Link></td>
                <td>{contact.lastName}</td>
                <td>{contact.number}</td>
                <td>{contact.address}</td>
                <td>{contact.date[contact.date.length-1]}</td>
                <td><input type="checkbox" value="delete" id={`${contact.index}`/* formerly `check${contact.index}` */} 
                    name = {`${contact.number}`} onClick={(e)=>{checked(e)}}></input></td> {/*Is name necessary?*/}
            </tr>
        );
    }
    function createTable(client, index){
        return (
            <Table 
                key={index}
                name = {client.name}
                lastName = {client.lastname}
                number = {client.number}
                address = {client.address}
                index = {index}
                date = {client.date}
             />
        );
    }

    function deleteAll(){ //this function should handle deleting all the entries corresponding to checked boxes
        // props.setClients() function can be used to change the clients array
          // might need to change filteredList too
        // need to do an api call to the server for a database delete

        //confirm("Would you like to delete all the check Entries?");

        //search checkedBoxes for true indexes
        var clientNumbers = [];
        var clientIndexes = [];
        for (let i = 0; i <checkedBoxes.length; i++){
            if(checkedBoxes[i]){ //returns false if [i] is 0, true otherwise 
                clientNumbers.push((checkedBoxes[i])); //should be a number //props.clients[i].number
                clientIndexes.push(i);
            }
        }
        if(clientNumbers.length == 0){
            console.log("no client number found");
            return;
        }

        let deleteCode = window.prompt("Enter the code to delete all the checked boxes");

        if(deleteCode == 1972) {
            console.log("deleting.");
            
            console.log(clientNumbers);
            axios.delete(url+'/delete', { 
                data: {
                    numbers: clientNumbers,
                }
            })
            .then(function(response){
                console.log("response: ", response);
                //presumably, the clients were deleted from the database

                //Then, I delete them from the stateful array too:
                // need to delete the large indexes first, so sort from large to small
                
                let array = props.clients;
                console.log("indexes to be deleted: ", clientIndexes);
                //console.log("clients array: ", array);

                //the indexes are useless if boxes were checked on the filtered list
                // if size of filteredList is 0, means boxes weren't checked on filtered list
                if(filteredList.length != 0){ //if size ISN'T 0, boxes checked on filterd list
                    console.log("FILTER DELETE TRIGGERED");
                    //go thru the clients array, look for phone # matches
                    // and rewrite the client indexes array
                    clientIndexes = [];
                    for(let i = 0; i<checkedBoxes.length; i++){
                        if(checkedBoxes[i] == 0) continue;
                        for(let j = 0; j<array.length; j++){
                            if(checkedBoxes[i] == array[j].number){
                                clientIndexes.push(j);
                                break;
                            }
                        }
                    }
                    console.log("DELETE INDEXES:", clientIndexes);
                }
                clientIndexes.sort((a, b) => b - a); //client indexes sorted from largest to smallest
                for(let i = 0; i<clientIndexes.length; i++){
                    array.splice(clientIndexes[i], 1);
                }
                setFilter([]); // OR //sendSearch(searchTerm)
                setSearchTerm("");
                //console.log("new clients array: ", array);
                props.setClients(array);
        
            })
            .catch(function(error){
                console.log("error: ", error);
            });
        }
        else console.log("cancelled");
    }
    function checked(e){ // this function should change the checkedBoxes list to reflect their checked status
        console.log(e.target.name); // I made element name equal to the client number
        
        let index = parseInt(e.target.id); //index of 0 is the first checkbox, 1 the second, etc.

        // if it's not checked, set it to the #, else set it to 0
        checkedBoxes[index] == 0 ? checkedBoxes[index] = (e.target.name) : checkedBoxes[index] = 0;
    }

    return (
        <>
            <h1>Search</h1>
            <input type="text" placeholder="name or phone #"
            onChange={sendSearch} value={searchTerm}></input>
            
            {/*filteredList ? ( */}
            
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Address</th>
                        <th scope="col">Last pick up</th>
                        <th scope="col" onClick={deleteAll}><button className='del'>delete</button></th>
                    </tr>
                </thead>
                <tbody>
                
                {filteredList.length != 0 ? 
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