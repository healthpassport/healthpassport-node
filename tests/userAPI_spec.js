var frisby = require('frisby');
var db = require('../classes/mysql');

frisby.create('Create user')
  .post('http://127.0.0.1:3000/api/v1/users', {
    username: "Raluca",
    password: "asd",
    name: "Raluca",
    surname: "Cocioban"
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    status: "OK"
  })
  .afterJSON(function(user) {
    db.query('DELETE FROM users WHERE username="Raluca"');
  })
  .toss();
