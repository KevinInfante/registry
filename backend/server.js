// import express
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";

// axios
import axios from 'axios'

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json()); //this is necessary for the axios call from the frontend to work
const port = 4000;

app.post("/add", (req, res) => {
    //req.body.name
    //req.body.number
    //req.body.address

    console.log("/add called");
    console.log("client details: ", req.body.name, req.body.number, req.body.address);
    res.status(200).send("successful");
})

// app.listen...
app.listen(port, ()=>{
    console.log("Listening on port ", port);
})