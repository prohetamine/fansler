const request = require('request-promise')
    , DB = require('./libs/db')
    , fs = require('fs')
    , path = require('path')
    , readline = require('readline')
    , sleep = require('sleep-promise')
    , proxy = require('./libs/proxy')
    , fetch = require('node-fetch')
    , HttpsProxyAgent = require('https-proxy-agent')
    , syncRandom = array =>
        array.map(elem => [elem, Math.random()]).sort((a, b) => a[1] - b[1]).map(elem => elem[0])

const pureAccounts = new DB('pure-accounts')
    , activeAccounts = new DB('active-accounts')

console.log('Pure accounts:', pureAccounts.get().length)
console.log('Active accounts:', activeAccounts.get().length)
console.log('---------------------------')

const usernames = pureAccounts.get().reduce((ctx, elem) => {
  if (ctx[ctx.length - 1].length < 100) {
    ctx[ctx.length - 1].push(elem.name)
  } else {
    ctx.push([elem.name])
  }
  return ctx
}, [[]]).map(e => e.join(','))

const apiRequest = async proxy => {
  let accounts = []
  if (usernames.length > 0) {
    const _usernames = usernames.shift()
    try {
      const result = await fetch(`https://apiv3.fansly.com/api/v1/account?usernames=${_usernames}&ngsw-bypass=true`, {
        agent: new HttpsProxyAgent(`http://${proxy}`),
        headers: {
          "authority": "apiv3.fansly.com",
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-ch-ua": '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
        }
      })
      .then(e => e.text())

      const data = JSON.parse(result)

      if (data.success) {
        accounts = data.response.filter(
          f =>
            f.lastSeenAt > (new Date() - 2628000000)
        ).map(e => e.username)
      } else {
        console.log(data)
      }
    } catch (e) {
      usernames.unshift(_usernames)
    }
  } else {
    console.log('usernames is empty')
    await sleep(5000)
    process.exit()
  }

  return accounts
}

const writeCall = usernamesString => {
  for (;;) {
    try {
      fs.appendFileSync(path.join(__dirname, '..', 'assets', 'pure-accounts.txt'), usernamesString)
      break
    } catch (e) {
      console.log(e)
    }
  }
}

const runer = {}
let usernamesArray = []
const run = async proxy => {
  if (runer[proxy]) {
    return
  } else {
    runer[proxy] = true


    const request = async () => {
      const usernames = await apiRequest(proxy)

      if (usernames.length !== 0) {
        console.log('add accounts', usernames.length)
        usernames.forEach(username =>
          activeAccounts.set(username, {
            update: new Date() - 0
          })
        )
      }
    }

    for (;;) {
      await Promise.all([
        request(),
        request()
      ])
    }
  }
}

;(async () => {
  setInterval(() => {
    console.log('stack:', usernames.length, 'proxy:', proxy().length, 'result:', activeAccounts.get().length)
    const proxyLength = proxy().length > 5

    if (proxyLength) {
      proxy().slice(0, 10).map(run)
    } else {
      console.log('wait proxy')
    }
  }, 1000)
})()
