const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const categoryRoute = require('./routes/category');
const tagRoute = require('./routes/tag');
const cardRoute = require('./routes/card');
const accountRoute = require('./routes/account');
const Card = require('./models/card');
const Category = require('./models/category');

const app = express();
// app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});


app.use("/account",accountRoute);
app.use("/users",userRoutes);
app.use("/cards",cardRoute);
app.use("/categories",categoryRoute);
app.use("/tags",tagRoute);

app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.json({
        status:error.status,
        error: {
            message: error.message
        }
    });
});


module.exports= app