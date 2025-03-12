import { useState } from 'react'
import axios from 'axios'

function Search(props){ //props.clients and props.setClients()
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredList, setFilter] = useState([]);
    // stateful variable for list from db
    // const [clients, setClients] = useState([]);

    var checkedBoxes = []; //size needs to expand as the # of clients grows.

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
    function Table(contact){   /*I splet Table and create table into 2 to get rid of the "each child in list ...unique key" warning */
        if(props.clients.length > checkedBoxes.length) checkedBoxes.push(false);
        return (
            <tr>
                <th scope='row'>{contact.index}</th>
                <td>{contact.name}</td>
                <td>{contact.number}</td>
                <td>{contact.address}</td>
                <td><input type="checkbox" value="delete" id={`check${contact.index}`}
                    name = {`${contact.index}`} onClick={(e)=>{checked(e)}}></input></td> {/*Is name necessary?*/}
            </tr>
        );
    }
    function createTable(client, index){
        return (
            <Table 
                key={index}
                name = {client.name}
                number = {client.number}
                address = {client.address}
                index = {index}
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
            if(checkedBoxes[i]==true){
                clientNumbers.push(props.clients[i].number);
                clientIndexes.push(i);
                console.log(clientNumbers);
            }
        }
        if(clientNumbers.length == 0){
            console.log("no client number found");
            return;
        }

        let deleteCode = window.prompt("Enter the code to delete all the checked boxes");

        if(deleteCode == 1972) {
            console.log("deleting.");
            let url = "http://localhost:4000/delete/";
            
            axios.delete(url, { 
                data: {
                    numbers: clientNumbers,
                }
            })
            .then(function(response){
                console.log("response: ", response);
                //presumably, the clients were deleted from the database

                //Then, I delete them from the stateful array too:
                // need to delete the large indexes first, so sort from large to small
                clientIndexes.sort((a, b) => b - a);
                let array = props.clients;
                console.log("indexes to be deleted: ", clientIndexes);
                console.log("clients array: ", array);
                for(let i = 0; i<clientIndexes.length; i++){
                    array.splice(clientIndexes[i], 1);
                }
                setFilter([]);
                console.log("new clients array: ", array);
                props.setClients(array);
        
            })
            .catch(function(error){
                console.log("error: ", error);
            });
        }
        else console.log("cancelled");

        console.log(checkedBoxes);
    }
    function checked(e){ // this function should change the checkedBoxes list to reflect their checked status
        console.log(e.target.name);
        
        let index = parseInt(e.target.name); //index of 0 is the first checkbox, 1 the second, etc.

        // if it's not checked, set it to true, else set it to false
        checkedBoxes[index] == false ? checkedBoxes[index] = true : checkedBoxes[index] = false;
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
                        <th scope="col" onClick={deleteAll}><button>delete</button></th>
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