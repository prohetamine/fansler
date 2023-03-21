const request = require('request-promise')
    , fs = require('fs')
    , path = require('path')
    , readline = require('readline')
    , sleep = require('sleep-promise')
    , proxy = require('./libs/proxy')
    , { fork } = require('child_process')
    , syncRandom = array =>
        array.map(elem => [elem, Math.random()]).sort((a, b) => a[1] - b[1]).map(elem => elem[0])

let offset = 7
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
      const result = await new Promise(res => {
        const _request = fork(__dirname + '/libs/request.js', [proxy, _usernames])
        _request.once("message", message => {
          res(`${message}`.trim())
        })
      })

      if (result === 'timeout') {
        throw new Error(result)
      }

      if (result === 'success bad') {
        throw new Error(result)
      }

      accounts = JSON.parse(result)
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
const run = async proxy => {
  if (runer[proxy]) {
    return
  } else {
    runer[proxy] = true
    let usernamesArray = []

    const request = async () => {
      const usernames = await apiRequest(proxy)

      if (usernames.length !== 0) {
        console.log('add accounts', usernames.length)
      }

      usernamesArray = [...usernamesArray, ...usernames]

      if (usernamesArray.length > 100) {
        writeCall(usernamesArray.join('\n')+'\n')
        usernamesArray = []
      }

      setTimeout(request, 100)
    }

    setTimeout(request, 100)
  }
}

;(async () => {
  setInterval(() => {
    console.log('offset:', offset, 'stack:', usernames.length, 'proxy:', proxy().length)

    const proxyLength = proxy().length > 5

    if (proxyLength) {
      proxy().slice(0, 200).map(run)
    } else {
      console.log('wait proxy')
    }
  }, 5000)
})()
