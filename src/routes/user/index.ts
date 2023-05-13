import Router from "koa-router"
import { getUserById } from "./getUserById"
import { getUser } from "./getUser"
import { putUser } from "./putUser"
import { deleteUser } from "./deleteUser"

const router = new Router()

router.get("/:userid", getUserById)
router.get("/", getUser)
router.put("/:userid", putUser)
router.delete("/:userid", deleteUser)

export { router as userRouter }