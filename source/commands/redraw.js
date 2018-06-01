const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "redraw",
        });
    }

    async execute(message) {
        if (!message.guildAdmin && !message.globalAdmin) return message.channel.send('Invalid Permissions. `MANAGE_SERVER` permission or `MG Admin` role required.');

        const match = /(?:redraw)(?:\s+(?:<#)?(\d{17,20})(?:>)?)?(?:\s+(\d+))/i.exec(message.content);

        if (!match) return message.channel.send('Invalid Command Usage: `mg!redraw [channel-mention|channel-id] <giveaway-number>`');

        const channel = match[1] ? message.guild.channels.get(match[1]) || message.channel : message.channel;

        if (this.client.lastGiveawayCache.filter(giveaway => giveaway.channel.id === channel.id).size <= 0) return message.channel.send(`There has been no prior giveaway in ${channel.name}.`);

        const lastGiveaway = this.client.lastGiveawayCache.get(`${channel.id}-${match[2]}`);
        if(!lastGiveaway) return message.channel.send(`ERR: No giveaway occured in the specified channel with that ID.`);

        const winnerIds = lastGiveaway.winners.map(u => u.id);

        const users = (await lastGiveaway.msg.reactions.get("🎉").users.fetch()).array().filter(u => u.id !== lastGiveaway.msg.author.id && (lastGiveaway.winners.length && !winnerIds.includes(u.id)));

        if (!users.length) return message.channel.send("All users who entered were chosen.");

        const winner = lastGiveaway.draw(users);
        lastGiveaway.winners.push(winner);
        channel.send(`Congratulations, ${winner.toString()}! You won the redraw for the giveaway for **${lastGiveaway.title}**!`);
    }
};
