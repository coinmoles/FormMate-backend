import Router from "koa-router"
import { postFormItem } from "./postFormItem"
import { putFormItem } from "./putFormItem";
import { deleteFormItem } from "./deleteFormItem";
import { patchFormItem } from "./patchFormItem";

const router = new Router()

router.post("/", postFormItem);
router.put("/:formitemid", putFormItem);
router.patch("/", patchFormItem);
router.delete("/:formitemid", deleteFormItem);

export { router as formItemRouter }