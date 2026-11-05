import { Router } from "express";
import { getChatCommandsList, addNewCommand, editChatCommandById, deleteCommandById } from "@controllers";
import { checkSearchParams, validateSchema, withObjectId } from "@middlewares";
import { ChatCommandCreateSchema, ChatCommandUpdateSchema } from "@models";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommandsList);
chatCommandsRouter.post("/create", validateSchema(ChatCommandCreateSchema), addNewCommand);
chatCommandsRouter.patch("/:id", validateSchema(ChatCommandUpdateSchema), withObjectId(editChatCommandById));
chatCommandsRouter.delete("/delete/:id", withObjectId(deleteCommandById));

export default chatCommandsRouter;
