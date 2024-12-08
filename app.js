const dotenv = require("dotenv");
dotenv.config({ path: "./.env" })
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;

const app = express();
const connectDatabase = require("./config/database");
connectDatabase();

const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoutes");
const bankDetailRouter = require("./routes/bankDetailRoutes");
const taskRouter = require("./routes/taskRoute");
const holidayRouter = require("./routes/holidayRoutes");
const planRouter = require("./routes/planRoutes");

app.use(express.json());
app.use(express.static(__dirname));
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/bank', bankDetailRouter);
app.use('/api/task', taskRouter);
app.use('/api/holiday', holidayRouter);
app.use('/api/plan', planRouter);

app.use('/', (req, res) => {
    res.send(`Backend Running Successfully !`)
})

app.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
})



// mongodb+srv://r4everstore:l1uU79MCtBMXTyLZ@r4everstore.qi0wy.mongodb.net/