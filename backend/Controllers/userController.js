const User = require('../Models/userModel');
const Product = require("../Models/productModel");
const Cart = require("../Models/cartModel");
const Coupon = require("../Models/couponModel");
const Order = require("../Models/orderModel");
const uniqueid = require("uniqid");
const asyncHandler = require('express-async-handler');
const { genrateToken } = require('../Config/jwtToken');
const validateMongodbId = require('../Utils/validateMongodbId');
const { genrateRefreshToken } = require('../Config/refreshToken');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const sendEmail = require("./emailController");

// Create a new User

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
        console.log('User registered...');
    } else {
        throw new Error('User Already Exists');
    }
});

//Login A User

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Check if user exist or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await genrateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, { refreshToken: refreshToken, }, { new: true, });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: genrateToken(findUser?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

// Admin login functionality

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Check if admin exist or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await genrateRefreshToken(findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate(findAdmin.id, { refreshToken: refreshToken, }, { new: true, });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: genrateToken(findAdmin?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//Handle Refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in DB or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = genrateToken(user?.id);
        res.json({ accessToken });
    });
});

// Logout functionality

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // Forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);  //Forbidden
});

// Update a user

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },
            {
                new: true,
            }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        },
            {
                new: true,
            }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Get All User
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findById(id);
        res.json({
            getUser
        })
    } catch (error) {
        throw new Error(error);
    }
});

// Delete a User

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    validateMongodbId(_id);
    try {
        const deleteUser = await User.findByIdAndDelete(_id);
        res.json({
            deleteUser
        })
    } catch (error) {
        throw new Error(error);
    }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json(block);
    } catch (err) {
        throw new Error(err);
    }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json(unblock);
    } catch (err) {
        throw new Error(err);
    }
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

// Forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email!");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: 'Hey User',
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (err) {
        throw new Error(err);
    }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, Please try again later...");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

// Get wishlist functionality

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (err) {
        throw new Error(err);
    }
});

// User-Cart Functionality

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        // Check if user already have products in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for(let i = 0; i < products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch (err) {
        throw new Error(err);
    }
});

// Get User-Cart

const getUserCart = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
});

// Empty cart functionality

const emptyCart = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby: user._id});
        res.json(cart);
    }catch(err){
        throw new Error(err);
    }
});

// Apply Coupon Functionality

const applyCoupon = asyncHandler(async(req, res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({name: coupon});
    if(validCoupon == null){
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({_id});
    let {cartTotal} = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal - (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
        {orderby: user._id},
        {totalAfterDiscount},
        {new: true}
    );
    res.json(totalAfterDiscount);
});

// Create order functionality

const createOrder = asyncHandler(async(req, res) => {
    const {COD, couponApplied} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        if(!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby: user._id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount;
        }else{
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqueid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return{
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count, sold: +item.count}},
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({message: "success"});
    }catch(err){
        throw new Error(err);
    }
});

// Get Orders

const getOrders = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const userOrders = await Order.findOne({orderby: _id}).populate("products.product").exec();
        res.json(userOrders);
    }catch(err){
        throw new Error(err);
    }
});

// Update order status

const updateOrderStatus = asyncHandler(async(req, res) => {
    const {status} = req.body;
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            {new: true}
        );
        res.json(updateOrderStatus);
    }catch(err){
        throw new Error(err);
    }
})

module.exports = { createUser, loginUserCtrl, loginAdmin, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, resetPassword, forgotPasswordToken, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus };