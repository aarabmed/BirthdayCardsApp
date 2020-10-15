const express = require('express');

const app = express();
app.use(express.json());




app.route('/').get((req, res) => {
    res.json({message:'Hello'})
})



module.exports= app