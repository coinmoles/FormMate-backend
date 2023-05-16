import Router from "koa-router"
import { getUserById } from "./getUserById"
import { getUser } from "./getUser"
import { putUser } from "./putUser"
import { deleteUser } from "./deleteUser"
import { AllContext, CustomState } from "../../util/interface/KoaRelated"

const router = new Router<CustomState, AllContext>()

router.get("/:userid", getUserById)
router.get("/", getUser)
router.put("/", putUser)
router.delete("/", deleteUser)

export { router as userRouter }