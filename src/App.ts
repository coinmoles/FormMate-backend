import dotenv from "dotenv"
dotenv.config()

import Koa from "koa"
import bodyParser from "koa-bodyparser"
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
app.use(loginChecker)

router.use("/auth", authRouter.routes())
router.use("/auth", authRouter.allowedMethods())
router.use("/user", userRouter.routes())
router.use("/user", userRouter.allowedMethods())
router.use("/form", formRouter.routes())
router.use("/form", formRouter.allowedMethods())
router.use("/formItem", formItemRouter.routes())
router.use("/formItem", formItemRouter.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`This app is now listening to port ${PORT}`)
})