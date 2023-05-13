import dotenv from "dotenv"
dotenv.config()

import Koa, { Next } from "koa"
import bodyParser from "koa-bodyparser"
import cors from "@koa/cors"
import logger from "koa-logger"
import Router from "koa-router"
import { authRouter } from "./routes/auth"
import { CustomContext, CustomState } from "./util/interface/KoaRelated"
import { loginChecker } from "./util/helper/logInChecker"
import { userRouter } from "./routes/user"
import { formRouter } from "./routes/form"
import { formItemRouter } from "./routes/formitem"

const app = new Koa<CustomState, CustomContext>()
const router = new Router<CustomState, CustomContext>()
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
router.get("/", async (ctx: CustomContext, next: Next) => {
    ctx.response.status = 200
    ctx.response.body = { abcd: "efgh" },
    next()
})
router.use("/formItem", formItemRouter.routes())
router.use("/formItem", formItemRouter.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`This app is now listening to port ${PORT}`)
})