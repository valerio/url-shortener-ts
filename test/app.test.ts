import request from 'supertest'
import app from '../src/app'
import sinon from 'sinon'

import { instance, connect } from '../src/sequelize'
import { Url } from '../src/models'
import Hashids from 'hashids'
import SqlUrlRepository from '../src/repositories/url-repository'

describe('GET /random-url', () => {
  it('should return 404', async (done) => {
    request(app).get('/api/not-found').expect(404, done)
  })
})

describe('GET /:shortUrl', () => {
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  }),

  afterEach(() => {
    sandbox.restore()
  }),

  it('should return 500 for db errors', async (done) => {
    sandbox.stub(Url, 'findOne').rejects('DbError')
    request(app).get('/error!').expect(500, done)
  }),

  it('should return 404 for non-existing urls', async (done) => {
    sandbox.stub(Url, 'findOne').resolves(null)
    request(app).get('/n0tf0und').expect(404, done)
  }),

  it('should redirect with 301 for a short url that exists', async (done) => {
    const fullUrl = 'http://example.com'
    sandbox.stub(Url, 'findOne').resolves({ url: fullUrl })

    request(app).get('/found')
    .expect(301)
    .expect('Location', fullUrl)
    .end(done)
  })
})

describe('POST /api/url', () => {
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  }),

  afterEach(() => {
    sandbox.restore()
  }),

  it('should respond 400 for missing body', async (done) => {
    request(app).post('/api/url').expect(400, done)
  }),

  it('should respond 400 for missing url', async (done) => {
    request(app).post('/api/url')
    .send({ stuff: '' })
    .expect(400, done)
  }),

  it('should respond 400 when url in body is not a valid uri', async (done) => {
    request(app).post('/api/url')
    .send({ url: 'invalid:url?//' })
    .expect(400, 'InvalidUrl', done)
  }),

  it('should respond 400 when url has no http/https scheme', async (done) => {
    request(app).post('/api/url')
    .send({ url: 'www.example.com/i-like-big-urls?and=i-cannot-lie' })
    .expect(400, done)
  }),

  it('should return 500 for db errors', async (done) => {
    sandbox.stub(SqlUrlRepository.prototype, 'getLastAvailableCount').rejects('DbError')

    request(app).post('/api/url')
    .send({ url: 'https://www.example.com' })
    .expect(500, done)
  }),

  it('should respond 201 with a shortened url in the body', async (done) => {
    const shortUrl = 'shortUrl'

    sandbox.stub(Url, 'findOne').resolves({ count: 1 })
    sandbox.stub(Url, 'create').resolves(null)
    sandbox.stub(Hashids.prototype, 'encode').returns(shortUrl)

    request(app).post('/api/url')
    .send({ url: 'https://www.example.com' })
    .expect(201, shortUrl, done)
  })

  it('should create a shortened url with count 0 if it is the first created', async (done) => {
    const shortUrl = 'shortUrl'

    sandbox.stub(Url, 'findOne').resolves(null)
    sandbox.stub(Url, 'create').resolves(null)

    let encodeStub = sandbox.stub(Hashids.prototype, 'encode').returns(shortUrl)

    await request(app).post('/api/url')
    .send({ url: 'https://www.example.com' })
    .expect(201, shortUrl)

    sinon.assert.calledWith(encodeStub, 0)

    await done()
  })
})
