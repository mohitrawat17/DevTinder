const express= require('express')

const app=express()
const PORT=5000


// request handler
app.use('/test',(req,res)=>{
    console.log('test route')
    res.send('test route')
})



app.listen(PORT,()=>{
    console.log('res')
})