const express = require('express');
const { createCoupon, getAllCoupon, getCoupon, updateCoupon, deleteCoupon } = require('../Controllers/couponController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { update } = require('../Models/couponModel');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/:id', authMiddleware, isAdmin, getCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupon);

module.exports = router;