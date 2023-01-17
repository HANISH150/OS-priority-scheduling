const express = require('express');
const router = require('../../tourguide/backend/routes/userRoutes');
const app = express()

const mclient = require('mongodb').MongoClient;

//importing path module
const path=require('path')
//connecting build of application to nodejs
app.use(express.static(path.join(__dirname,'../frontend/build')))

//connecting to booking routes
const bookingRoutes = require('./BookingRoutes/bookingRoutes')
app.use('/booking',bookingRoutes)

//dealing with page refresh
app.use('*',(request,response)=>{
    response.sendFile(path.join(__dirname,'../frontend/build/index.html'));
})


//connecting to MONGODB using mclient
mclient.connect(process.env.DBURL)
.then((client)=>{
    console.log("Connected to database!!")
    let OSproject = client.db("OSproject")
    //already booked users collection
    let bookedusers = OSproject.collection("bookedusers")
    app.set("bookedusers",bookedusers)
    //currently booking users collection
    let currentlybookingusers = OSproject.collection("currentbookingusers")
    app.set("currentbookingusers",currentlybookingusers)
}).catch((error)=>{
    console.log("Error in database connection!!" + error.message)
})

//path handling code
app.use((request,response,next)=>{
    response.send({message:`path ${request.url} is invalid`});
})

//ERROR HANDLING(Only synchronous errors are handled)
app.use((error,request,response,next)=>{
    response.send({message:"Error Occured!!",reason:`${error.message}`});
})

app.listen(4000,()=>{
    console.log("Server running on PORT 4000")
})