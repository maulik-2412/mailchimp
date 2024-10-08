const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const https = require('https');
const { url } = require('inspector');
const path = require('path');
require('dotenv').config();


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);

    const url=process.env.URL;
    const options={
        method:'POST',
        auth:process.env.AUTH
    }

    const request=https.request(url,options,function(response){
        
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    
    })
    request.write(jsonData);
    request.end();
});


app.listen(process.env.PORT || "3001",function(){
    console.log("server started");
})


