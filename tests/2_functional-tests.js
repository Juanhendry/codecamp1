
const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        /** send {surname: 'Colombo'} here **/
        .send({ surname: 'Colombo' })
        // .send({...})
        .end(function(err, res) {
          /** your tests here **/
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(
            res.body.name,
            'Cristoforo',
            'res.body.name should be "Christoforo"'
          );
          assert.equal(
            res.body.surname,
            'Colombo',
            'res.body.surname should be "Colombo"'
          );
        });
    });
    // #4
    test('send {surname: "da Verrazzano"}', function(done) {
      chai
        .request(server)
        .put('/travellers')
        .send({ surname: 'da Verrazzano' })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
          done();
        });
    });
  });

  const Browser = require('zombie');
  Browser.site = 'https://boilerplate-mochachai.your-username.repl.co';
  const browser = new Browser();

  suite('Functional Tests with Zombie.js', function () {
    this.timeout(5000);

    suite('Headless browser', function () {
      test('should have a working "site" property', function() {
        assert.isNotNull(browser.site);
      });
    });

    suite('"Famous Italian Explorers" form', function () {
      // #5
      test('submit "surname" : "Colombo" - write your e2e test...', function(done) {
        // fill the form...
        // then submit it pressing 'submit' button.
        //
        // in the callback...
        // assert that status is OK 200
        // assert that the text inside the element 'span#name' is 'Cristoforo'
        // assert that the text inside the element 'span#surname' is 'Colombo'
        // assert that the element(s) 'span#dates' exist and their count is 1
        browser
          .fill('surname', 'Colombo')
          .pressButton('submit', function() {
          /** YOUR TESTS HERE, Don't forget to remove assert.fail() **/

          // pressButton is Async.  Waits for the ajax call to complete...

          // assert that status is OK 200
          browser.assert.success()
          // assert that the text inside the element 'span#name' is 'Cristoforo'
          browser.assert.text('span#name', 'Cristoforo')
          // assert that the text inside the element 'span#surname' is 'Colombo'
          browser.assert.text('span#surname', 'Colombo')
          // assert that the element(s) 'span#dates' exist and their count is 1
          browser.assert.element('span#dates', 1)

          done(); // It's an async test, so we have to call 'done()''
        });
      });
      // #6
      test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser.fill('surname', 'Vespucci').then(() => {
          browser.pressButton('submit', () => {
            browser.assert.success();
            browser.assert.text('span#name', 'Amerigo');
            browser.assert.text('span#surname', 'Vespucci');
            browser.assert.element('span#dates', 1);
            done();
          });
        });
      });
    });
  });
});

after(function() {
  chai.request(server)
    .get('/')
    .end();
});
