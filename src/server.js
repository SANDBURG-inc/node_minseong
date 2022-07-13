/* eslint-disable no-underscore-dangle */
// @ts-check

const express = require("express")

const app = express()

const http = require("http").createServer(app)
const { Server } = require("socket.io")
const io = new Server(http)

// eslint-disable-next-line
const { MongoClient } = require("mongodb")
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const session = require("express-session")
const { default: SignaturePad } = require("signature_pad")

// @ts-ignore
const signaturePad = new SignaturePad(canvas, {
  minWidth: 5,
  maxWidth: 10,
  penColor: "rgb(66, 133, 244)",
})

// @ts-ignore
const signaturePad = new SignaturePad(canvas)

app.set("view engine", "ejs")
app.use(methodOverride("_method"))
app.use(
  session({ secret: "sexret-code", resave: true, saveUninitialized: false })
)

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

    // app.listen(8080, () => {
    //   console.log("listening on 8080")
    // })

    http.listen(8080, () => {
      console.log("listening on 8080")
    })
  }
)

app.get("/socket", (req, res) => {
  // @ts-ignore
  req.render("socket.ejs")
})

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
  res.render("list.ejs", { posts: res })
})

app.post("/add", (req, res) => {
  db.collection("counter").findOne({ name: "number of posts" }, (result) => {
    // eslint-disable-next-line no-var
    var numPosts = result.totalPost
    res.send("complete!")
    db.collection("counter").insertOne(
      {
        _id: numPosts + 1,
        title: req.body.title,
        date: req.body.date,
      },
      () => {
        db.collection("post").updateOne(
          { name: "number of posts" },
          { $inc: { totalPost: 1 } },
          (error) => {
            if (error) {
              return console.log(error)
            }
            return res.send("complete")
          }
        )
      }
    )
  })
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

app.delete("/delete", (req, res) => {
  // eslint-disable-next-line radix
  req.body._id = parseInt(req.body._id)
  db.collection("post").deleteOne(req.body, () => {
    console.log("delete complete!")
    // @ts-ignore
    req.statusCode(200).send({ message: "성공했당!" })
  })
  res.send("delete complete")
})

// eslint-disable-next-line no-unused-vars
app.get("/detail/:id", (req, res) => {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id, 10) },
    (error, result) => {
      console.log(result)
      // @ts-ignore
      req.render("detail.ejs", { data: result })
    }
  )
})

app.get("/edit/:id", (req, res) => {
  db.collection("post").findOne(
    // eslint-disable-next-line radix
    { _id: parseInt(req.params.id) },
    (error, result) => {
      console.log(result)
      // @ts-ignore
      req.render("edit.ejs", { post: req })
    }
  )
  res.render("edit.ejs", { posts: res })
})

// TODO
// app.put('/edit', (req, res) => {
//   db.collection('post').updateOne({_id: }, {$set: {title: }}, (error, result) => {
//   })
// })

app.get("/login", (req, res) => {
  res.render("login.ejs")
})

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  (req, res) => {
    // @ts-ignore
    req.redirect("/")
  }
)

app.get("/mypage", isLogin, (req, res) => {
  console.log(req.user)
  res.render("mypage.ejs", { 사용자: req.user })
})

function isLogin(req, res, next) {
  if (req.user) {
    next()
  } else {
    req.send("로그인안했어요..")
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    (inputId, inputPw, done) => {
      db.collection("login").findOne({ id: inputId }, (error, result) => {
        if (error) return done(error)
        if (!result) return done(null, false, { message: "존재하지 않음." })
        if (inputPw == result.pw) {
          return done(null, result)
        } else {
          return done(null, false, { message: "비밀번호를 확인해주세요." })
        }
      })
    }
  )
)

passport.serializeUser(function (user, done) {
  // @ts-ignore
  done(null, user.id)
})

passport.deserializeUser(function (ID, done) {
  db.collection("login").findOne({ id: ID }, (error, result) => {
    done(null, result)
  })
})

app.get("/search", (req, res) => {
  console.log(req.query.value)
  db.collection("post")
    .find({ $text: { $search: req.query.value } })
    .toArray((error, result) => {
      console.log(result)
      res.render("search.ejs", { posts: result })
    })
})

// /abc/ <- 정규식 쓰는 법

// app.get("/shop/shirts", (req, res) => {
//   res.send("셔츠 판매 페이지입니다.")
// })

// app.get("/shop/pants", (req, res) => {
//   res.send("바지 파는 페이지입니다.")
// })

// @ts-ignore
app.use("/shop", require("./routes/shop.js"))

io.on("connection", function (socket) {
  console.log("연결되었어요")

  socket.on("user-send", function (data) {
    console.log(data)
  })
})
