var frisby= require('frisby');
frisby.create("Get data from the database")
  .get('http://127.0.0.1:3000/api/v1/users/nicolagreco')
  .expectStatus(200)
  .expectHeaderContains('content-type','application/json')
  .expectJSON({username:"nicolagreco",name:"Nicola",surname:"Greco"})
  .afterJSON(function(user) {
    expect(user.password).toEqual(undefined);
  })
  .toss();
