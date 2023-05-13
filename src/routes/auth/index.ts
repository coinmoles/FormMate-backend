import Router from "koa-router"
import { getExists } from "./getExists"
import { register } from "./register"
import { refreshToken } from "./refreshToken"
import { login } from "./login"
import { logout } from "./logout"
import { CustomContext, CustomState } from "src/util/interface/KoaRelated"

const router = new Router<CustomState, CustomContext>()
router.get("/exists/:email", getExists)
router.post("/refresh", refreshToken)
router.post("/register", register)
router.post("/login", login)
router.delete("/logout", logout)

export { router as authRouter }