import Router from "koa-router"
import { getForm } from "./getForm"
import { getFormById } from "./getFormById"
import { postForm } from "./postForm"
import { deleteForm } from "./deleteForm"

const router = new Router()

router.get("/:formid", getFormById)
router.get("/", getForm)
router.post("/:formid", postForm);
router.delete("/:formid", deleteForm);

export { router as formRouter }