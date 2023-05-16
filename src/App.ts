import dotenv from "dotenv"

import Koa, { Next } from "koa"
import bodyParser from "koa-bodyparser"
import cors from "@koa/cors"
import logger from "koa-logger"
import Router from "koa-router"
import { authRouter } from "./routes/auth"
import { AllContext, CustomState } from "./util/interface/KoaRelated"
import { userRouter } from "./routes/user"
import { formRouter } from "./routes/form"
import { formItemRouter } from "./routes/formitem"
import { mongooseStart } from "./db/mongoose/mongooseStart"
import { loginChecker } from "./middlewares/logInChecker"

const app = new Koa<CustomState, AllContext>()
const router = new Router<CustomState, AllContext>()
const PORT = 4000
app.use(logger())
app.use(bodyParser())
app.use(cors())
app.use(loginChecker)

router.use("/auth", authRouter.routes())
router.use("/auth", authRouter.allowedMethods())
router.use("/user", userRouter.routes())
router.use("/user", userRouter.allowedMethods())
router.use("/form", formRouter.routes())
router.use("/form", formRouter.allowedMethods())
router.get("/", async (ctx: AllContext, next: Next) => {
    ctx.response.status = 200
    ctx.response.body = { abcd: "efgh" },
    next()
})
router.use("/formItem", formItemRouter.routes())
router.use("/formItem", formItemRouter.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

const start = async () => {
    await dotenv.config()
    await mongooseStart()
    app.listen(PORT, () => {
        console.log(`This app is now listening to port ${PORT}`)
    })
}


start()