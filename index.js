// ES5 implementation

const express = require('express')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;   // allows the use of ObjectID that MONGO recognizes

const PORT = 3030

const app = express()
app.use(cors())
app.use(express.json())

const url = 'mongodb+srv://admin:admin123@cluster0.osjhu.mongodb.net?retryWrites=true&w=majority'

const options = { 
    useNewUrlParser: true,
    // There are new mongodb+srv:// URLs, 
    // and simple mongodb:// URLs. 
    // If you are using the new format (you probably are by default), the new URL parser drops support for the old style urls.
    useUnifiedTopology: true    
    // The goal of the unified topology is threefold:
    // 1) fully support the drivers Server Discovery and Monitoring, Server Selection and Max Staleness specifications
    // 2) reduce the maintenance burden of supporting the topology layer in the driver by modeling all supported topology types with a single engine
    // 3) remove confusing functionality which could be potentially dangerous for our users
}


// outside the function declaration so we can use it in other functions 
let menuCol, customerCol

mongo.connect(url, options, (err, mongoClient) => {
    if(err){
        console.error(err)
        return
    }
    app.listen(PORT, () => {
        console.log(`http://localhost${PORT}`)
    })

    const db = mongoClient.db('restaurant')         // create/connect to our restaurant database 
    customerCol = db.collection('customers')        // Use this to create/connect customers collection
    menuCol = db.collection('menu')                 // use this to create items in the menu collection
})

// welcome page
app.get('/', (req, res) => res.status(200).send('Welcome!'))



// CREATE item document in the menu
// POSTMAN: Use POST and pass the item data as the body/raw/json

app.post('/', (req, res) => {
    menuCol.insertOne(req.body)
    .then( () => res.status(201).send('Item added'))
    .catch(err => {
        res.status(500).send(err);
    })
})

// READ 

// get all data from teh items in the menu (you can get the ID here)
// http://localhost:3030/menu

app.get('/menu', (req, res) => {
    const results = menuCol.find()
    results.toArray()
    .then( menu => res.send(menu))
})

// UPDATE one item document in the menu
// POSTMAN: Use PATCH and pass the item data that will be corrected as the body/raw/json
// Because it requires an ID, you need to get one ID from the database and pass it with the address
// e.g.: http://localhost:3030/6272e33c23b80ad15b2185d8
 
app.patch('/:id', (req, res) => {
    const id = new ObjectId(req.params);                // Here we are making the conversion from string to ObjectId
    const data = req.body
    menuCol.updateOne({ _id: id }, {$set: data})         // Here we are making use of ObjectID and not the string that comes with the parameters 
    .then( () => res.status(202).send('Item updated'))
    .catch(err => {
        res.status(500).send(err);
    })
    
})

// DELETE one item document in the menu
// POSTMAN: Use DELETE and pass the ID in the address 
// e.g.: http://localhost:3030/6272e33c23b80ad15b2185d8

app.delete('/:id', (req, res) => {
    const id = new ObjectId(req.params);                // same principle as above
    menuCol.deleteOne({ _id: id })
    .then( () => res.status(203).send('Item deleted'))
    .catch(err => { 
        res.status(500).send(err);
    })
})
