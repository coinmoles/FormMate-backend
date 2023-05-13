import Router from "koa-router"
import { getComment } from "./getComment"
import { postComment } from "./postComment"
import { putComment } from "./putComment"
import { deleteComment } from "./deleteComment"

const router = new Router()

router.get("/", getComment)
router.post("/", postComment)
router.put("/:commentid", putComment)
router.delete("/:commentid", deleteComment)

export { router as CommentRouter }