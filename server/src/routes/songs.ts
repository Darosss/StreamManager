import { Router } from "express";
import { checkSearchParams, withObjectId } from "@middlewares";
import { addNewSong, editSongById, getSongsList, deleteSongById } from "@controllers";

const songsRouter = Router();

songsRouter.get("/", checkSearchParams, getSongsList);
songsRouter.post("/create", addNewSong);
songsRouter.patch("/:id", withObjectId(editSongById));
songsRouter.delete("/delete/:id", withObjectId(deleteSongById));

export default songsRouter;
