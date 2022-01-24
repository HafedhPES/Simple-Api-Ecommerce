const router = require('express').Router()
const { json, application } = require('express');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/token');
const Product = require('../models/Product');
const { route } = require('./user');

// Ajouter un produit
router.post("/", verifyTokenAndAdmin, async(req, res) => {
        try {
            const newProduct = new Product(req.body)
            const savedProduct = await newProduct.save()
            res.status(201).json(savedProduct)
        } catch (err) {
            res.status(400).json(err)
        }


    })
    // Modidifier un produit
router.put('/:id', verifyTokenAndAdmin, async(req, res) => {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            res.status(200).json(product)
        } catch (err) {
            json.status(400).json(err)
        }

    })
    //supprimer un produit
router.delete('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('deleted sucessfully')
    } catch (err) {
        res.status(400).json(err)
    }
})

// get all products
router.get('/', verifyTokenAndAdmin, async(req, res) => {
        const qNew = req.query.new
        const qCategory = req.query.category
        try {
            let products
            if (qNew) {

                products = await Product.find().sort({ _id: -1 }).limit(5)
            } else if (qCategory) {
                products = await Product.find({
                    categories: {
                        $in: [qCategory]
                    }
                })
            } else {
                products = await Product.find()
            }

            res.status(200).json(products)
        } catch (err) {
            res.status(400).json(err)
        }
    })
    // get one product
router.get('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {

        const product = await Product.findById(req.params.id)

        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
})



module.exports = router