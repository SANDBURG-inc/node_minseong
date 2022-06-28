// @ts-check

const express = require("express")

const app = express()

// eslint-disable-next-line
const { MongoClient } = require("mongodb")

app.set("view engine", "ejs")

// eslint-disable-next-line
var db // 어떤 데이터베이스에 저장을 할까?

MongoClient.connect(
  "mongodb+srv://minseong:qwer123@cluster0.21z5wjm.mongodb.net/?retryWrites=true&w=majority",
  // eslint-disable-next-line
  (error, client) => {
    if (error) return console.log("ERROR ERROR ERROR ERROR")
    // @ts-ignore
    db = client.db("todoapp") // todoapp이라는 database 연결

    // db.collection("post").insertOne({ name: "Minseong", age: 25 }, () => {
    //   console.log("complete!")
    // })

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
  db.collection("counter").findOne(
    { name: "number of posts" },
    (error, result) => {
      // eslint-disable-next-line no-var
      var numPosts = result.totalPost
      res.send("complete!")
      db.collection("post").insertOne(
        {
          _id: numPosts + 1,
          title: req.body.title,
          date: req.body.date,
        },
        () => {
          console.log("complete!")
        }
      )
    }
  )
})

// /list 로 GET요청으로 접속하면 실제 db에 저장된 데이터들로 예쁘게 꾸며진 html을 보여줌
app.get("/list", (req, res) => {
  db.collection("post")
    .find()
    .toArray((error, result) => {
      console.log(result)
      res.render("list.ejs", { posts: result })
    })
})
