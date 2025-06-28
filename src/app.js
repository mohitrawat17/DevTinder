const express= require('express')

const app=express()
const PORT=5000


app.get('/test',(req,res)=>{
    console.log('get request')
    res.send('test get request')
})

// POST REQUEST WITH QUERY PARAMETERS
app.post('/test',(req,res)=>{
    const userId=req.query.userId
    const page=req.query.page
    const pageSize=req.query.pageSize
    console.log('post request',userId,page,pageSize)
    res.send('test post request')
})

// POST REQUEST WITH DYNAMIC PARAMETERS
app.post('/test/:id',(req,res)=>{
    const id = req.params.id
    console.log('post request : ',id)
    res.send('test post request for id : '+id)
})


app.delete('/test',(req,res)=>{
    console.log('delete request')
    res.send('test delete request')
})


// request handler
app.use('/test',(req,res)=>{
    console.log('test route middleware')
    res.send('test route')
})


app.listen(PORT,()=>{
    console.log('listening to PORT : ',PORT)
})