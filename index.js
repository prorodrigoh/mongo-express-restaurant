const express = require('express')
const mongo = require('mongodb').MongoClient
const cors = require('cors')

const PORT = 3030

const app = express()
app.use(cors())
app.use(express.json())

const url = 'mongodb+srv://admin:admin123@cluster0.osjhu.mongodb.net?retryWrites=true&w=majority'

const options = { 
    useNewUrlParser: true,   // mongo doesn't return warnings
    useUnifiedTopology: true
}

let menuDb, customersDb

mongo.connect(url, options, (err, mongoClient) => {
    if(err){
        console.error(err)
        return
    }
    app.listen(PORT, () => {
        console.log(`http://localhost${PORT}`)
    })

    const db = mongoClient.db('restaurant')
    customersDb = db.collection('customers')
    menuDb = db.collection('menu')
})

app.get('/', (req, res) => res.status(200).send('Welcome!'))

app.post('/', (req, res) => {
    menuDb.insertOne(req.body)
    .then( () => res.status(201).send('Item added'))
})

app.patch('/', (req, res) => {
    menuDb.updateOne(req.body, {$set: {name: 'tequila', cost: 30, stock: true}})
    .then( () => res.status(202).send('Item updated'))
})


app.delete('/', (req, res) => {
    menuDb.deleteOne({name: 'Pizza'})
    .then( () => res.status(203).send('Item deleted'))
})
