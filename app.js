require('dotenv').config()
const { response } = require("express");
const express= require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")


const app = express();

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token("content",function(req,res){
   
    return JSON.stringify(req.body)
})


app.use(morgan(":method  :status :res[content-length] - :response-time ms :content"))

app.get("/api/persons", (req,res)=>{
    Person.find({})
    .then(people=>
        
       res.json(people)
        )
    .catch(error=>
        console.log(error.message))
        
})


app.get("/info", (req,res)=>{
    Person.find({})
    .then(people=>
        res.send(`<div>
        <p>Phonebook has ${people.length} people</p>
        <p> ${new Date()}</p>
        </div>`        
        ))
    .catch(error=>
        console.log(error.message))

    
})

app.get("/api/persons/:id", (req,res,next)=>{

    Person.findById(req.params.id)
    .then(person=>{
        if (person){
        res.json(person)
    }
    else {
        res.status(404).end()
    }
    })
    .catch(error=>{
        next(error)
    })

    
    
})

app.delete("/api/persons/:id", (req,res,next)=>{

    Person.findByIdAndRemove(req.params.id)
    .then(person=>
        res.status(204).end())
    .catch(error=>
        next(error))

})

app.post("/api/persons", (req,res,next)=>{
    if(req.body.phone && req.body.name) {
        const newPerson = new Person({
            name: req.body.name,
            phone: req.body.phone
        })

        newPerson.save()
        .then(savedPerson=>
            res.json(savedPerson))
        .catch(error=>
            next(error))
        }

})

app.put("/api/persons/:id", (req,res,next)=>{
    const person={
        name: req.body.name,
        phone: req.body.phone
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true})
        .then(updatedPerson=>
            res.json(updatedPerson))
        .catch(error=>
            next(error))
})

function unknownEndpoint(req,res){
    res.status(404).send({error:"unknown endpoint"})
}

app.use(unknownEndpoint)



function errorHandler(error, req, res, next){
    console.error(error.message)
    console.error(error)

    if (error.name === "CastError" && error.kind==="ObjectId"){
        return res.status(400).send({error:"malformated id"})
    }
    else if (error.name==="ValidationError"){
        return res.status(400).json({error:error.message})
    }
    
    
    next(error)
   
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
