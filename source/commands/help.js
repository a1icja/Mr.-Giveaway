const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "help",
        });
    }

    execute(message) {
        //message.author.send("```mg!create <time-in-seconds> <giveaway-title>\nmg!delete <giveaway-id>```");
        message.channel.send("**Hi there!** I am known as Mr. Giveaway. While my origins are mostly unknown, people are known to associate me with Packer#9020. Ha. What fools. Tell me, are you looking for a automated giveaway? Well, are you? I have the perfect thing for you. Try `mg!invite` to get me into your server, then go through and start your own giveaway using the commands in `mg!commands`. I will be seeing you soon...");
    }
};