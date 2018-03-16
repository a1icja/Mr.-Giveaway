const klaw = require('klaw');
const path = require('path');
require("./handlers/extenders.js");
const { Client, Collection, RichEmbed } = require('discord.js');
const moment = require("moment");
const cache = require("./cache.json");
const fs = require("fs");
const { join } = require("path");

const Giveaway = require("./handlers/giveaway.js");

const commandsPath = path.join(__dirname, "commands");

new class extends Client {
    constructor() {
        super();

        this.config = require('../config.json');

        this.commands = new Collection();

        this.init();

        this.giveawayCache = new Collection();
        this.lastGiveawayCache = new Collection();

        this.on('ready', () => {
            console.log(`Client connected with ${this.guilds.size} guilds, ${this.channels.size} channels, and ${this.users.size} users.`);

            this.user.setActivity(`${this.config.prefix}help | ${this.guilds.size} Guilds`);
            setInterval(() => this.user.setActivity(`${this.config.prefix}help | ${this.guilds.size} Guilds`), 1000 * 60 * 2);

            if (cache.length) cache.forEach(g => new Giveaway(this, null, g.match, g));
            this.clearCache();
        });

        this.on('message', async message => {
            if (message.author.bot || !message.member) return;
            if (!message.content.startsWith(this.config.prefix)) return;

            message.globalAdmin = !!this.config.owners.includes(message.author.id);

            const content = message.content.slice(this.config.prefix.length);

            const command = await this.fetchCommand(content.split(' ')[0]);
            if (!command) return;

            message.guildAdmin = message.member.hasPermission("MANAGE_GUILD") || message.member.roles.map(r => r.name).includes("MG Admin");

            command.execute(message);
        });

        this.login(this.config.token);
    }

    async clearCache() {
        fs.writeFile(join(__dirname, "cache.json"), "[]", err => {
            if (err) throw err;
            return null;
        });
    }

    fetchCommand(text) {
        return new Promise((resolve, reject) => {
            if (this.commands.has(text)) return resolve(this.commands.get(text));
            this.commands.forEach(c => { if (c.aliases && c.aliases.includes(text)) return resolve(c); });
            return resolve();
        });
    }

    init() {
        klaw(commandsPath).on("data", item => {
            const file = path.parse(item.path);
            if (!file.ext || file.ext !== ".js") return;

            const command = new (require(`${file.dir}/${file.base}`))(this, item.path);
            this.commands.set(command.name, command);
        });
    }

    _reload(filePath) {
        return new Promise((resolve, reject) => {
            delete require.cache[filePath];
            const command = new (require(filePath))(this, filePath);
            this.commands.set(command.name, command);
            return resolve();
        });
    }

    reload(entry, message) {
        return new Promise((resolve, reject) => {
            const args = /(\w+)(?::(\w+))?/i.exec(entry);
            if (!args && entry !== "all") return reject("Invalid Syntax");

            const mod = args ? args[1] : null;
            const all = entry === "all";

            if (all || mod === "events") {

            } else if (mod === "commands") {
                const command = args[2];

                if (command) {
                    if (!this.commands.has(command)) return reject();

                    this._reload(this.commands.get(command).path).then(() => {
                        return resolve("Good!");
                    });
                } else {
                    this.commands.forEach(c => {
                        this._reload(c.path);
                    });

                    return resolve("Good!");
                }
            }
        });

        /*
        const match = /command(?::)?(.+)?/i.exec(entry);
        if (!match) return;
        if (match[1] === "all") {
            this.commands.clear();
            this.init();
            return;
        }
        if (this.commands.has(match[1])) {
            this.commands.delete(match[1]);

            const command = new (require(`${__dirname}/commands/${match[1]}.js`))(this);
            this.commands.set(command.name, command);

            message.channel.buildEmbed()
                .setTitle('Command Successfully Reloaded')
                .setDescription(`Command: \`${match[1]}\``)
                .setTimestamp()
                .send();
        } else {
            message.channel.buildEmbed()
                .setTitle('Command Failed to Reload')
                .setDescription(`Command: \`${match[1]}\``)
                .setTimestamp()
                .send();
        }*/
    }
};

process
    .on("uncaughtException", err => console.error(err.stack))
    .on("unhandledRejection", err => console.error(err.stack));
