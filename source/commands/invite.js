const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "invite",
        });
    }

    execute(message) {
        message.reply('Check your DMs. :wink:');
        message.author.send(`You can invite me here: <https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=388160>`);
    }
};