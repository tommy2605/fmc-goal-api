const express = require('express')
const goals = require('./goals')
const database = require('./database')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.listen(8080, () => console.log('listening..'));
database.setup().then(() => console.log('Database is ready'))

app.get('/api/goals/', async (req, res) => {
    console.log(new Date(), 'handling request..')
    try {
        const result = await goals.find(req.query)
        res.json(result)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }    
})

app.get('/api/goals/:date', async (req, res) => {

    console.log(req.params)
    const query = req.query || {}
    if (req.params.date) query.date = req.params.date

    try {
        const result = await goals.find(query)
        res.json(result)
    } catch (err) {
        console.err(err)
        res.sendStatus(500)
    }
    
})

app.post('/api/goals', async (req, res) => {
    console.log(req.body)
    try {
        validate(req.body)
        res.status(200).send('ok')
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
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
    } catch {
        throw `Bad publishDate`
    }
}

app.use('/privacy_policy', express.static('./static/privacy_policy'))