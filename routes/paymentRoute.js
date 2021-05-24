const express = require('express');
const router = express.Router();
const {
    ROUTE,
    VIEW
} = require('../constant');
const Product = require('../model/product');
const UserModel = require("../model/user")
const verifyToken = require("./verifyToken")
const stripe = require('stripe')("sk_test_57eGL8V1HGNp3MYD3gccouqZ00Lsxg153a");

router.get("/order", verifyToken, async (req, res) => {

    const user = await UserModel.findOne({
        _id: req.body.userInfo._id
    }).populate("wishlist.productId")

    return stripe.checkout.sessions.create({
        /*kommer strip api  som kärver ett objeckt och kräver två bestämda nycklar*/
        payment_method_types: ["card"], //kommer strip api käver arry
        line_items: user.wishlist.map((product) => { //line_items: kommer strip api käver arry och kan loopa genom wishlist från model
            return {
                name: product.productId.album, //måste heta name:
                amount: product.productId.price * 100, // räncka ut de price * 1
                quantity: 1,
                currency: "sek" // total pris

            }
        }), // kommer strip api
        success_url: req.protocol + "://" + req.get("Host") + "/",
        cancel_url: "http://localhost:8002/products"

    }).then((session) => {
        console.log(session)
        res.render("checkout", {
            user,
            sessionId: session.id
        })
    })
})


router.get("/orderconfirmation", (req, res) => {
    res.render("orderconfirmation.ejs")

})





module.exports = router