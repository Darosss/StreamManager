import { Router } from "express";
import { getChatCommandsList, addNewCommand, editChatCommandById, deleteCommandById } from "@controllers";
import { checkSearchParams, isParamObjectId, validateSchema } from "@middlewares";
import { ChatCommandCreateSchema, ChatCommandUpdateSchema } from "@models";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommandsList);
chatCommandsRouter.post("/create", validateSchema(ChatCommandCreateSchema), addNewCommand);
chatCommandsRouter.patch("/:id", isParamObjectId, validateSchema(ChatCommandUpdateSchema), editChatCommandById);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteCommandById);

export default chatCommandsRouter;
