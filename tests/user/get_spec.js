var frisby= require('frisby');
frisby.create("Get existing user with username nicolagreco")
  .get('http://127.0.0.1:3000/api/v1/users/nicolagreco')
  .expectStatus(200)
  .expectHeaderContains('content-type','application/json')
  .expectJSON({username:"nicolagreco",name:"Nicola",surname:"Greco"})
  .afterJSON(function(user) {
    expect(user.password).toEqual(undefined);
  })
  .toss();
frisby.create("Get unexisting user with username martinlazarov")
  .get('http://127.0.0.1:3000/api/v1/users/martinlazarov')
  .expectStatus(500)
  .expectHeaderContains('content-type','application/json')
  .expectJSON({status: "User not found"})
  .toss();
