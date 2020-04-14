const express = require('express')
const goals = require('./goals')

const app = express()

app.listen(8080, () => console.log('listening..'));

app.get('/app/goals/', async (req, res) => {
    try {
        const result = await goals.find(req.query)
        res.json(result)
    } catch (err) {
        console.err(err)
        res.sendStatus(500)
    }    
})

app.get('/app/goals/:date', async (req, res) => {

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

