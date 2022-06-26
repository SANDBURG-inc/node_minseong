// @ts-check

const express = require("express")

const app = express()

app.use(express.urlencoded({ extended: true }))

app.get("/camp", (req, res) => {
  res.send("camping list")
})

app.get("/school", (req, res) => {
  res.send("elementary school?")
})

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get("/write", (req, res) => {
  res.sendFile(`${__dirname}/write.html`)
})

app.post("/add", (req, res) => {
  res.send("success!")
  console.log(req.body.date)
  console.log(req.body.title)
})
