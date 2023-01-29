const Product = require('../Models/productModel');
const User = require('../Models/userModel')
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const validateMongodbId = require("../Utils/validateMongodbId");
const cloudinaryUploadImg = require("../Utils/cloudinary");
const fs = require("fs");

// Create a product

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.tilte){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Fetch a product

const getProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Fetch all products

const getAllProducts = asyncHandler(async(req, res) =>{
    try {
        // Filtering
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));
        
        // Sorting
        
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }

        // Limiting the fields
        
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v");
        }

        // Pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) 
            throw new Error("This page does not exists");
        }
        console.log(page, limit, skip);

        const product = await query;
        res.json(product);
        
    } catch (error) {
        throw new Error(error);
    }
});

// Update product

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    validateMongodbId(id);
    try {
            if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({id}, req.body, {new: true});
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete product

const deleteProduct = asyncHandler(async(req, res) => {
    const id = req.params;
    validateMongodbId(id)
    try{
        const deleteProduct = await Product.findOneAndDelete(id);
        res.json(deleteProduct);
    }catch(err){
        throw new Error(err);
    }
});

// Implemented Wishlist Functionality.

const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {$pull: {wishlist: prodId}}, {new: true});
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id, {$push: {wishlist: prodId}}, {new: true});
            res.json(user);
        }
    }catch(err){
        throw new Error(err);
    }
});

// Product Ratings functionality

const rating = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if(alreadyRated){
            const updateRating = await Product.updateOne({ratings: {$elemMatch: alreadyRated}}, {$set: {"ratings.$.star": star, "ratings.$.comment": comment}}, {new: true});
        }else{
            const rateProduct = await Product.findByIdAndUpdate(prodId, {$push: {ratings: {star: star, comment: comment, postedby: _id}}}, {new: true});
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRatings = Math.round(ratingSum / totalRating);
        let finalProduct = await Product.findByIdAndUpdate(prodId, {totalrating: actualRatings}, {new: true});
        res.json(finalProduct);
    }catch(err){
        throw new Error(err);
    }
});

const uploadImages = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    console.log(req.files);
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findProduct = await Product.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = {createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages};