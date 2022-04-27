function datediff() {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    const startDate = new Date(2022, 4-1, 14)
    const today = new Date
    return Math.round((today-startDate)/(1000*60*60*24));
}

module.exports = datediff