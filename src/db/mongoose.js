const mongoose = require('mongoose')

mongoose.connect( process.env.SERVER ,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

