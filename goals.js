const fs = require('fs').promises
const path = require('path')


const find = async (query) => {
    const { culture } = query || {}

    const files = await fs.readdir('./data')
    const goalsPromises = files
        .map(fn => path.join('./data', fn))
        .map(readGoal)

    const goals = await Promise.all(goalsPromises)

    return goals
        .filter(goal => !culture || goal.culture === culture.toLowerCase())
        .sort((a,b) => parseInt(b.publishDate) - parseInt(a.publishDate))
}

const readGoal = async (fileName) => {
    const content = (await fs.readFile(fileName)).toString()
    const lineBreak = content.indexOf('\n')
    return {
        publishDate: parseDate(fileName),
        culture: parseCulture(fileName),
        title: content.substr(0, lineBreak).trim(),
        content: content.substr(lineBreak + 1).replace(/\r\n/g, ''),
        publishDateInCulture: publishDateInCulture(fileName)    
    }
}

const parseDate = (fileName) => {
    const parsedDate = fileName.match(/(\d{4})(\d{2})(\d{2})/)
    if (parsedDate) {
        return parsedDate[0]
    }
}

const publishDateInCulture = (fileName) => {
    const parsedDateCulture = fileName.match(/(\d{4})(\d{2})(\d{2})_(\w{2})/)
    
    const monthNames = {
        id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }

    if (parsedDateCulture) {
        const year = parseInt(parsedDateCulture[1])
        const month = parseInt(parsedDateCulture[2]) - 1
        const day = parseInt(parsedDateCulture[3])
        const culture = parsedDateCulture[4].toLowerCase()

        switch(culture) {
            case 'id':
            case 'nl':
                return `${day} ${monthNames[culture][month]} ${year}`
            case 'en':
                return `${monthNames[culture][month]} ${day}, ${year}`
            default:
                return `${year}-${month}-${day}`
        }

    }
}

const parseCulture = (fileName) => {
    const parsedCulture = fileName.match(/\d{8}_([a-z]{2})/i)
    return parsedCulture ? parsedCulture[1].toLowerCase() : undefined
}

module.exports = {
    find,
    publishDateInCulture
}