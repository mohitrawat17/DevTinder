const express= require('express')

const app=express()
const PORT=5000


app.get('/test',(req,res)=>{
    console.log('get request')
    res.send('test get request')
})


app.post('/test',(req,res)=>{
    console.log('post request')
    res.send('test post request')
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