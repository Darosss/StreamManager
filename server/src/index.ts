import "module-alias/register";
import "./discord";
import { initMongoDataBase, backendPort } from "@configs";
import expressApp from "./app";
import { logger } from "@utils";
import init from "./stream/initializeHandlers";
import { getAuthToken } from "@services";
import { initialize as initializeDiscord } from "./discord";

const startServer = async () => {
  await initMongoDataBase();
  await initializeDiscord();
  const server = expressApp();

  try {
    //TODO: note, this will be refactored later, now when its for LAN it'll work i guess ;o
    const foundTokenDB = await getAuthToken();
    if (foundTokenDB) await init(foundTokenDB);
  } catch (err) {
    console.log("Error occured while trying to init handlers", err);
  }
  server.listen(backendPort, async () => {
    console.log("listening on *:", backendPort);
  });
};

startServer().catch((error) => {
  console.error(error);
});

process.on("unhandledRejection", async (error) => {
  console.log("=== UNHANDLED REJECTION ===");
  logger.error(`UNHANDLED-ERROR - ${error}`);
});
