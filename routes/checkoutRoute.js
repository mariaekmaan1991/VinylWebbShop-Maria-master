const express = require('express');
const router = express.Router();
const {
    ROUTE,
    VIEW
} = require('../constant');
const UserModel = require("../model/user")
const verifyToken = require("./verifyToken")
const stripe = require("stripe")("sk_test_57eGL8V1HGNp3MYD3gccouqZ00Lsxg153a");


router.get(ROUTE.checkout, verifyToken, async (req, res) => {
    if (verifyToken) {
        const showUserInfo = await UserModel.findOne({
                _id: req.body.userInfo._id
            })
            .populate('wishlist.productId', {
                artist: 1,
                album: 1,
                price: 1
            })

        return stripe.checkout.sessions.create({
            /*kommer strip api  som kärver ett objeckt och kräver två bestämda nycklar*/
            payment_method_types: ["card"], //kommer strip api käver arry
            line_items: showUserInfo.wishlist.map((product) => { //line_items: kommer strip api käver arry och kan loopa genom wishlist från model
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
            res.render(VIEW.checkout, {
                ROUTE,
                showUserInfo,
                sessionId: session.id,
                token: (req.cookies.jsonwebtoken !== undefined) ? true : false

            })
        })

    } else {
        return res.status(202).render(VIEW.checkout, {
            ROUTE,
            showUserInfo: "empty cart",
            token: (req.cookies.jsonwebtoken !== undefined) ? true : false
        })
    }
})

router.post(ROUTE.checkout, verifyToken, (req, res) => {
    const customer = {
        fName: req.body.fName,
        lName: req.body.lName,
        address: req.body.address,
        city: req.body.city,
        email: req.body.email
    }
    res.render(VIEW.confirmation, {
        customer,
        token: (req.cookies.jsonwebtoken !== undefined) ? true : false
    });
})

module.exports = router;