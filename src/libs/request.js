const request = require('request-promise')

;(async ({ proxy, usernames }) => {
  setTimeout(() => {
    console.log('timeout')
    process.exit(0)
  }, 30000)

  try {
    const body = await request.defaults({ proxy: `http://${proxy}` }).get({
      url: `https://apiv3.fansly.com/api/v1/account?usernames=${usernames}&ngsw-bypass=true`,
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

    const data = JSON.parse(body)

    if (!data.success) {
      console.log('success bad')
    } else {
      console.log(JSON.stringify(data.response.filter(
        f =>
          f.followCount < 10 &&
          f.postLikes === 0 &&
          f.accountMediaLikes === 0 &&
          !f.subscriptionTiers &&
          !f.pinnedPosts
      ).map(e => e.username)))
    }
    process.exit(0)
  } catch (e) {
    console.log('timeout')
    process.exit(0)
  }
})({
  proxy: process.argv[2],
  usernames: process.argv[3]
})
