var frisby = require('frisby');
var db = require('../../classes/mysql');

frisby.create('Create user')
  .post('http://127.0.0.1:3000/api/v1/users', {
    username: "Raluca",
    password: "Raluca",
    name: "Raluca",
    surname: "Raluca",
    email: "Raluca",
    role: "Raluca"
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    status: "OK"
  })
  .afterJSON(function(user) {
    db.query('SELECT * FROM users WHERE username="Raluca"', function(err, rows) {
      var raluca = rows[0];
      expect(raluca.password.length).toBe(60);
      expect(raluca.password).not.toBe("asd");
    })
    db.query('DELETE FROM users WHERE username="Raluca"');
  })
  .toss();

frisby.create('Create user with empty params')
  .post('http://127.0.0.1:3000/api/v1/users', {})
  .expectStatus(500)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    status: "Parameters missing for creating the user"
  })
  .toss();
