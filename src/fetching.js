const axios = require("axios")
const cheerio = require("cheerio")

let $href = []
axios.get(`https://thebook.io/080212`).then((dataa) => {
  const $ = cheerio.load(dataa.data)
  $("section.book-toc>ul>li>a").each((index, item) => {
    $href.push(item.attribs.href)
  })
  console.log($href)
})
