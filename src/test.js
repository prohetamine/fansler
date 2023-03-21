const proxy = require('./libs/proxy')
    , fetch = require('node-fetch')
    , sleep = require('sleep-promise')
    , HttpsProxyAgent = require('https-proxy-agent')

;(async () => {
  await sleep(999)
  const proxys = proxy()

  for (let i = 0; i < proxys.length; i++) {
    fetch('https://api.ipify.org', {
      agent: new HttpsProxyAgent(`http://${proxys[i]}`)
    })
      .then(e => e.text())
      .then(e => console.log(e))
      .catch(e => {
        console.log(e)
      })
  }

})()
