;(async () => {
  const sleep = ms => new Promise(res => setTimeout(res, ms))

  const accountAuth = 'NDkzMzY0Njc4ODEwOTM5Mzk0OjE6Mjo2NmQ2NDc2MzkzNzAwYTRlNmM4YjY1YmY3NmNiMzA'

  window.users = []

  for (;;) {
    try {
      const username = await fetch('http://localhost:8989/get').then(e => e.json())

      const a = await fetch(`https://apiv3.fansly.com/api/v1/account?usernames=${username}&ngsw-bypass=true`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "authorization": accountAuth,
          "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://fansly.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(e => e.json())


      for (let i = 0; i < a.response.length; i++) {
        if (a.response[i].lastSeenAt > (new Date() - 2628000000)) {
          await fetch(`https://apiv3.fansly.com/api/v1/account/${a.response[i].id}/followers?ngsw-bypass=true`, {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "authorization": accountAuth,
              "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site"
            },
            "referrer": "https://fansly.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
          }).then(e => e.json()).then(e => {
            if (e.success) {
              window.users.push(a.response[i].username)
              console.log(a.response[i].username)
            } else {
              console.log('bad', a.response[i].username)
            }

            fetch(`http://localhost:8989/set?username=${a.response[i].username}`)
          })
          await sleep(5000)
        }
      }
    } catch (e) {}

    await sleep(100)
  }
})()
