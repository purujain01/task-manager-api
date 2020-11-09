
const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
require('./db/mongoose')
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server started')
})

