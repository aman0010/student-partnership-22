let list = ['https://twitter.com/AdityaBajra333', 'https://twitter.com/AmanShr69467392/', 'https://twitter.com/elonmusk']

let a = list.map(user=> {
    twitterEndIndex = user.indexOf('twitter.com/')+12
    console.log(user.split('twitter.com/')[1].replaceAll('/', ''))
})