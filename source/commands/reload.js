const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "reload",
        });
    }

    execute(message) {
        if (message.globalAdmin) {
            const match = /reload (.+)/i.exec(message.content);
            if (!match) return message.channel.send(`INVALID SYNTAX: \`${this.client.config.prefix}reload commmands:<command-name>\``);

            this.client.reload(match[1]).then(() => {
                message.channel.buildEmbed()
                    .setTitle('Command Successfully Reloaded')
                    .setColor(0x00FF00)
                    .setTimestamp()
                    .send();
            }).catch(err => {
                message.channel.buildEmbed()
                    .setTitle('Command Failed to Reload')
                    .setColor(0xFF0000)
                    .setTimestamp()
                    .send();
            });
        } else { return; }
    }
};
