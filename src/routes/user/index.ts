import Router from "koa-router"
import { getUserById } from "./getUserById"
import { getUser } from "./getUser"
import { putUser } from "./putUser"
import { deleteUser } from "./deleteUser"
import { CustomContext, CustomState } from "../../util/interface/KoaRelated"

const router = new Router<CustomState, CustomContext>()

router.get("/:userid", getUserById)
router.get("/", getUser)
router.put("/", putUser)
router.delete("/", deleteUser)

export { router as userRouter }