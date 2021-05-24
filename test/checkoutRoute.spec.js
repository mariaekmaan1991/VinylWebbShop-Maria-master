const supertest = require("supertest")

const {
    app,
    port
} = require('../src/server');

describe("Routes test", () => {
    let server
    beforeEach(() => {
        server = app.listen(port, () => console.log('Testing server is running'))

    })

    it('Should respond to /checkout', (done) => {
        supertest(server).get('/checkout').expect(200, done())
    })


    it('Should respond to /checkout', (done) => {
        supertest(server).post('/checkout').expect(200, done())
    })

    afterEach((done) => {
        server.close(done)
    })
})