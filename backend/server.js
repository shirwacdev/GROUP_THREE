const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL).then( () =>{
    console.log("db Connected")
}).catch(err =>{
    console.log(err)
})


app.get("/api", (req, res) =>{
    res.send("Hello My Team")
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port 8000`);
})