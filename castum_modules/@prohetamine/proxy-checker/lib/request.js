const request = require('request-promise')

;(async ({ url, proxy, timeout, indicators }) => {
  setTimeout(() => {
    console.log('timeout')
    process.exit(0)
  }, timeout)

  try {
    const body = await request.defaults({ proxy }).get({
      url,
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

    console.log(!!indicators.find(({ keyword }) => body.match(keyword)))
    process.exit(0)
  } catch (e) {
    console.log('timeout')
    process.exit(0)
  }
})({
  url: process.argv[2],
  proxy: process.argv[3],
  timeout: process.argv[4],
  indicators: JSON.parse(process.argv[5])
})
