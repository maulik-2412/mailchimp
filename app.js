const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const { status } = require('express/lib/response');
const https = require('https');
const { url } = require('inspector');
const path = require('path');

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

    const url="https://us22.api.mailchimp.com/3.0/lists/e3def74367";
    const options={
        method:'POST',
        auth:'maulik1:321d50f0aa4b89780cb42ef8b81a2ef5-us22'
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


app.listen(process.env.PORT || "3000",function(){
    console.log("server started");
})


//321d50f0aa4b89780cb42ef8b81a2ef5-us22

//Audience ID
//e3def74367