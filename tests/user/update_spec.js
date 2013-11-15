var frisby= require('frisby');
var db = require('../../classes/mysql');

frisby.create("Updating existing user nicolagreco")
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


frisby.create("Updating an unexisting user martinlazarov")
  .put("http://127.0.0.1:3000/api/v1/users/martinlazarov",{name:"Martinn"})
  .expectStatus(500)
  .expectJSON({status:"User not found"})
  .toss()


frisby.create("Updating existing user nicolagreco with empty params")
  .put("http://127.0.0.1:3000/api/v1/users/nicolagreco",{})
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .toss()
