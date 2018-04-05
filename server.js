const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const pg = require('pg');
const knex = require('knex');
const clarifai = require('clarifai');
const register =require('./controllers/register');
const signin =require('./controllers/signin');




const db = knex({
			  client: 'pg',
			  connection: {
			    host : '127.0.0.1',
			    user : 'postgres',
			    password : 'eghosa123',
			    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data=>{
	console.log(data);
})
const app = express();

const apps = new Clarifai.App({
 apiKey: 'ffc81439bd70407eb9c51540353a3a08'
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{
	res.json(database.users);
})

app.post('/signin', signin.signinHandle(db, bcrypt))

app.post('/imageurl', (req, res)=>{
	apps.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data=>{
			res.json(data);
		}).catch(err => res.status(400).json('unable to fetch api'))
})

app.post('/register', (req, res)=>{ register.handleRegister(req, res, db, bcrypt)} );

app.get('/profile/:id', (req, res)=>{
	const {id}=req.params;
	
		db.select('*').from('users').where({
			id:id
		}).then(user=>{
			if(user.length){
				res.json(user[0])
			}else{
				res.status(404).json('no such user');
			}
	})
	.catch(err => res.status(400).json('error getting user'))
})


app.put('/image', (req, res)=>{
	const {id}=req.body;
	let found = false;
	db('users').where('id', '=', id)
			.increment('entries', 1)
			.returning('entries')
			.then(entries=>{
				res.json(entries[0]);
			})
			.catch(err => res.status(400).json('error getting user'))
})



 
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });



app.listen(process.env.PORT || 3000, ()=>{
	console.log(`app is running on port ${process.env.PORT}`);
}).catch(console.log("error connecting to server")


/*
root route --> res= this is working

/singin --> POST =success/fail
/register --> POST =new user object
/profile/:userId --> GET = user
/image --> PUT --> user updated object


*/