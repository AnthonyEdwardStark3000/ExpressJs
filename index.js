const { json } = require('express');
const express =require('express'); //leftside expess is just an variable
const path = require('path');//js module to deal with paths
const app = express(); //express() is the name of the first variable that contains the methods of imported express class
const uuid=require('uuid');
const exphs = require('express-handlebars');//#handle
// const moment =require('moment');//to print the current time install  { npm i moment }

const members = require('./Members');// importing the hardcoded js object for api testing
const middleware=require('./middlewarevariable/middlewareVariable');//importing the created middleware

//handlebars middleware #handle
app.engine('handlebars',exphs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//creating route #handlebars //Homepage route index.handlebars
app.get('/api/members',function(req,res)
{
    res.render('index' ,{
        content:'This second parameter is optional it is used to pass information',
        // members: members, (or)
        members
    });
});

// *******************************************************************************************
// To use static folder here public is made static

// app.use(express.static(path.join(__dirname,'public')));

// this folder will be loaded by default instead of sendFile

//comment the handlebars route #handlebars and uncomment here inorder to see the change.

// *******************************************************************************************


// *******************************************************************************************
     // +++++++++++Creating middleware that runs during api calls for fun+++++++++++  

    // code is shifted to middleware and then imported inorder to reduce space
    
    // // initialize the middleware
    app.use(middleware); //comment this to stop the middleware running

    //body parser id="create"
    app.use(express.json()); // json to handle json
    app.use(express.urlencoded({extended:false})); // json to handle form submission

// *******************************************************************************************

// *******************************************************************************************
// 1) for response
// app.get('/',function(req,res){
    // res.send('<h1>Hello world!</h1>') checking by sending an response
    
    // res.sendFile(path.join(__dirname,'public','index.html'));
    
    //sending an reponse file path.join gets the current directory by __dirname and moves to FOlder public and loads index.html
// });
// *******************************************************************************************

// *******************************************************************************************
// 2)Trying to get api response (api routes)
    //to reduce space the file is created in members.js
    //it gets all the element in the oj=bject
    app.get('/api/members',function(req,res){
        res.json(members); //making the response to return an json array
    });

// *******************************************************************************************


// *******************************************************************************************
// 3)Trying to get only an single element by its id
    app.get('/api/members/:id',function(req,res){//if placed in another file express should be imported and router (i.e) const router =express.Router(); router.get() instead of app.get()

        const found= members.some(member=>member.id === parseInt(req.params.id));//the code runs and gives an element even without this condition but it returns[] when an request to access non existing member in the hardcoded js object.Inorder to make it return an proper messge this line is used and the condition to return the element is wrapped inside the if block. 

        if(found)
        {

        // res.send(req.params.id);//respense is said to send based on the request made using the parameter as id  (or)
        res.json(members.filter(member=> member.id === parseInt(req.params.id)));
        
        }
        else //message to be printed in json when an non existing element is tried to be accessed
        {
            res.status(400).json({msg:'Member not found or not exists of ID:'+`${ req.params.id}`});
        }
    });

// *******************************************************************************************

// *******************************************************************************************
// 4)Create member i.e POST request  so use post instead of get

    app.post('/api/members',function(req,res){

        // res.send(req.body);//it will not return anything in the api so we need to install an body parser to make it use an middleware -> id="create".Commented as no use in just showing the entered body

        const newMember={
            //create var named newMember as an object. using DB's will automatically generate an id for us as not using an DB now use {npm i uuid} in cmd to generate an random id.And
            // import that package

            id:uuid.v4(), //assigning some randomly created universal id of version 4 to id.
            name:req.body.name, //get the value of name from request body and assign it to name.
            age:req.body.age, //get the value of age from request body and assign it to age.
            email:req.body.email, //get the value of email from request body and assign it to email.
            // send data as an single object in the API {'':''} not as an json array[{'':''}].
        }

        if(!newMember.name||!newMember.age||!newMember.email)//condition to make sure the details are completely entered
        {
            return res.status(400).json({msg:'please enter the name ,age and email'});
        }

        else // else is not included it will throw an headers already sent error
        {
            members.push(newMember);//if all the details are entered correctly I want to push the array into the hardcoded JS object.
            
            // res.json(members); commenting this line now as while working with handlebar templates
            // require to redirect and this returns the result in json array format

            res.redirect('/api/members');
        }
        
    });

// *******************************************************************************************


// *******************************************************************************************
    //  5)    update
    app.put('/api/members/:id',function(req,res)
    {
        const found=members.some(member=>member.id === parseInt(req.params.id));

        if(found)
        {
           const updtMember=req.body;
           members.forEach(member=> 
            {
                if(member.id === parseInt(req.params.id))
                {
                    member.name=updtMember.name ? updtMember.name : member.name;
                    member.age=updtMember.age ? updtMember.age : member.age;
                    member.email=updtMember.email ? updtMember.email : member.email;
                    res.json({msg:'Updated the details',member})
                }
            });
        }
        else{
            res.status(400).json({msg:'No member with the id of '+`${req.params.id}`});
        }
    })
// *******************************************************************************************
// *******************************************************************************************
    //  6)    Delete
    app.delete('/api/members/:id',function(req,res)
    {
        const found=members.some(member=>member.id === parseInt(req.params.id));

        if(found)
        {
           res.json({
               msg:'member deleted id'+`${req.params.id}`,
               members:members.filter(member =>member.id !== parseInt(req.params.id))
           });
        }
        else{
            res.status(400).json({msg:'No member with the id of '+`${req.params.id}`});
        }
    })
// *******************************************************************************************

// *******************************************************************************************
    //               7)Rendering with template 1.install handlebars {npm i express-handlebars}
    // import express-handlebars id='handle';
    //create middleware
    //create handle bars in folders views,layout. views->index.handlebars->layout->main.handlebars
    //create routes to render id="handlebars"

// *******************************************************************************************

// *******************************************************************************************

const PORT=process.env.PORT||3000;// assinging the port after checking the environment
app.listen(PORT,function(){ console.log(`App started in port ${PORT}`)});

// *******************************************************************************************