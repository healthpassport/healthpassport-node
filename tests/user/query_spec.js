var frisby= require('frisby');
var db = require('../../classes/mysql');
var __= require('underscore');

frisby.create('Query of the users')
  .get("http://127.0.0.1:3000/api/v1/users")
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function (users){
    db.query('SELECT * from users;',function(err,rows){
    expect(rows.length).toEqual(users.length);
    __.map(users,function(user){
//      expect(user.password).toBeUndefined();
      expect(user.username).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.surname).toBeDefined();
    })
    })
  })
  .toss();