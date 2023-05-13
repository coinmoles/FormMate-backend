import Router from "koa-router"
import { postFormItem } from "./postFormItem"
import { putFormItem } from "./putFormItem";
import { deleteFormItem } from "./deleteFormItem";
import { patchFormItem } from "./patchFormItem";
import { CustomContext, CustomState } from "../../util/interface/KoaRelated";
import { copyFormItem } from "./copyFormItem";
import { searchFormItem } from "./searchFormItem";

const router = new Router<CustomState, CustomContext>()

router.post("/", postFormItem);
router.post("/copy", copyFormItem)
router.post("/search", searchFormItem)
router.put("/:formitemid", putFormItem);
router.patch("/", patchFormItem);
router.delete("/:formitemid", deleteFormItem);

export { router as formItemRouter }