// @ts-check

const express = require("express")

const app = express()

// eslint-disable-next-line
const { MongoClient } = require("mongodb")

// eslint-disable-next-line
var db

MongoClient.connect(
  "mongodb+srv://minseong:qwer1234@cluster0.21z5wjm.mongodb.net/?retryWrites=true&w=majority",
  // eslint-disable-next-line
  (error, client) => {
    if (error) return console.log("ERROR ERROR ERROR ERROR")
    // @ts-ignore
    db = client.db("todoapp")

    // @ts-ignore
    db.collection("post").insertOne({ name: "John", _id: 100 }, () => {
      console.log("complete!")
    })

    app.listen(8080, () => {
      console.log("listening on 8080")
    })
  }
)

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
