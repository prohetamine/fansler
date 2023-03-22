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

const pureAccounts = new DB('pure-accounts-from-cb')

let offset = 0
  , usernames = []
  , blocked = false

const models = [
  "_2strangers","asuna__love","pepperxminthe","xiawa_xo","makoto_mai","xvsesss","euphoria_life","lolalee910","amaya_mori","sae__","madeline_jackson","evelynpiers","cherry_beauty","neferpita","loonyko","_meganmeow_","happiness_call","angels_kiss","fairyinthewild","littytittygirl","beverlyvega","annemanifique","cute__foxy","oliviaowens","oh_honey_","nica_rock","victoriahillova","candyred88","theashleydaniels","sonya_kelsey","sweet_sin_sati","chery_lady22","tastytilly","donnahunters","lucifera1","8a8y_nura","you_are_my_sunshine","emma_johnson_","seon_mi","taanni_bc","fit_american_girl","valerie_james3","daddystrouble","amyvalentine","lalalexa","privatebrittney","hawaiigirl_","jessiccaburns","taeni_lara","tinatopp","_artease_","chrysanthulu","sweetsweet__baby","krisi_kiss","little_dutch","mileenakane","happyfungirlxo","hiromi_yu","kassablanca_","sonya_keller","_myaa","royalsquirt_","enncandy","pinkncrazy","w0wgirls","liliafourtwenty","_mito_69","anabel054","scartit","hiddenr0se","ginger_pie","sofiaandwonderland","ssweetbun","lisa2018","sweetfox_365","99ary","bellaebonyy","kira0541","mandy138","honeyand_thebear","dola_","hotmilfkris","lau__1","melaniebiche","mari_and_jandro","white__crystal_","ji_hyun","ashley_jones9","mynaughtynights","janice_sweet","dolce4you69","college_slut__","gia_is_horny","americannpie","gabby_haze","_d_a_s_h_a_","sweet_lau","kathylovexxx","tin_zhi","biasinta","sigmasian","huntertiana","porn_and_psychology","vonnalein","mermaidrozalia","erikabee","sharlin_13","guccimycucci","avrora_deis","carly_coy","indierose","ingridblondy94","zenda_belov","lana_lee_","aedanjustine","b00berry","oliviabr0wn","abbie_hoffman","hellonaomi","salomee_11","melissabarbie","jem_rosset","melinaestes","gingerbaby10001","delphinium18xo","addelin_moon","kitty_hotx","luna_kuka","ayanami11","baby_gopn1k","sweetmelii29","kitana_ray","lilbeccaxo","emilybrowne","kiara_roses","dora_wayne","girlnextdoor702","mae_layla","lulissa","sexytail007","shantallknowless","brandywhite","itsme_az","missmina","angell6969","lanitarhoa","evejagger","uhhottie","barbie_lis","mary_marlow","xorabbit","le__ah","megancastiel","kozzy_","rebeccabryan","amyalwayshere","annwithoutane","charlette_webb_xxx","pamelacreed_","willow_hendrix","jasminedaze888","vanne_universe","ainamil","_autumn_rain","sexxxylook","viciousqueen","crystalnut","mode_bad","anabella_stone","daisypro","sarawilsons","riababe","coastaldivas","sadbxtch_000","bkelseyb","cindybkk","shycinderella","kali_yuga_","channel_boobs_","jilanling","blue_ocean_eyes","kriskras__","missfire69","emma_jhons0n","missgabii","8_molly_8","verasun","cherrycreme","stormydanielle777","b3ttyblack","alex_next_door","darling_megan_","cherrypie_01","lunessa_","heyimjuly","radiancevivian","kkriste72804","queen_leylla","kayleigh_reef","dose_of_sex","veola_new","lily_sweet_cheeks","wmeow","disney__princess","dakotanorth","s_leanne_","francesdonna","emmicanfly","violetli_","umnizza7777","sofikinz","meredith_bell","shiny_lana","lana_roux","vvioleta_","saintlyn","angeles_blue23","stefanie_collins","rebecca0019","kellyfernandes","bbbeth_","sarahuff","cumonclit","asian_yasu","katty_lovel","yuki_hattori","mia_0316","magicshine","laracara","oxxxy__","aishaice","kammilun","hugeboobserin","eyecandi7","little_bloom","mysweetsofie1","mia_pearls","skinny_alice","kristal_bannet","gaaby_","adda_","babby_alexxx","goodvibescouple","alejandraa_cutee_1","savanahwildc","ouulalaa1","analucia_suarez1","scarlett_jones__","nakayamaa","a_mhere","anabellastar","dulce_lf","amelia_lov","janne_miller_","ella_la","_mss_sofia","avaferrera","antonella_maitt","siren666","biigcandy_","lawrencejennifer","yes_baby_shine","soft_doll_small","dexter_and_kelly","arinamir","yuli_ya","ellamilf","danny_og","nikyblonnd","meganhotxx2","pink_dustt","anitalynch","son_yun","alisson_rocker","_always__horny","pastelpuppyy","carrielovex","luxurylips","melaniah_","adorable_anna","din_star","tania_malala","eccentric_sammie","mariglory","soyemi_","dolly_pollly","xxjordanmartinezxx","pinkbaton72","isalatinhot","foxy8spy","pappymagik","cii_lerry","bellaglorry","ashley_v_","cherrymommy420","valerie07","patricia_bloom","rich_roxy","miainnocence","asaleong","loopcia","lexyapril","misslullu","natt__","the_right_girl","annie_1tsuki","piink_kitty","helenrus","cinacramby","mia_2406","alexalovecastle","arte_adelle","katerinestone","sweet_tits2","naomi_su","katnisseverdy","kaylieboom","mai_sakurajima","emma_sandovaal","queen_a_n_i","creamyexotica","yoon_mina","big_lava","jane__klein","sweet_rosse20","milana_hot3","shini_doll","ssashagarter","avrilelavin","mackenzie_17","isis_scarlett","calabadi","ur_babe__","mialenox","katcat98","hornykittens","afinasoft","lee_kimura","mollyfancy","im_alinna","just4you101","liza_linsss","missmixxi","zoe_kollins","lillybrill","needmorespeed","safirafuracao","pink_monster","manyflip","emillii_","pariswild","makiyahbelle2","sumiyaya","anayscaandy","earlyflowerr","andy05hernandez_","cherrybunny21","spring_girls","classdeb","vanessacroft","cainnancyn","_top_skinny","melondama","kloeking_","hetty_satar","mila_kimm","yuna_03","melissalovely_","simply_sasha","alejamillan","squirtmilfpussy","wow_stephany","cho_nando","cassandra_moore","renessy_","mikokhvan","athena_samael","evacoal","elen_black","petite_camila","onezyzz1","kylie_ian_","andnowwhatt","teona_ti","annachanel","elearwikay","shanaya_indian","tianale","vanessa_suarez","mysticmodel888","saory10","liveoncam1","tobywardroby","andromedasoul","elisemorris","amelieaxie","katiecharm","evelinarose","snackonmypeach","luv4bud","alice_hot123","sophiawil95","imsurprise2","sexfairy666","lilyswee_tie","taylormoonxoxo","merelin_gold","maiko_","aluqua","sharon__toys","juicekatee","gangelin_","secret18slaveanon","miss_pawi","someonesday","emmalopez01","alexsaintpeter","bettysmoke","bonjurlulu","youranathema","abbinatural","jenniferdom","theasianfantasy","ladyleea","kate_cuddle","shaaronn_sweet","callmeteffy","missisann","kurvykitty069","valentinanotti","paolarey_","superbdolls","ana_karin","xxangelbeats","aprilinalba","kathy_elmers","vanessafresh","th0se_tits_th0","samantha__james","boobsbounce69","_sinwithme_","verdanna","sayl0r_moon","paradisepleasure_","hilaryhilton_","annaxnasty","_zendaya_x","dianaemily","isa_redhair_","latin_rihanna_","_perla_white","stephanie1313","auroramatureini","betty_sky4u","hodgesalice","tessxxx91","nix_brown","chloicampbell","wolfsfoster","sandralawrence","karina_torres_","ryka_sweet","ivannajhons_","keyara_","kylie_star09","bonnypetite","christine0990__","saaramiller_","amybradshaw1","lorileen","lilith_chapman","vane_fox","lilicarter_1","yosha_kanumi","angel_rouse_1","jennsparklexo","nadiajoness","itsyourcassie","emmasn0w","nilou_rose","petitbelle","alexabuttler","jenniferlesson","estef_miller","sweetdeemon","littlegrillove","lindsbasx","erotic_ebony_","shinecolour","your_bestie_girl","littlepussy_kat","asianbabydoll","aelitashaw","angelmomm","tatacoy","cutesmallasain","andy_wonder","agata_locbrock","misty_malkova","ladahear_"
]

const createData = async (offset = 0) => {
  try {
    const controller = new AbortController()

    setTimeout(() => {
      controller.abort()
    }, 4000)

    const result = await fetch(`https://chaturbate.com/api/getchatuserlist/?roomname=${models[offset]}`, {
      agent: new HttpsProxyAgent(`http://${proxy()[parseInt(Math.random() * 200)]}`),
      signal: controller.signal
    })
    .then(e => e.text())

    const array = result.match(/[^,]+/gi).slice(1).map(e => e.match(/[^\|]+/gi)).filter(e => e[2] === 'm').map(e => e[0])

    const data = []

    for (let i = 0; i < array.length; i += 300) {
      data.push(array.slice(i, i+300).join(','))
    }

    return data
  } catch (e) {
    return false
  }
}

const createDataController = async () => {
  if (!(usernames.length > 0) && !blocked) {
    console.log('offset: ', offset)
    blocked = true
    const data = await createData(offset)
    if (data !== false) {
      usernames = [...usernames, ...data]
      offset += 1
      console.log('data created!')
    }
    blocked = false
  }
}

const apiRequest = async proxy => {
  let accounts = []
  await createDataController()
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
  } else {
    await sleep(6000)
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
          pureAccounts.set(username, {})
        )
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
