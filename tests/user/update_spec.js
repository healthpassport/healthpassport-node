var frisby= require('frisby');
var db = require('../../classes/mysql');

frisby.create("Updating an existing user nicolagreco")
  .put("http://127.0.0.1:3000/api/v1/users/nicolagreco",{name:"Nicolaaa"})
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .afterJSON( function(){
    db.query('SELECT name from users WHERE username = "nicolagreco";', function(err,rows){
      expect(rows[0].name).toEqual("Nicolaaa");
      db.query('UPDATE users SET name = "Nicola" WHERE username = "nicolagreco"');
    });
  
  })
  .toss()