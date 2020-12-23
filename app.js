const { response } = require("express");
const express= require("express")
const morgan = require("morgan")


const app = express();

app.use(express.json())
app.use(morgan("tiny"))


let persons=[
    {
        id: 1,
        name: "Arto Hellas",
        number: "093209"
    },
    {
        id: 3,
        name: "Dan Abramovic",
        number: "093209"
    },
    {
        id: 5,
        name: "Iruka Sensei",
        number: "093209"
    }
]

app.get("/api/persons", (req,res)=>{
    res.json(persons)
})


app.get("/info", (req,res)=>{
    const arrayLength= persons.length
    let today= new Date();
    res.send(`<div>
    <p>Phonebook has ${arrayLength+1} people</p>
    <p> ${today}</p>
    </div>`
    )
})

app.get("/api/persons/:id", (req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person=> person.id===id)
    person? res.json(person) : res.status(404).end()
})

app.delete("/api/persons/:id", (req,res)=>{
    const id= Number(req.params.id) 
    persons= persons.filter(person=> person.id !== id)
    
    res.status(204).end()
})

app.post("/api/persons", (req,res)=>{
    const generateId= Math.floor(Math.random()*100)
    const newPerson ={
        id: generateId,
        name: req.body.name,
        number: req.body.number
    }

    const existing = persons.find(person=> person.name === newPerson.name)

    newPerson.name===undefined || newPerson.number===undefined ? 
    res.status(400).end("You need to define both the name and the number") :
    existing ? res.status(400).end("You need an unique name") :
    res.json(newPerson)

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
