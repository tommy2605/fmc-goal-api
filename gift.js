const axios = require('axios')

const tikkiePattern = `<a href="(https:\/\/tikkie\.me\/pay.+?)">(.+?)<\/a>`
const ingPattern = `<a href="(https:\/\/www\.ing\.nl\/particulier\/betaalverzoek\/.+?)">(.+?)<\/a>`
const patterns = [tikkiePattern, ingPattern]

const createGift = (url, cityName) => {

    const getIban = () => {
        switch (cityName) {
            case 'Delft': return 'NL81 ING B 0006 255 935'
            case 'Amersfoort': return 'NL67 INGB 0005 3655 33'
            case 'Amstelveen': return 'NL ...'
            case 'Den Haag': return 'NL ...'
        }
    }

    const getBeneficiary = () => {
        switch (cityName) {
            case 'Delft': return 'Delft Christian Fellowship'
            case 'Amersfoort': return 'Amersfoort Christian Fellowship'
            case 'Amstelveen': return 'FMC Amstelveen'
            case 'Den Haag': return 'FMC Den Haag'
        }
    }
    const getOrder = () => {
        switch (cityName) {
            case 'Delft': return 1
            case 'Amersfoort': return 2
            case 'Amstelveen': return 3
            case 'Den Haag': return 4
        }
    }

    return {
        order: getOrder(),
        church: `FMC ${cityName}`,
        city: cityName,
        iban: getIban(),
        beneficiary: getBeneficiary(),
        url
    }
}

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
                cityName: match[2].replace(/<\/?\w+?>/g,'')
            }
        })
        .map(g => createGift(g.url, g.cityName))
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
