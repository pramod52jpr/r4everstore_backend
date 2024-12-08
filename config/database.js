const mongoose = require("mongoose");

const connectDatabase = async () => {
    console.log("the mongo uri is : ", process.env.MONGO_URI);

    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
        dbName : "r4everstore"
    })
    console.log("mongo db connected", connection.host);
    
}

module.exports = connectDatabase;