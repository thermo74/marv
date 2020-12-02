const getCommandByName = require("../api/getCommandByName");
const pushActions = require("../pushActions");
const { _ } = require("../../i18next");
const ms = require("ms");

const cooldowns = {};

function parseUsage(usage) {
  return (usage || "")
    .replace(/[ ,]+/g, " ")
    .trim()
    .split(" ")
    .filter((arg) => arg.length);
}

module.exports = async function onCommand({ channel, command, nick, message }) {
  const commandEntry = await getCommandByName(command.name);
  const now = Date.now();

  if (!commandEntry) {
    throw new Error(
      `${_("twitch.command-not-found", { command: command.name })}`
    );
  }

  if (!commandEntry.enabled) {
    throw new Error(
      `${_("twitch.command-disabled", { command: command.name })}`
    );
  }

  const lastCall = cooldowns[command.name] || 0;
  const cooldown = commandEntry.cooldown * 1000;
  const elapsedTime = now - lastCall;

  if (elapsedTime < cooldown) {
    const rest = ms(cooldown - elapsedTime);
    this.say(
      channel,
      _("twitch.command-cooldown", { command: command.name, rest })
    );
    return;
  }

  const args = {};
  const argNames = parseUsage(commandEntry.usage);
  const argList = argNames.map((arg) => `[${arg}]`).join(" ");
  const usage = `${command.prefix}${command.name} ${argList}`;

  if (command.args.length > argNames.length) {
    throw new Error(`${_("twitch.command-too-much-argument", { usage })}`);
  } else if (command.args.length < argNames.length) {
    throw new Error(`${_("twitch.command-not-enough-argument", { usage })}`);
  }

  argNames.forEach((arg, i) => {
    args[arg] = command.args[i] || `$${arg}`;
  });

  cooldowns[command.name] = now;
  pushActions("onCommand", { user: nick, message, command, ...args });
};
