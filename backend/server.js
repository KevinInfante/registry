// import express
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import db from "./config.js"

import path from 'path';
const __dirname = import.meta.dirname;

// axios
import axios from 'axios'

//mongo
import pg from "pg";

const client = new pg.Client(db);
client.connect(); 

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json()); //this is necessary for the axios call from the frontend to work
const port = 4001;

app.post("/add", async (req, res) => {
    //req.body.name
    //req.body.number
    //req.body.address

    console.log("/add called");
    console.log("client details: ", req.body.name, req.body.number, req.body.address);
    let object = req.body;
    console.log("client: ",object);
    let {name, lastName, number, address, date} = object;
    console.log("destr", name, lastName, number, address, date);

    // search the database to see if client already exists
    // if not, add to database and send "successfully inserted"

    try{
        //await client.connect();
        await client.query("INSERT INTO clients (name, lastname, number, address, date)\
            VALUES ($1, $2, $3, $4, $5)",[name, lastName, number, address, date]);
        res.status(200).send("successfully inserted");
        console.log("successfully inserted");
    }
    catch(err){
        console.log("error: ", err);
        res.status(400).send("error: ", err);
    }
})

app.get('/searching/', async (req, res) => {
    console.log("sending full list...")
    try{
        var result = await client.query("SELECT * FROM clients")
        res.status(200).send(result.rows);
        console.log(result.rows);
    }catch{
        console.log("something went wrong");
    }
});

// endpoint below is for getting a specific client by phone number
app.get('/searching/:search', async (req, res) => {
    let search = req.params.search; //should be a number
    console.log("search: ",search);
    try{
        var result = await client.query("SELECT * WHERE number = $1", [search])
        if(result.rows.length>0) {
            console.log("found");
            res.status(200).send(result);
        }
        else{
            console.log("result: ", result);
            throw new Error("Not found");
        }
        //res.status(200).send(result);
    }
    catch(err){
        res.status(404).send("something wrong");
    }
});

app.delete('/delete', async(req, res)=>{
    console.log("request received");
    console.log("body:",req.body);
    let numbers = req.body.numbers; //an array of phone numbers
    console.log(numbers);

    try{
        await client.connect();
        var result = await dbo.collection(db.collection)
            .deleteMany({number: {$in: numbers}});
        res.status(200).send(result);
        console.log(result);
    }catch{
        console.log("something went wrong");
        res.status(500).send("something went wrong");
    }finally{
        client.close();
    }
    //res.status(200).send("ok");
})

// .put or .post is probably identical, that's how it is in axios
app.put('/update/:number', async (req, res) =>{
    console.log("body: ",req.body); // body: {number: '111...', dates: [...]}
    let query = { "number": req.body.number };
    var customer = { //only sending the dates bc that's what I want updated
        "date": req.body.dates
    }
    try{
        await client.connect();
        var result = await dbo.collection(db.collection).updateOne(query, {$set: customer});
        if(result){
            console.log("result: ", result);
            res.status(200).send(result);
        }  else{
            console.log("NULL RESULT? ", result);
            throw new Error("update failed");
        }
    } catch(err){
        console.log("error: ", err);
        res.status(400).send(err);

    } finally {
        client.close();
    }
})

app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

// app.listen...
app.listen(port, ()=>{
    console.log("Listening on port ", port);
})