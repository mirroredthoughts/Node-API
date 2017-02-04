'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //for taking input for POST req

const cors = require('cors'); //to make request from another domain other than serving our app
let contacts = require('./data');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

app.get('/', function(request, response) {
       response.sendFile(__dirname + '/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
   });

app.get('/api/contacts',(request,response) => {
  if(!contacts) {
    response.status(404).json({message:"Not found"});
  }
  response.sendFile(__dirname + '/client/index.html');
  response.json(contacts);
});

app.get('/api/contacts/:id',(request,response) => {

  let contactId = request.params.id;
  let contact = contacts.filter(contact => {
    return contact.id == contactId;
  });
  debugger;

  if(contact.length == 0) {
    response.status(404).json({message:'No contact found'});

  }
  response.json(contact[0]);
});

app.post('/api/contacts',(request,response)=>{
  const contact = {
    id: contacts.length +1,
    first_name : request.body.first_name,
    last_name : request.body.last_name,
    email : request.body.website
  }
  contacts.push(contact);
  response.json(contact);
});

app.put('/api/contacts/:id',(request,response)=>{
  const requestId= request.params.id;
  let contact = contacts.filter(contact=> {
    return contact.id == requestId;
  })[0];
  const index = contacts.indexOf(contact);
  const keys =Object.keys(request.body);
  keys.forEach(key =>{
    contact[key]= request.body[key];

  });
  contacts[index]= contact;
  response.json(contacts[index]);
});

app.delete('/api/contacts/:id', (request,response )=> {
  const requestId = request.params.id;

  let contact = contacts.filter(contact => {
    return contact.id == requestId;
  })[0];

const index = contacts.indexOf(contact);
contacts.splice(index,1);

response.json({message: `User ${requestId} deleted`});
});



const hostname = 'localhost';
const port = 8002;


app.listen(port,hostname,()=> {
  console.log(`Server listening at http://${hostname}:${port}`);
});
