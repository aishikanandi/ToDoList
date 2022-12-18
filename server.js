
const express = require('express');
const bodyParser= require('body-parser'); //data from client
const app=express();
const mongoose = require("mongoose");
const _ = require("lodash");
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, 
useUnifiedTopology: true
}, () => { 
console.log('connected to database myDb ;)') 
});
const itemsSchema ={
    name: String 
}
const Item = mongoose.model("Item", itemsSchema)
const item1 = new Item({name: "Welcome to your todolist!"})
const item2 = new Item({name: "Hit + to add an item"})
const item3 = new Item({name: "You may delete using this button"})
const defaultarr = [item1, item2, item3]

app.set("view engine", "ejs")
app.get('/',function(req,res){
    // let today = new Date()
    //  let options={
    //     weekday : "long",
    //     day: "numeric",
    //     month :"long"
    //  }
    //  let day = today.toLocaleDateString('en-US', options)

     
     
     Item.find({},function(err, founditems){
        if(founditems.length==0){

            Item.insertMany(defaultarr, function(err){
                if(err){console.log(err)}else{console.log("Successfully added items")}
            })
            res.redirect("/")
        }else{
        res.render("list",{listtitle: "Today",newListItem: founditems}) 
        }
     })


});
const listSchema ={
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("list", listSchema)


app.post('/',function(req,res){
    const newItem = req.body.newItem
     const submitlist = req.body.button 
     itemName = new Item({name : newItem})
     
     if(submitlist==="Today"){
        itemName.save()
        res.redirect('/')}
     else{
        List.findOne({name: submitlist}, function(err, foundlist){
            foundlist.items.push(itemName)
            foundlist.save()
            res.redirect('/'+submitlist)
        })
     }
})

app.get('/:custom', function(req, res){
    const custom = _.capitalize(req.params.custom)
    
    List.findOne({name: custom}, function(err, list){
        if(!err){
            if(!list){
                const list = new List({
                    name : custom,
                    items : defaultarr
                })
                list.save()
                res.redirect('/'+custom)
            }else{
                res.render('list',{listtitle: custom,newListItem: list.items})
            }
        }
    })

})


app.post('/delete',function(req,res){
    const deleteitem = req.body.check
    const a= req.body.a
    
    if(req.body.a==='Today'){
        Item.findByIdAndRemove(deleteitem, function(err){
            if(err){console.log(err)}else{console.log(`Removed ${deleteitem}`)}
        })
        res.redirect("/")
    }else{
        List.findOneAndUpdate({name: a}, {$pull : {items: {_id: deleteitem}}}, function(err, foundlist){
            if(!err){
                res.redirect('/'+a)
            }
        })
        
    }
    
})

app.listen(3000, function(){
    console.log('Started');
});
 