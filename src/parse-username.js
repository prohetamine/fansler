const axios = require('axios')
    , HttpsProxyAgent = require('https-proxy-agent')
    , { SocksProxyAgent } = require('socks-proxy-agent')
    , fs = require('fs')
    , path = require('path')
    , sleep = require('sleep-promise')
    , readline = require('readline')
    , proxy = require('./libs/proxy')

axios.defaults.timeout = 60 * 1000 * 10

let i = 0
  , offset = 0
  , usernames = []
  , blocked = false

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
  if (!usernames[i]) {
    i = 0
    console.log('offset: ', offset)
    usernames = createData(offset)
    offset += 1
    console.log('data created!')
  }
}

const apiRequest = async ({ proxy, auth, type, cookies }) => {
  let accounts = []
  createDataController()
  if (usernames[i]) {
    i++
    for (let k = 0; k < 10; k++) {
      try {
        const { data } = await axios(`https://apiv3.fansly.com/api/v1/account?usernames=${usernames[i-1]}&ngsw-bypass=true`, {
          agent: type === 'socks5' ? new SocksProxyAgent(proxy) : new HttpsProxyAgent(proxy),
          headers: {
            "authority": "apiv3.fansly.com",
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": auth,
            "cookies": cookies,
            "origin": "https://fansly.com",
            "referer": "https://fansly.com/",
            "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
          },
          referrer: "https://fansly.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include"
        })

        if (!data.success) {
          console.log('success bad')
          await sleep(5000)
        } else {
          accounts = data.response.filter(
            f =>
              f.followCount < 10 &&
              f.postLikes === 0 &&
              f.accountMediaLikes === 0 &&
              !f.subscriptionTiers &&
              !f.pinnedPosts
          ).map(e => e.username)
        }
        break
      } catch (e) {
        console.log(e)
        await sleep(5000)
      }
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

const controller = async account => {
  let usernamesArray = []

  for (;;) {
    const usernames = await apiRequest(account)
    if (usernames.length !== 0) {
      console.log(usernames)
    }
    usernamesArray = [...usernamesArray, ...usernames]

    if (usernamesArray.length > 100) {
      writeCall(usernamesArray.join('\n')+'\n')
      usernamesArray = []
    }
  }
}

const run = async account => {
  for (let i = 0; i < 2; i++) {
    controller(account)
    await sleep(1000)
  }
}

JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'accounts.json'), 'utf8')).forEach(run)
