import Router from "koa-router"
import { getUserById } from "./getUserById"
import { getUser } from "./getUser"
import { putUser } from "./putUser"
import { deleteUser } from "./deleteUser"
import { CustomContext, CustomState } from "src/util/interface/KoaRelated"

const router = new Router<CustomState, CustomContext>()

router.get("/:userid", getUserById)
router.get("/", getUser)
router.put("/:userid", putUser)
router.delete("/:userid", deleteUser)

export { router as userRouter }