
/**
 * Creates a new heartbeat emitter with the given parameters
 *
 * @param {string} title Process title
 * @param {string} id Unique id of the process (in case of dockerized application it would be the container ID as the process ID is always 1)
 * @param {function} appState Should return any application specific state descriptor object.
 *                            Its return value will appear in the heartbeat object with 'state' key.
 * @param {function} callback This will be called periodically
 * @param {integer} interval The heartbeat interval in milliseconds (default: 60000 i.e. 1 min)
 */
module.exports = (title, id, appState, callback, interval = 60000) => {
  /** The timer handle of the periodic call */
  let timerHandle
  let counter = 1

  /** Heartbeat emitter */
  function beat () {
    const memUsage = process.memoryUsage()
    let beatObj = {
      'id': id,
      'counter': counter++,
      'title': title,
      'state': appState(),
      'uptime': process.uptime(),
      'rss': MB(memUsage.rss),
      'heapTotal': MB(memUsage.heapTotal),
      'heapUsed': MB(memUsage.heapUsed),
      'external': MB(memUsage.external)
    }
    callback(beatObj, 'heartbeat')
  }

  /** Bytes to Megabytes */
  function MB (byteLength) {
    return Math.floor(byteLength / 1048576)
  }

  /** Starts the heartbeat process */
  function start () {
    timerHandle = setInterval(beat, interval)
  }

  /** Stops the heartbeat process */
  function stop () {
    clearInterval(timerHandle)
  }

  return {
    interval,
    start,
    stop,
    beat
  }
}
