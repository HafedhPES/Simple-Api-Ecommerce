//const express = require('express')
const router = require('express').Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/token');
const User = require('../models/User')
const CryptoJS = require('crypto-js');
const { json } = require('express');

router.get('/', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        const users = await User.find()

        res.status(200).json(users)
    } catch (err) { res.status(400).json(err) }
});

router.put('/:id', verifyTokenAndAuthorization, async(req, res, next) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()

    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(400).json(err)
    }
})
router.delete('/:id', verifyTokenAndAuthorization, async(req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json("user deleted ")
    } catch (err) {
        json.status(400).json(err)
    }
})

router.get('/:id', verifyTokenAndAdmin, async(req, res) => {

    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router