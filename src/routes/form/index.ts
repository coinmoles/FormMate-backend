import Router from "koa-router"
import { CustomContext, CustomState } from "../../util/interface/KoaRelated"
import { deleteForm } from "./deleteForm"
import { getForm } from "./getForm"
import { getFormById } from "./getFormById"
import { postForm } from "./postForm"
import { putForm } from "./putForm"
import { searchForm } from "./searchForm"

const router = new Router<CustomState, CustomContext>()

router.get("/:formid", getFormById)
router.get("/", getForm)
router.post("/", postForm)
router.post("/search", searchForm)
router.put("/:formid", putForm)
router.delete("/:formid", deleteForm)

export { router as formRouter }
