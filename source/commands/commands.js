const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "commands",
            aliases: ["cmds"]
        });
    }

    execute(message) {
        const prefix = this.client.config.prefix;
        message.reply('Check your DMs. :wink:');
        message.author.send(`\`\`\`md\nCommands for ${this.client.user.username}\n---------------------------\n`
        +`> ${prefix}create\n" + "Create a giveaway\n`
        +`> ${prefix}delete\n" + "Delete the previous giveaway\n`
        +`> ${prefix}draw\n" + "Force a draw\n`
        +`> ${prefix}redraw\n" + "Redraw a winner\n` 
        +`> ${prefix}invite\n" + "Get an invite link for the bot\n`
        +`> ${prefix}server\n" + "Join the official Discord server\n`
        +`> ${prefix}ping\n" + "Check to see if the bot responds\`\`\``);
    }
};