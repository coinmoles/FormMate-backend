import dotenv from "dotenv"
dotenv.config()

import Koa from "koa"
import logger from "koa-logger"
import bodyParser from "koa-bodyparser"
// import cors from "@koa/cors"
import Router from "koa-router"
import { authRouter } from "./routes/auth";

const app = new Koa()
const router = new Router()
const PORT = 4000
app.use(logger())
app.use(bodyParser())
        
router.use("/auth", authRouter.routes())
router.use("/auth", authRouter.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`This app is now listening to port ${PORT}`)
})