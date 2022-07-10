const mongoose =require('mongoose')

const messageSchems=new mongoose.Schema(
{
name:String,
message:String,
timestamp:String,
uid:String,
roomid:String,

},
{
timestamps:true

},
)


const message=mongoose.model('message',messageSchems)

module.exports=message