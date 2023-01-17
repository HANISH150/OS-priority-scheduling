const { request } = require('express')
const express = require('express')
const router = express.Router()
const expressAsyncHandler = require('express-async-handler')

router.use(express.json())


router.get('/booked-users',expressAsyncHandler(
    async(request,response)=>{
        let bookedusers = request.app.get("bookedusers")
        let bookedUsersData = await bookedusers.find().toArray();
        response.send({message:"getting all users!!",bookedUsersData:bookedUsersData})
    }
))

router.post('/tickets',expressAsyncHandler(
    async(request,response)=>{
        let data_of_booking_user = request.body
        let currentbookingusers = request.app.get("currentbookingusers")
        //inserting current booking user data into currentbooking users collection in MONGOdb
        await currentbookingusers.insertOne(data_of_booking_user)

        let allFemalePregnantUsers = await currentbookingusers.find({$and:[{isPregnant:"YES"},{gender:"Female"}]}).toArray()
        let allUsers = await currentbookingusers.find().toArray()
        let newUsers = allUsers.filter((user)=>user.isPregnant!="YES" && user.disabled==="NO")
        let handicapped = allUsers.filter((user)=>user.disabled==="YES")
        let finalUsers = []
        finalUsers.push(...allFemalePregnantUsers)
        finalUsers.push(...handicapped)
        //sorting users in decreasing order of their age
        
        response.send({users:finalUsers,newUsers:newUsers})
    }
))
router.post('/push',expressAsyncHandler(
    async(request,response)=>{
        let data = request.body
        let bookedusers = request.app.get("bookedusers")
        await bookedusers.insert(data)
        response.send({message:"Data inserted!!"})
    }
))

module.exports = router