// import express
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import db from "./config.js"

// axios
import axios from 'axios'

//mongo
import mongodb from 'mongodb'

const uri = "mongodb+srv://"+db.user+":"+db.pass+"@"+db.host+"/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);
let dbo = client.db(db.name);

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json()); //this is necessary for the axios call from the frontend to work
const port = 4000;

app.post("/add", async (req, res) => {
    //req.body.name
    //req.body.number
    //req.body.address

    console.log("/add called");
    console.log("client details: ", req.body.name, req.body.number, req.body.address);
    let object = req.body;
    console.log("client: ",object);

    // search the database to see if client already exists
    // if not, add to database and send "successfully inserted"

    try{
        await client.connect();
        await dbo.collection(db.collection).insertOne(object);
        res.status(200).send("successfully inserted");
        console.log("successfully inserted");
    }
    catch(err){
        console.log("error: ", err);
        res.status(400).send("error: ", err);
    }
    finally{
        client.close();
    }
})

app.get('/search/', async (req, res) => {
    console.log("sending full list...")
    try{
        await client.connect();
        var result = await dbo.collection(db.collection)
            .find({}).toArray();
        res.status(200).send(result);
        console.log(result);
    }catch{
        console.log("something went wrong");
    }finally{
        client.close();
    }
});

// endpoint below probably isn't necessary anymore, since I just use the one above
// to get the whole list and js array functions to filter it.
app.get('/search/:search', async (req, res) => {
    let search = req.params.search; //could be a name or a number
    console.log("search: ", search);
    if(isNaN(search)){ //search by name
        try{
            console.log("search by name: ", search);
            await client.connect();
            var result = await dbo.collection(db.collection)
                .find({"name":search}).toArray();
            res.status(200).send(result);
        } catch{
            console.log("something went wrong");
            res.status(400).send("received");
        } finally{
            client.close();
        }
    } else { // search by phone number
        console.log("search by number: ", search);
        try{
            await client.connect();
            var result = await dbo.collection(db.collection)
            .find({"number":search}).toArray();
            res.status(200).send(result);
        } catch{
            console.log("something went wrong");
            res.status(400).send("received");
        } finally{
            client.close();
        }
    }
    //res.status(200).send("received");

    // try{
    //     await client.connect();
    //     var result = await dbo.collection(db.collection)
    //         .find({"userID": userID}).toArray();
    //     res.status(200).send(result);
    //     console.log(result);
    // }catch{
    //     console.log("something went wrong");
    // }finally{
    //     client.close();
    // }
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

// app.listen...
app.listen(port, ()=>{
    console.log("Listening on port ", port);
})