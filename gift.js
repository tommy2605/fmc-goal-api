const axios = require('axios')

const tikkiePattern = `<a href="(https:\/\/tikkie\.me\/pay.+?)">(.+?)<\/a>`
const ingPattern = `<a href="(https:\/\/www\.ing\.nl\/particulier\/betaalverzoek\/.+?)">(.+?)<\/a>`
const patterns = [tikkiePattern, ingPattern]

const getLinks = async () => {
    console.log('fetching payment links...')
    const response = await axios.get('https://www.fmc-online.nl/sunday')

    if (response.status !== 200) throw {
        message: 'Unable to reach fmc-online.nl',
        httpStatus: response.status
    }

    return patterns
        .map(pattern => response.data.replace('\n',' ').replace('\r', ' ').match(RegExp(pattern, 'g')))
        .reduce((total, current) => total.concat(current), [])
        .map(link => patterns.reduce( (match, pattern) => match || link.match(pattern), undefined ))
        .map(match => {
            return {
                url: match[1],
                church: match[2].replace(/<\/?\w+?>/g,'')
            }
        })
}

const twelveHoursInMSecs = 12 * 3600 * 1000

const cache = {
    data: undefined,
    timestamp: new Date(0),
    isExpired: () => !cache.data || (new Date()).valueOf() - cache.timestamp.valueOf() > twelveHoursInMSecs
}

const updateCache = async () => {
    try {
        cache.data = await getLinks()
        cache.timestamp = new Date()            
    } catch (e) {
        console.error(e)
    }
}


const getFromCache = async () => {
    if (cache.isExpired()) {
        await updateCache()
    }

    return cache.data
}

module.exports = {
    getLinks: getFromCache
}
