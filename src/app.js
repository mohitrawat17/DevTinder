const express= require('express')

const app=express()
const PORT=5000

const token='abc'


app.use((req,res,next)=>{
 const isAuthorized=token==='abc'
 if(!isAuthorized){
    res.status(401).send({'message':'User not authorized'})
 }
 else{
    next()
 }
})


app.get('/user',(req,res)=>{
    console.log('get request')
    res.send('user get request')
})


// POST REQUEST WITH DYNAMIC PARAMETERS
app.post('/user/:id',(req,res)=>{
    const id = req.params.id
    console.log('post request : ',id)
    res.send('user post request for id : '+id)
})


app.delete('/user',(req,res)=>{
    console.log('delete request')
    res.send('user delete request')
})

app.listen(PORT,()=>{
    console.log('listening to PORT : ',PORT)
})