import { Router } from "express";
import { getConfigsList, editConfigs, resetConfigsToDefaults } from "@controllers";
import { validateSchema } from "@middlewares";
import { ConfigUpdateDataSchema } from "@models";

const configsRouter = Router();

configsRouter.get("/", getConfigsList);
configsRouter.patch("/edit", validateSchema(ConfigUpdateDataSchema), editConfigs);
configsRouter.post("/defaults", resetConfigsToDefaults);

export default configsRouter;
