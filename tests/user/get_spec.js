var typeOrNull = function(type) { return function(val) { expect(val).toBeTypeOrNull(type); }}

var frisby= require('frisby');
frisby.create("Get existing user with username nicolagreco")
  .get('http://127.0.0.1:3000/api/v1/users/1')
  .expectStatus(200)
  .expectHeaderContains('content-type','application/json')
  .expectJSONTypes({
    id: Number,
    name: String,
    surname: String,
    username: String,
    // password: String,
    email: String,
    avatar: typeOrNull(String),
    role: String,
    address: typeOrNull({
      city: String,
      number: Number,
      postcode: String,
      country: String,
      street: String
    })
  })
  .expectJSON({
    username: "nicolagreco"
  })
  .toss();

frisby.create("Get unexisting user with username martinlazarov")
  .get('http://127.0.0.1:3000/api/v1/users/0')
  .expectStatus(500)
  .expectHeaderContains('content-type','application/json')
  .expectJSON({status: "User not found"})
  .toss();
