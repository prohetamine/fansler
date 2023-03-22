const fs = require('fs')
    , path = require('path')

module.exports = class {
  constructor (name, timeout = 60000) {
    this.basePath = path.join(__dirname, '')
    this.baseTmpPath = path.join(this.basePath, `tmp-${name}.json`)
    this.basePerPath = path.join(this.basePath, `${name}.json`)

    if (!fs.existsSync(this.basePerPath)) {
      fs.writeFileSync(this.basePerPath, JSON.stringify({}))
    }

    this.db = JSON.parse(fs.readFileSync(this.basePerPath, 'utf8'))

    setInterval(() => {
      fs.writeFileSync(this.baseTmpPath, JSON.stringify(this.db))
      for (;;) {
        try {
          fs.renameSync(this.baseTmpPath, this.basePerPath)
          break
        } catch (e) {
          console.log(`Err save: ${this.baseTmpPath}`)
        }
      }
    }, timeout)
  }

  check (key, data) {
    return !!this.db[key][data]
  }

  set (key, meta) {
    try {
      this.db[key] = {
        ...this.db[key],
        ...meta
      }
    } catch (e) {
      this.db[key] = meta
    }
  }

  get () {
    return Object.keys(this.db).map(key => ({ name: key, ...this.db[key] }))
  }
}
