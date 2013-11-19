var frisby = require('frisby');
var db = require('../../classes/mysql');


frisby.create("Deleting an existing user with username nicolagreco")
  .delete("http://127.0.0.1:3000/api/v1/users/nicolagreco")
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .afterJSON(function(){
    db.query('SELECT * from users WHERE username = "nicolagreco";', function(err,rows){
      expect(rows.length).toEqual(0);
      db.query('INSERT into users SET ?;', {
        username:"nicolagreco",
        password:"pass",
        name:"Nicola",
        surname:"Greco"
      });
    })
  })
  .toss();

frisby.create("Deleting an unexisting user martinlazarov")
  .delete('http://127.0.0.1:3000/api/v1/users/martinlazarov')
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .toss();
