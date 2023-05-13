import Router from "koa-router"
import { getComment } from "./getComment"
import { postComment } from "./postComment"
import { putComment } from "./putComment"
import { deleteComment } from "./deleteComment"
import { CustomContext, CustomState } from "../../util/interface/KoaRelated"

const router = new Router<CustomState, CustomContext>()

router.get("/", getComment)
router.post("/", postComment)
router.put("/:commentid", putComment)
router.delete("/:commentid", deleteComment)

export { router as CommentRouter }