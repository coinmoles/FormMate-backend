import Router from "koa-router"
import { postFormItem } from "./postFormItem"
import { putFormItem } from "./putFormItem";
import { deleteFormItem } from "./deleteFormItem";
import { patchFormItem } from "./patchFormItem";
import { CustomContext, CustomState } from "src/util/interface/KoaRelated";
import { copyFormItem } from "./copyFormItem";

const router = new Router<CustomState, CustomContext>()

router.post("/", postFormItem);
router.post("/copy", copyFormItem)
router.put("/:formitemid", putFormItem);
router.patch("/", patchFormItem);
router.delete("/:formitemid", deleteFormItem);

export { router as formItemRouter }