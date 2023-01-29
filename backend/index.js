const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./Config/dbConnect");
const { notFound, errorHandler } = require("./Middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRoute = require('./Routes/authRoutes');
const productRoute = require('./Routes/productRoutes');
const blogRoute = require("./Routes/blogRoutes");
const categoryRoute = require("./Routes/prodCategoryRoutes");
const blogCatRoute = require("./Routes/blogCatRoutes");
const brandRoute = require("./Routes/brandRoutes");
const couponRoute = require("./Routes/couponRoutes");
const morgan = require('morgan');
const cors = require('cors');

dbConnect();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categoryRoute);
app.use('/api/blog-category', blogCatRoute)
app.use('/api/brand', brandRoute);
app.use('/api/coupon', couponRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});