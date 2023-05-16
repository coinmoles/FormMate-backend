import Router from "koa-router"
import { loginErrorHandler } from "../../middlewares/loginErrorHandler"
import { AllContext, CustomState } from "../../util/interface/KoaRelated"
import { getExists } from "./getExists"
import { login } from "./login"
import { logout } from "./logout"
import { register } from "./register"

const router = new Router<CustomState, AllContext>()
router.get("/exists/:email", getExists)
router.post("/register", register)
router.post("/login", login)
router.delete("/logout", loginErrorHandler)
router.delete("/logout", logout)

export { router as authRouter }
