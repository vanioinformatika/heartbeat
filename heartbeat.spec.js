/* eslint-env mocha */
const sinon = require('sinon')
const chai = require('chai')
chai.use(require('sinon-chai'))
chai.use(require('dirty-chai'))
const expect = chai.expect

const processTitle = 'title_of_process'
const id = 'my_unique_id'
const state = { whatever: 'My specific application state', subState1: 'UP', subState2: 'DOWN' }
const appState = sinon.spy(() => {
  return state
})
const callback = sinon.spy()
const interval = 1000

describe('heartbeat', () => {
  const heartbeat = require('./heartbeat')(processTitle, id, appState, callback, interval)
  it('should create a new instance with the specified interval', () => {
    const heartbeat1 = require('./heartbeat')(processTitle, id, appState, callback, interval)
    expect(heartbeat1.interval).to.equal(interval)
  })
  it('should create a new instance with the default interval if none specified', () => {
    const heartbeat2 = require('./heartbeat')(processTitle, id, appState, callback)
    expect(heartbeat2.interval).to.equal(60000)
  })
  describe('beat', () => {
    it('should send a status object to the logger and return it', () => {
      heartbeat.beat()
      expect(callback).to.be.calledOnce()
      expect(callback).to.be.calledWith(sinon.match.object, 'heartbeat')
      const beatObj = callback.getCall(0).args[0]
      expect(appState).to.be.calledOnce()
      assertBeatObject(beatObj)
    })
  })
  describe('start', () => {
    it('should start scheduling the heartbeat as per the specified interval', async function () {
      this.slow(interval + 500)
      this.timeout(interval + 500)
      callback.resetHistory()
      appState.resetHistory()
      heartbeat.start()
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            expect(callback).to.be.calledOnce()
            expect(callback).to.be.calledWith(sinon.match.object, 'heartbeat')
            const beatObj = callback.getCall(0).args[0]
            expect(appState).to.be.calledOnce()
            assertBeatObject(beatObj)
            resolve()
          } catch (err) {
            /* istanbul ignore next */
            reject(err)
          }
        }, interval + 100)
      })
    })
  })
  describe('stop', () => {
    it('should stop scheduling the heartbeat', async function () {
      this.slow(interval * 2 + 500)
      this.timeout(interval * 2 + 500)
      callback.resetHistory()
      appState.resetHistory()
      heartbeat.stop()
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            expect(callback).to.not.be.called()
            resolve()
          } catch (err) {
            /* istanbul ignore next */
            reject(err)
          }
        }, interval * 2)
      })
    })
  })
})

function assertBeatObject (beatObj) {
  expect(appState).to.be.calledOnce()
  expect(beatObj).to.have.property('id').that.equals(id)
  expect(beatObj).to.have.property('counter').that.is.a('number')
  expect(beatObj).to.have.property('title').that.is.a('string')
  expect(beatObj.title).to.be.equal(processTitle)
  expect(beatObj).to.have.property('state').that.deep.equals(state)
  expect(beatObj).to.have.property('uptime').that.is.a('number')
  expect(beatObj).to.have.property('rss').that.is.a('number')
  expect(beatObj).to.have.property('heapTotal').that.is.a('number')
  expect(beatObj).to.have.property('heapUsed').that.is.a('number')
  expect(beatObj).to.have.property('external').that.is.a('number')
}
