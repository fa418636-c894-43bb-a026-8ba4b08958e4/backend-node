require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const router = require("./routes");
const mongoose = require("mongoose");
const MongoStore = require("mongoose");
const PORT = 3000;

// authentication
require("./utils/auth");
const passport = require("koa-passport");

app = new Koa();

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://mongodb:mongodb@cluster0-yhow8.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).then((res) => {
    console.log('Connection is successful');
}).catch((e) => {
    throw new Error(e);
});

// sessions
const session = require("koa-session");
app.keys = [process.env.SESSION_SECRET];

app
  .use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
    // using store session on MongoDB using express-session + connect
    store: new MongoStore({
    url: config.urlMongo,
    collection: 'sessions'
  })
  }, app))
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
