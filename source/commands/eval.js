const Command = require('../handlers/command.js');
const MessageEmbed = require('discord.js').MessageEmbed;
const util = require('util');

function embed(input, output, error = false) {
    return new MessageEmbed().setColor(error ? 0xFF0000 : 0x00FF00).addField("Input", input).addField(error ? "Error" : "Output", `\`\`\`${error ? "" : "js"}\n${output}\n\`\`\``).setFooter("Mr. Giveaway Eval");
}
module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "eval",
        });
    }

    execute(message) {
        if (!message.globalAdmin) return;
        const code = message.content.slice(message.content.search(' ') + 1);
        if (!code.length) return message.channel.send('No code input.');

        if (code.match(/token/gi)) return message.channel.send("The input requests the user token.");

        try {
            const after = eval(code);

            if (after instanceof Promise) {
                after.then(a => {
                    message.channel.send("", { embed: embed(code, a instanceof Object ? util.inspect(a, { depth: 0 }) : a) });
                }).catch(err => {
                    message.channel.send("", { embed: embed(code, err, true) });
                });
            } else {
                message.channel.send("", { embed: embed(code, after instanceof Object ? util.inspect(after, { depth: 0 }) : after) });
            }
        } catch(err) {
            message.channel.send("", { embed: embed(code, err, true) });
        }
    }
};
