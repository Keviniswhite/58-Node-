
// cheerio 服务端 jquery
// fetch 网络请求
const cheerio = require('cheerio')
const fetch = require('node-fetch')

//utils
const log = console.log.bind(console)

// model
const House = function() {
    this.title = null
    this.imgUrl = null
    this.housePrice = null
}


const requestByUrl = function(url, callback) {
    fetch(url).then(data => {
        return data.text()
    }).then(data => {
        callback(data)
    })
}
const saveHouseInfo = function(houseInfo) {
    const fs = require('fs')

    var path = './house.txt'
    var data = JSON.stringify(houseInfo, null, 2)

    fs.writeFileSync(path, data, 'utf-8')
    log('写入成功')

}
const houseFromList = function(houseList) {
    var house = new House()
    var e = cheerio.load(houseList)
    var text = e('.price').text().split('\n')

    house.title = e('.title').find('a').text()
    house.imgUrl = e('.pic').find('img').attr('src')
    house.housePrice = (text[1] + text[2]).trim().trim()

    return house
}
const houseFromUrl = function(url) {
    requestByUrl(url, html => {
        var e = cheerio.load(html)
        var houseList = e('.house-list-wrap').find('li')
        var length = houseList.length
        var houseData = []
        for (var i = 0; i < length; i++) {
            var houseInfo = houseList[i]
            var li = houseFromList(houseInfo)
            li.id = i + 1;
            houseData.push(li)
            
        }
        return saveHouseInfo(houseData)
    })

}

const __main = function() {
    var url = 'https://sy.58.com/ershoufang/'
    houseFromUrl(url)
}
__main()
