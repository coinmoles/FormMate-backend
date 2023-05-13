import Router from "koa-router"
import { getForm } from "./getForm"
import { getFormById } from "./getFormById"
import { postForm } from "./postForm"
import { deleteForm } from "./deleteForm"
import { CustomContext, CustomState } from "src/util/interface/KoaRelated"

const router = new Router<CustomState, CustomContext>()

router.get("/:formid", getFormById)
router.get("/", getForm)
router.post("/:formid", postForm);
router.delete("/:formid", deleteForm);

export { router as formRouter }