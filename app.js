const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRoutes");
const ownerRouter = require("./routes/ownerRoutes");
const commonRouter = require("./routes/commonRoutes");


const app = express();
const connectToMongo = require("./db");
const dotenv = require("dotenv");
dotenv.config({path:"config/config.env"})

const port = process.env.PORT || 5000;
connectToMongo();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

app.use(express.static(__dirname + '/public'));
app.use('/photos', express.static('photos'));

app.use(userRouter);
app.use(ownerRouter);
app.use(commonRouter);


app.listen(port, () => {
    console.log("Listening on port", port)
});
