const express = require('express')
const users = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeemail, sendGoodgyeemail } = require('../emails/email')

router.post('/user',async (req,res)=>{
    const User = new users(req.body)
    try{
        await User.save()
        sendWelcomeemail( User.email, User.name )
        const token = await User.generatetoken()
        res.status(201).send({ User, token })
    }
    catch(e){
        res.status(404).send(e)
    }
})
router.post('/user/login', async (req,res)=>{
    try{
        const user = await users.findByverify(req.body.email,req.body.password)
        const token = await user.generatetoken()
        res.send({ user, token})
    }catch(e){
        res.status(400).send()
    } 
})

router.get('/user/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.post('/user/logout',auth,async (req,res)=>{

    try{
        req.user.tokens = req.user.tokens.filter(( token )=>{
            return token.token !== req.token
        })
    
        await req.user.save()
        res.send()

    }catch(e){

        res.status(500).send()
    }
})

router.post('/user/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)

    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/user/me', auth ,async (req,res)=>{
    const valid = ['name','age','email','password']
    const option = Object.keys(req.body)
    const opinion = option.every(( value ) => valid.includes( value ))
    if(!opinion){
        return res.status(400).send({ error: 'Invalid key!'})
    }
    try{
        option.forEach(( value ) => req.user[value] = req.body[value])
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/user/me', auth , async ( req,res) => {

    try{
        await req.user.remove()
        sendGoodgyeemail( req.user.email, req.user.name )
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter( req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload the image'))
        }

        cb(undefined, true)
    }
})

router.post('/user/me/avatar', auth ,upload.single('avatar'), async (req,res)=>{

    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer 
    await req.user.save()
    res.send()
}, ( error, req, res, next ) => {
    res.status(400).send( { Error: error.message })
})

router.delete('/user/me/avatar', auth ,upload.single('avatar'), async (req,res)=>{
    
    req.user.avatar = undefined 
    await req.user.save()
    res.send()
}, ( error, req, res, next ) => {
    res.status(400).send( { Error: error.message })
})

router.get('/user/:id/avatar', async (req,res) => {

    const user = await users.findById( req.params.id )
    try{
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(400).send()

    }
})

module.exports = router