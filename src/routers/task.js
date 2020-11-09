const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/task', auth ,async (req,res)=>{
    const tasks = new Task({
        ...req.body,
        owner: req.user._id
    })
   
    try{
        const task = await tasks.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/task/:objectid', auth ,async (req,res)=>{
    const _id = req.params.objectid
 
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/task/:id', auth ,async (req,res)=>{
    const valid = ['description','completed']
    const option = Object.keys(req.body)
    const opinion = option.every(( value ) => valid.includes( value ))
    if(!opinion){
        return res.status(400).send({ error: 'Invalid key!'})
    }
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        option.forEach(( value ) => task[value] = req.body[value])
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/task', auth, async (req,res)=>{
    
    const match = {}
    const sort ={}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
  
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/task/:id', auth, async ( req,res) => {

    try{
        const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router