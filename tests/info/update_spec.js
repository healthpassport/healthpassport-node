var frisby= require('frisby');
var db = require('../../classes/mysql');

frisby.create("Updating existing user nicolagreco")
  .put("http://127.0.0.1:3000/api/v1/users/nicolagreco",{name:"Nicolaaa"})
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .afterJSON( function(){
    db.query('SELECT * from users WHERE username = "nicolagreco";', function(err,rows){
      expect(rows[0].name).toEqual("Nicolaaa");
      expect(rows[0].surname).toEqual("Greco");
      db.query('UPDATE users SET name = "Nicola" WHERE username = "nicolagreco"');
    });

  })
  .toss()

frisby.create("Updating existing user nicolagreco's password")
  .put("http://127.0.0.1:3000/api/v1/users/nicolagreco",{password:"hello"})
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .afterJSON( function(){
    db.query('SELECT password from users WHERE username = "nicolagreco";', function(err,rows){
      expect(rows[0].password.length).toEqual(60);
      db.query('UPDATE users SET password = "pass" WHERE username = "nicolagreco"');
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
