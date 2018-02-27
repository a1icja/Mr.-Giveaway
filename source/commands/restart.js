const Command = require("../handlers/command.js");
const { exec } = require('child_process');
const fs = require("fs");
const { join } = require("path");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "restart",
        });
    }

    async execute(message) {
        if (!message.globalAdmin) return;

        const giveaways = this.client.giveawayCache;
        const cache = [];

        giveaways.forEach(g => {
            if (!g.msg.channel.messages.fetch(g.msg.id)) return;
            cache.push({
                "title": g.title,
                "match": g.match,
                "guild": g.msg.guild.id,
                "channel": g.msg.guild.id,
                "msg": g.msg.id,
                "remaining": g.remaining,
                "winnerCount": g.winnerCount
            });
        });

        await this.write(cache);

        exec("cd ~/stable && git pull", (error, stdout, stderr) => {
            if (error || stderr) return message.reply(`Failed!\n\n${error || stderr}`);

            exec("pm2 restart MG");
        });

    }

    async write(data) {
        fs.writeFile(join(__dirname, "..", "cache.json"), JSON.stringify(data), err => {
            if (err) throw err;
            return null;
        });
    }
};