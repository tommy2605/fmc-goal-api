require('dotenv').config()
const express = require('express')
const goals = require('./goals')
const database = require('./database')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// bootstrap
;(async () => {
    await database.setup()
    console.log('Database is ready!')
    app.listen(process.env.PORT, () => console.log(`Server is ready at port ${process.env.PORT}!`));
})()

app.get('/api/goals/', async (req, res) => {
    console.log('GET /api/goals/')
    try {
        const result = await database.queryAll()
        res.json(result)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }    
})

app.post('/api/goals', async (req, res) => {
    console.log('POST /api/goals')
    try {
        const item = req.body
        validate(item)
        await database.createItem(item)
        res.status(200).send('ok')
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
        console.log(err)
    }
})

const validate = item => {
    if (!item) throw `Missing data`
    if (!item.title) throw `Missing title`
    if (!item.culture) throw 'Missing culture'
    if (!['en', 'nl', 'id'].includes(item.culture)) throw `Bad culture`
    if (!item.publishDate) throw `Missing publishDate`
    if (!item.content) throw `Missing content`
    try {
        const date = new Date(item.publishDate)
        if (date.getDay() !== 0) throw `Bad publishDate`
        const publishDate = date.formal()
        item.publishDate = publishDate
        item.publishDateInCulture = goals.publishDateInCulture(`${publishDate}_${item.culture}`)
    } catch {
        throw `Bad publishDate`
    }
}

Number.prototype.formal = function(length) {
    let result = this.toString()
    while (result.length < length) {
        result = `0${result}`
    }
    return result
}

Date.prototype.formalDate = function() {
    return this.getDate().formal(2)
}

Date.prototype.formalMonth = function() {
    return (this.getMonth() + 1).formal(2)
}

Date.prototype.formal = function () {
    return `${this.getFullYear()}${this.formalMonth()}${this.formalDate()}`
}

app.use('/privacy_policy', express.static('./static/privacy_policy'))