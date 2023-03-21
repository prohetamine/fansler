const axios = require('axios')
    , HttpsProxyAgent = require('https-proxy-agent')
    , proxy = require('./../../castum_modules/@prohetamine/proxy-checker')
    , sleep = require('sleep-promise')

const keyName = 'myproxy'

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Number of collected proxies
  }, 60000 * 30, { started: true, debug: false })

  const { key, kill, save, clean } = await proxy.checkerInterval(keyName, {
    url: 'https://apiv3.fansly.com/api/v1/account?usernames=anime&ngsw-bypass=true',
    timeout: 3000,
    stream: 3,
    session: __dirname + '/fansly',
    debug: false,
    indicators: [{
      keyword: 'success'
    }]
  })

  setInterval(() => {
    if (proxy.get(keyName).all()) {
      save()
    }
  }, 60000 * 5)
})()

module.exports = () => {
  try {
    return proxy.get(keyName).all()
  } catch (e) {
    return []
  }
}
