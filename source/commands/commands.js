const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "commands",
            aliases: ["cmds"]
        });
    }

    execute(message) {
        message.reply('Check your DMs. :wink:');
        message.author.send("```md\nCommands for Mr. Giveaway\n---------------------------\n"
        +"> mg!create\n" + "Create a giveaway\n"
        +"> mg!delete\n" + "Delete the previous giveaway\n"
        +"> mg!draw\n" + "Force a draw\n"
        +"> mg!redraw\n" + "Redraw a winner\n" 
        +"> mg!invite\n" + "Get an invite link for the bot\n"
        +"> mg!server\n" + "Join the official Discord server\n"
        +"> mg!ping\n" + "Check to see if the bot responds```");
    }
};