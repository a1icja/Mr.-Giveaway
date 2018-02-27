const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "ping",
        });
    }

    execute(message) {
        message.channel.send(`Pinging...`).then(msg => {
            msg.edit(`Pong! | Client Ping: ${msg.createdTimestamp - message.createdTimestamp}ms | API Latency: ${Math.floor(this.client.pings[0])}`);
        });
    }
};