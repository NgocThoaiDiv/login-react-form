var express = require('express');
var router = express.Router();

const { Pool, Client } = require('pg');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'USERS',
	password: 'PNThoai165',
	port: 5432,
});

/* GET home page. */
router.get('/', function(req, res, next) {});

const accessAllowControl = ()=>{
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
};

/* API get data from postgres */
router.get('/getData', function(req, res, next) {
	console.log('get data API');

	// get data
	pool.query('SELECT * FROM "USER_ACCOUNTS"', (err, response)=>{
		if(err){
			console.log(err);
		} else {
			res.send(response.rows);
		}
	});
});

router.post('/addUser', function(req, res, next){
	console.log('add user');

	let username = req.body.username,
	password = req.body.password;
	var noUser;
	pool.query('SELECT COUNT(id) FROM "USER_ACCOUNTS"', (err, response)=> {
		if(err){
			console.log(err);
		} else {
			noUser = parseInt(response.rows[0].count) + 1;
			pool.query('INSERT INTO "USER_ACCOUNTS" values($1, $2, $3)',
				[noUser, username, password], (err, response)=>{
					if(err){
						res.send(err);
					} else {
						res.send('added!');
					}
				});
		}
	});
});

module.exports = router;
