const proxys = require('../libs/proxy')
    , fetch = require('node-fetch')
    , sleep = require('sleep-promise')
    , HttpsProxyAgent = require('https-proxy-agent')
    , DB = require('../libs/db')

const followApiRequest = async (proxy, username) => {
  try {
    const controller = new AbortController()

    setTimeout(() => {
      controller.abort()
    }, 10000)

    const { response } = await fetch(`https://apiv3.fansly.com/api/v1/account?usernames=${username}&ngsw-bypass=true`, {
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
      },
      signal: controller.signal
    })
    .then(e => e.json())

    if (response.length === 0) {
      return true
    } else {
      console.log('id:', response[0].id)
    }

    const controllerFollow = new AbortController()

    setTimeout(() => {
      controllerFollow.abort()
    }, 20000)

    const followData = await fetch(`https://apiv3.fansly.com/api/v1/account/${response[0].id}/followers?ngsw-bypass=true`, {
      agent: new HttpsProxyAgent(`http://${proxy}`),
      headers: {
        'authority': 'apiv3.fansly.com',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en;q=0.9',
        'authorization': 'NDk0ODgyMjQ3NDIyMjU1MTA0OjE6MjpmNjkyYjMxYjU2MjllYTZiNGZmOTk5NjI2ZjM3MjQ',
        'content-length': '0',
        'origin': 'https://fansly.com',
        'referer': 'https://fansly.com/',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      method: 'POST',
      signal: controllerFollow.signal
    })
    .then(e => e.json())

    console.log(followData)

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

;(async () => {

  const activeAccounts = new DB('active-accounts')

  for (let i = 6; i < activeAccounts.get().length; i++) {
    console.log(i)
    const account = activeAccounts.get()[i]

    if (!activeAccounts.check(account.name, 'iloveguoyd')) {
      for (;;) {
        const _proxys = proxys()
            , _proxy = _proxys[parseInt(Math.random() * _proxys.length)]

        console.log(_proxy, account.name)
        const isFollow = await followApiRequest(_proxy, account.name)
        if (isFollow) {
          break
        } else {
          await sleep(1000)
        }
      }
      await sleep(5000)

      activeAccounts.set(account.name, {
        ...account,
        ['iloveguoyd']: true
      })
    }
  }
})()
