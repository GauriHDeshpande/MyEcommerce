const Coupon = require("../Models/couponModel");
const validateMongodbId = require('../Utils/validateMongodbId');
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const updateCoupon = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const deleteCoupon = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const getCoupon = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getCoupon = await Coupon.findById(id);
        res.json(getCoupon);
    }catch(err){
        throw new Error(err);
    }
});

const getAllCoupon = asyncHandler(async(req, res) =>{
    try{
        const coupons = await Coupon.find();
        res.json(coupons)
    }catch(err){
        throw new Error(err);
    }
})

module.exports = {createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupon};