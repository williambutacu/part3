const express=require("express")
const mongoose=require("mongoose")


const app=express()

const password= process.argv[2]

mongoose.connect(`mongodb+srv://admin-william:${password}@cluster0.xhcws.mongodb.net/Phonebook?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const personSchema= new mongoose.Schema({
    name: String,
    phone: Number
})

const Person = mongoose.model("Person", personSchema)

if(process.argv[3]){
    const newPerson= new Person({
        name: process.argv[3],
        phone: process.argv[4]
    })
    
    newPerson.save().then(result=>{
        console.log(`added ${result.name} number ${result.phone} to the phonebook`)
    })
    
}
else {
    Person.find({}).then(result=>{
        result.forEach(person=>{
            console.log(`${person.name} ${person.phone}`)
        })
        mongoose.connection.close();
    })
}


