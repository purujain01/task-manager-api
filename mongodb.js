const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionurl = 'mongodb://127.0.0.1/27017'
const databasename = 'task-manager'

MongoClient.connect(connectionurl,{ useNewUrlParser:true },(error,client)=>{
    if(error){
        return console.log('Unable to connect to database')
    }
    const db = client.db(databasename)
    db.collection('users').deleteMany({
            name: 'Raj Dev Jain'
        }).then((result)=>{
            console.log(result)
    }).catch((error)=>{
        console.log('Unable to update')
    })
     
})