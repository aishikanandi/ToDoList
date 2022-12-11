
const express = require('express');
const bodyParser= require('body-parser'); //data from client
const app=express();
app.use(express.static("public"))
let items = []
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.get('/',function(req,res){
    let today = new Date()
     let options={
        weekday : "long",
        day: "numeric",
        month :"long"
     }
     let day = today.toLocaleDateString('en-US', options)
    res.render("list",{kindofday: day,newListItem: items})
});
app.post('/',function(req,res){
    item=req.body.newItem
    items.push(item)
    res.redirect("/")
})
app.listen(3000, function(){
    console.log('Started');
});
 