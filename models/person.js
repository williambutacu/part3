const mongoose=require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');



const url = process.env.MONGODB_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result=>
        console.log("connected to MongoDB"))
    .catch(error=>
        console.log("error connecting to MongoDB", error.message))



const personSchema= new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:true,
        minlength: 3
    },
    phone: {
        type:String,
        required:true,
        minlength: 9
    }
})

personSchema.plugin(uniqueValidator);




personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports=mongoose.model("Person", personSchema)

