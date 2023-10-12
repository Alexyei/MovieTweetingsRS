import redisStore from "../redis/redis_store";
import session from "express-session";
import {config} from "dotenv";
config()
const sessionMiddleware = session({
    store: redisStore,
    secret: process.env["SESSION_SECRET_WORD "] || "secret0179f",
    //не записывать пустую сессию в БД
    resave: false,
    saveUninitialized: false,
    //название печенья
    name: 'sessionId',
    cookie: {
        secure: false, // if true: only transmit cookie over https //set true in production when get ssl
        httpOnly: true, // if true: prevent client side read cookie from JS
        maxAge: 30 * 24 * 60 * 60 * 1000 // session max age in milliseconds
    }
})

export default sessionMiddleware