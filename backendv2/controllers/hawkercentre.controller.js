const HawkercentreModel = require("../models/hawkercentreModel")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.model")
const StallModel = require("../models/stall.model")
const mongoose = require("mongoose")

const getAllHawkercentre= async (req, res) => {
    const hawkercentres = await HawkercentreModel.find().sort({no_of_stalls: -1})
    res.status(200).json(hawkercentres)
}

const getAllStalls = async (req, res) => {
    const {id} = req.params
    const stalls = await StallModel.find({hawker_centre_belong: mongoose.Types.ObjectId(id)})
    res.status(200).json(stalls)
}

const createHawkercentre= async (req, res) => {
    const { name_of_centre, location_of_centre, no_of_stalls} = req.body

    const {token} = req.cookies
    //Check for Hawker Privilege
    const userType = await UserModel.checkUserType(token, true)
    if (!userType) {
        return res.cookie("token", token).status(401).send("User not authorized")
    }
    //Once verified Hawker
    if (!name_of_centre || !location_of_centre || !no_of_stalls) {
        return res.cookie("token", token).status(404).send("All fields must be filled")
    }
    const hawkercentre = await HawkercentreModel.create({name_of_centre, location_of_centre, no_of_stalls })
    res.cookie("token", token).status(201).json(hawkercentre)
}

const getHawkercentreById = async (req, res) => {
    const {id}=req.params
    let hawkercentre
    console.log("id is " + id)
    try {
        hawkercentre = await HawkercentreModel.findById(id)
    } catch (err) {
        return res.status(400).send("Invalid ID not found")
    }
    if(hawkercentre == null) {
        return res.status(404).send("Hawker Centre not found")
    }
    res.status(200).json(hawkercentre)
}

const deleteHawkercentreById= async (req, res) => {
    const {id}=req.params
    let hawkercentre
    const {token} = req.cookies
    //Check for Hawker Privilege
    const userType = await UserModel.checkUserType(token, true)
    if (!userType) {
        return res.cookie("token", token).status(401).send("User not authorized")
    }
    try {
        hawkercentre = await HawkercentreModel.findById(id)
    }
    catch (err) {
        return res.cookie("token", token).status(400).send("Invlaid ID not found")
    }
    if(hawkercentre == null) {
        return res.cookie("token", token).status(404).send("Hawker Centre not found")
    }
    await HawkercentreModel.deleteOne({_id: id})
    res.cookie("token", token).status(200).send()
}

const updateHawkercentre = async (req,res) => {
    const {id} = req.params
    const {name_of_centre, location_of_centre, no_of_stalls , img} = req.body
    const {token} = req.cookies
    
    //Check for Hawker Privilege
    const userType = await UserModel.checkUserType(token, true)
    if (!userType) {
        return res.cookie("token", token).status(401).send("User not authorized")
    }
    const hawkercentre = await HawkercentreModel.findById(id)
    if (name_of_centre != undefined) {
        hawkercentre.name_of_centre = name_of_centre
    }
    if (no_of_stalls != undefined) {
        hawkercentre.no_of_stalls = no_of_stalls
    }
    if (location_of_centre != undefined) {
        hawkercentre.location_of_centre = location_of_centre
    }
    if (img != undefined) {
        hawkercentre.img = img
    }
    await hawkercentre.save()
    res.cookie("token", token).status(200).send(hawkercentre)
}

const HawkercentreController = {
    getAllHawkercentre,
    getAllStalls,
    createHawkercentre,
    getHawkercentreById,
    deleteHawkercentreById,
    updateHawkercentre
}

module.exports = HawkercentreController