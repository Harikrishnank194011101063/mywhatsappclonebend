const express=require('express')
const mongoose=require('mongoose')
const rooms=require('./rooms')
const cors=require('cors')
const message=require('./message')
const Pusher=require('pusher')
//express ala json file ah handle panna mudiyadhu so we will use json()and connect it to express so it will help express to understand



const app=express();
app.use(express.json())
app.use(cors())
const dbUrl=`mongodb+srv://HariKrishnan:hari123@cluster0.n8rbe.mongodb.net/?retryWrites=true&w=majority`


const pusher = new Pusher({
  appId: "1434757",
  key: "527892920c9f78a0d70d",
  secret: "36079109cbbe1be1b1f0",
  cluster: "ap2",
  useTLS: true
});




mongoose.connect(dbUrl).then(()=>{
    console.log('it is connected')
}).catch((err)=>{

console.log(err)
})

// another method for checking if db is connected or not 
db=mongoose.connection;//namba mongoose oda connection ah ah idha vachu edukrom to check
db.once("open",()=>{//idhula db oru vaati open aagiduchu na callback fucntion opened nu mention pandrom thats it 
    console.log('we connected db')
const roomscollection= db.collection("rooms")
const changestreams=roomscollection.watch()

changestreams.on("change",(change)=>{
console.log(change)
const roomsdetails = change.fullDocument;
if (change.operationType==='insert') {
  pusher.trigger("rooms", "inserted",roomsdetails );

} else {
 console.log('not expected to happen') 
}


})



const msg=db.collection("messages")
const changestreams1=msg.watch()

changestreams1.on("change",(change)=>{
//console.log(change) idha vachu we can get information of what happened in this moongodb it will give the information and idha vachu 
if(change.operationType==='insert'){
//inga fulldocument use pannanum 
 const messagedetails=change.fullDocument;


  pusher.trigger("messages", "inserted",messagedetails );

}else{
console.log("not expected to happen ")


}

})





})


app.get('/',(req,res)=>{
res.send("hello from backend")



})




app.get('/all/rooms',(req,res)=>{
rooms.find({},(err,data)=>{
if(err){
res.status(500).send(err)



}
else{
res.status(200).send(data)

}


})



})






app.get("/room/:id",(req,res)=>{
rooms.find({_id:req.params.id},(err,data)=>{
if(err){
 res.status(500).send(err)
}else{
  res.status(200).send(data[0])


}




});


});

app.get('/messages/:id',(req,res)=>{
message.find({roomid:req.params.id},(err,data)=>{
  if(err){

 return res.status(500).send(err);
}else{
return  res.status(200).send(data);


}

});


});




app.post('/message/new', (req,res)=>{
const dbmessage=req.body;
message.create( dbmessage,(err,data)=>{
if(err){
res.status(500).send(err)

}
else{
res.status(201).send(data)



}



});






});














app.post('/group/create',(req,res)=>{
const name=req.body.groupname;//indha name la dhaaan namba send panna porom (groupname)
rooms.create({name},(err,data)=>{//idhula namba res req madhri pandrom but error irundha err nu vaarum and datandradhula dhaan normal ah namba send pandradhu save aagum so we did it for this 
if(err){
res.status(500).send(err)

}
else{
res.status(201).send(data)


}
  });

});




app.listen(5000,()=>{console.log('running on 5000')})