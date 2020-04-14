const fs = require('fs').promises
const path = require('path')


const find = async (query) => {
    const { culture, date, after } = query || {}

    const files = await fs.readdir('./data')
    const goalsPromises = files
        .map(fn => path.join('./data', fn))
        .map(readGoal)

    const goals = await Promise.all(goalsPromises)

    const queryDate = date ? parseDate(date) : undefined
    const afterDate = after ? parseDate(after) : undefined

    return goals
        .filter(goal => !culture || goal.culture === culture.toLowerCase())
        .filter(goal => !queryDate || goal.publishDate.valueOf() === queryDate.valueOf())
        .filter(goal => !afterDate || goal.publishDate.valueOf() > afterDate.valueOf())
}

const readGoal = async (fileName) => {
    const content = (await fs.readFile(fileName)).toString()
    const lineBreak = content.indexOf('\n')
    return {
        publishDate: parseDate(fileName),
        culture: parseCulture(fileName),
        title: content.substr(0, lineBreak).trim(),
        content: content.substr(lineBreak + 1).replace(/\r\n/g, '')    
    }
}

const parseDate = (fileName) => {
    const parsedDate = fileName.match(/(\d{4})(\d{2})(\d{2})/i)
    if (parsedDate) {
        return new Date(
            parsedDate[1], 
            parseInt(parsedDate[2]) - 1, 
            parseInt(parsedDate[3]))
    }
    return new Date()
}

const parseCulture = (fileName) => {
    const parsedCulture = fileName.match(/\d{8}_([a-z]{2})/i)
    return parsedCulture ? parsedCulture[1].toLowerCase() : undefined
}

module.exports = {
    find
}