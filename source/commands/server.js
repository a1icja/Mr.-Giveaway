const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "server",
        });
    }

    execute(message) {
        message.reply('Check your DMs. :wink:');
        message.author.send('Mr. Giveaway Offical Server:\nhttps://discord.gg/typicalbot');
    }
};