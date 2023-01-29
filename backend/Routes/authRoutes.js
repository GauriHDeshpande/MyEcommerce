const express = require('express');
const router = express.Router();
const {createUser, 
       loginUserCtrl, 
       getAllUser, 
       getUser, 
       deleteUser, 
       updateUser, 
       blockUser, 
       unblockUser,
       handleRefreshToken,
       logout,
       updatePassword,
       forgotPasswordToken,
       resetPassword,
       loginAdmin,
       getWishlist,
       saveAddress,
       userCart,
       getUserCart,
       emptyCart,
       applyCoupon,
       createOrder,
       getOrders,
       updateOrderStatus
} = require('../Controllers/userController');
const {authMiddleware, isAdmin} = require('../Middlewares/authMiddleware');

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.put('/reset-password/:token', resetPassword);
router.put('/updatePassword', authMiddleware, updatePassword);
router.put("/update-order-status/:id", authMiddleware, isAdmin, updateOrderStatus);
router.post('/admin-login', loginAdmin);
router.post('/login', loginUserCtrl);
router.get("/cart/user-orders", authMiddleware, getOrders);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/get-user-cart', authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin,  unblockUser);
router.get('/allUsers', getAllUser);
router.get('/:id', authMiddleware, isAdmin, getUser);

router.delete('/:id', deleteUser);


module.exports = router;