var frisby = require('frisby');
var db = require('../../classes/mysql');
var User = require('../../models').User;


frisby.create("Deleting an existing user with username nicolagreco")
  .delete("http://127.0.0.1:3000/api/v1/users/1")
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .afterJSON(function(){
    db.query('SELECT * from users WHERE id = 1;', function(err,rows){
      expect(rows.length).toEqual(0);
      db.query('INSERT into users SET ?;', {
        id:1,
        username:"nicolagreco",
        password:"pass",
        name:"Nicola",
        surname:"Greco",
        email:"email@example.org",
        creation_time: new Date(),
        update_time: new Date(),
        role: "patient"
      });
    })
  })
  .toss();

frisby.create("Deleting an unexisting user martinlazarov")
  .delete('http://127.0.0.1:3000/api/v1/users/0')
  .expectStatus(200)
  .expectJSON({status:"OK"})
  .toss();
