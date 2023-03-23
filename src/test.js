/*const proxy = require('./libs/proxy')

;(async () => {

  setInterval(() => {
    console.log(proxy())
  }, 5000)

})()
*/

const fetch = require('node-fetch')
    , HttpsProxyAgent = require('https-proxy-agent')

;(async () => {

  const result = await fetch(`https://apiv3.fansly.com/api/v1/account/me?ngsw-bypass=true`, {
    agent: new HttpsProxyAgent(`http://203.142.69.254:8080`),
    headers: {
      'authority': 'apiv3.fansly.com',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en;q=0.9',
      'authorization': 'NDk0ODgyMjQ3NDIyMjU1MTA0OjE6MjpmNjkyYjMxYjU2MjllYTZiNGZmOTk5NjI2ZjM3MjQ',
      'origin': 'https://fansly.com',
      'referer': 'https://fansly.com/',
      'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
    }
  })
  .then(e => e.json())

  console.log(result)

})()
