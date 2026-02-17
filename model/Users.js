    const mongoose = require("mongoose");

    const UserModel = new mongoose.Schema({
        full_name:String,
        email: String,
        phone_number: Number,
        password: String
        },
        {
            collection:"Users"
        }
    )

    module.exports=mongoose.model("User",UserModel);
