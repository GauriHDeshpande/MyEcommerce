const express = require("express");
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require("../Controllers/productController");
const { isAdmin, authMiddleware } = require("../Middlewares/authMiddleware");
const { productImgResize, uploadPhoto } = require("../Middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);
router.get("/get-product/:id", getProduct);
router.get("/get-all-products", getAllProducts);
router.put("/updateProduct/:id", authMiddleware, isAdmin, updateProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;