import { Client, GatewayIntentBits, Collection } from "discord.js";
import { discordClientToken } from "@configs";
import { registerUpdateSlashCommands } from "./deployCommands";
import { commands } from "./commands";
import { events } from "./events";
import { logger } from "@utils";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

for (const key of Object.keys(commands)) {
  const command = commands[key];
  client.commands.set(command.data.name, command);
}

for (const key of Object.keys(events)) {
  const event = events[key];
  event.once
    ? client.once(event.name, (...args) => event.execute(...args))
    : client.on(event.name, (...args) => event.execute(...args));
}

export const initialize = async () => {
  if (!discordClientToken) {
    return logger.info("Discord client token is not provided. Discord client will not be initialized");
  }

  await registerUpdateSlashCommands();
  await client.login();
};
