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

let offset = 154
  , usernames = []

const createData = (offset = 0) => {
  const magicNumbers = Array(10000).fill(true).map((e, i) => i)
      , words = fs.readFileSync(path.join(__dirname, '..' , 'assets/data/words.txt'), 'utf8').match(/.+/gi)
      , names = fs.readFileSync(path.join(__dirname, '..' ,'assets/data/names.txt'), 'utf8').match(/.+/gi)

  const magicNumbersLength = magicNumbers.length
      , wordsLength = words.length
      , namesLength = names.length

  console.log('------------')
  console.log('words: ', wordsLength)
  console.log('magic numbers: ', magicNumbersLength)
  console.log('names: ', namesLength)
  console.log('------------')

  const array = names.slice(offset, offset + 1).map(
    name => [
      ...magicNumbers.map(n => name+n),
      ...words.map(w => name+w),
      ...words.map(w => w+name),
      ...words.map(w => [
        ...magicNumbers.map(n => name+w+n),
        ...magicNumbers.map(n => name+n+w),
      ])
    ]
  ).flat().flat().flat()

  const data = []

  for (let i = 0; i < array.length; i += 300) {
    data.push(array.slice(i, i+300).join(','))
  }

  return data
}

const createDataController = () => {
  if (!(usernames.length > 0)) {
    console.log('offset: ', offset)
    usernames = createData(offset)
    offset += 1
    console.log('data created!')
  }
}

const apiRequest = async proxy => {
  let accounts = []
  createDataController()
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
            f.followCount < 10 &&
            f.postLikes === 0 &&
            f.accountMediaLikes === 0 &&
            !f.subscriptionTiers &&
            !f.pinnedPosts
        ).map(e => e.username)
      } else {
        console.log(data)
      }
    } catch (e) {
      usernames.unshift(_usernames)
    }
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
        usernamesArray = [...usernamesArray, ...usernames]
      }

      if (usernamesArray.length > 1000) {
        usernamesArray.forEach(username =>
          pureAccounts.set(username, {})
        )
        usernamesArray = []
      }
    }

    for (;;) {
      await Promise.all([
        request(),
        request(),
        request()
      ])
    }
  }
}

;(async () => {
  setInterval(() => {
    console.log('offset:', offset, 'stack:', usernames.length, 'proxy:', proxy().length, 'result:', pureAccounts.get().length)

    const proxyLength = proxy().length > 5

    if (proxyLength) {
      proxy().map(run)
    } else {
      console.log('wait proxy')
    }
  }, 10000)
})()
