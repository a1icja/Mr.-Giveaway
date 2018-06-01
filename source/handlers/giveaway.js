class Giveaway {
    constructor(client, message, match, data) {
        const [full, channel, winnerCount, timeInSeconds, days, hours, minutes, seconds, title] = match;

        this.client = client;

        this.message = message;

        this.channel = data ? this.client.guilds.get(data.guild).channels.get(data.channel) : message.guild.channels.get(channel) || message.channel;

        this.winnerCount = winnerCount || 1;

        this.length = timeInSeconds ? timeInSeconds : (60 * 60 * 24 * (days ? Number(days) : 0)) + (60 * 60 * (hours ? Number(hours) : 0)) + (60 * (minutes ? Number(minutes) : 0)) + (seconds ? Number(seconds) : 0);

        this.remaining = data ? data.remaining : this.length;

        this.endTime = Date.now() + this.length * 1000;

        this.title = title;

        this.winners = [];

        this.msg;

        this.interval;

        this.suffix = this.client.giveawayCache.filter(giveaway => giveaway.channel.id === this.channel.id).size+1;

        this.match = match;

        this.valid = true;

        if (data) { this.continue(data); } else { this.init(); }
    }

    async init() {
        this.msg = await this.channel.buildEmbed()
            .setColor(0xcc8822)
            .setTitle(this.title)
            .setDescription(`Possible Winners: ${this.winnerCount}\nReact with :tada: to enter!`)
            .setFooter(`${this.suffix} | Ends at`)
            .setTimestamp(new Date(this.endTime))
            .send();

        this.msg.react("🎉");

        this.interval = setInterval(() => this.intervalFunction(), 1000);

        this.client.giveawayCache.set(`${this.msg.channel.id}-${this.suffix}`, this);
    }

    async continue(data) {
        this.msg = await this.client.channels.get(data.channel).messages.fetch(data.msg).catch(() => {
            clearInterval(this.interval);
            this.client.lastGiveawayCache.set(`${this.msg.channel.id}-${this.suffix}`, this);
            this.client.giveawayCache.delete(`${this.msg.channel.id}-${this.suffix}`);
        });
        this.winnerCount = await data.winnerCount;
        this.title = await data.title;
        this.interval = setInterval(() => this.intervalFunction(), 1000);

        this.client.giveawayCache.set(`${this.msg.channel.id}-${this.suffix}`);
    }

    async intervalFunction() {
        this.remaining--;

        this.channel.messages.fetch(this.msg.id).catch(() => {
            clearInterval(this.interval);
            this.client.lastGiveawayCache.set(`${this.msg.channel.id}-${this.suffix}`, this);
            this.client.giveawayCache.delete(`${this.msg.channel.id}-${this.suffix}`);
        });

        if(Date.now() >= this.endTime){
            clearInterval(this.interval);
            this.client.lastGiveawayCache.set(`${this.msg.channel.id}-${this.suffix}`, this);
            this.client.giveawayCache.delete(`${this.msg.channel.id}-${this.suffix}`);

            const embed = this.msg.embeds[0];
            embed.color = 0x171c23;

            //const users = await this.msg.reactions.get("%F0%9F%8E%89").users.fetch();
            const users = await this.msg.reactions.get("🎉").users.fetch();
            const list = users.array().filter(u => u.id !== this.msg.author.id);

            if (!list.length) {
                embed.description = `Winner: No one.`;
                embed.footer.text = `Giveaway Finished`;

                return this.msg.edit({ embed });
            }

            for (let i = 0; i < this.winnerCount; i++) {
                const x = this.draw(list);

                if (!this.winners.includes(x)) this.winners.push(x);
            }

            embed.description = `Winner: ${this.winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
            embed.footer.text = `${this.suffix} | Giveaway Finished`;

            this.msg.edit({ embed });

            if (this.winners.length) this.msg.channel.send(`Congratulations, ${this.winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${this.title}**!`);
        }

        /*if (this.remaining >= 5 && this.remaining % 5 === 0) {
            const embed = this.msg.embeds[0];
            embed.footer.text = `Time Remaining: ${time}`;
            this.msg.edit({ embed });
        } else if (this.remaining < 5 && this.remaining > 0) {
            const embed = this.msg.embeds[0];
            embed.footer.text = `Time Remaining: ${time}`;
            this.msg.edit({ embed });
        } else if (this.remaining === 0) {
            clearInterval(this.interval);
            this.client.lastGiveawayCache.set(this.msg.channel.id, this);
            this.client.giveawayCache.delete(this.msg.channel.id);

            const embed = this.msg.embeds[0];
            embed.color = 0x171c23;

            //const users = await this.msg.reactions.get("%F0%9F%8E%89").users.fetch();
            const users = await this.msg.reactions.get("🎉").fetchUsers();
            const list = users.filterArray(u => u.id !== this.msg.author.id);

            if (!list.length) {
                embed.description = `Winner: No one.`;
                embed.footer.text = `Giveaway Finished`;

                return this.msg.edit({ embed });
            }

            for (let i = 0; i < this.winnerCount; i++) {
                const x = this.draw(list);

                if (!this.winners.includes(x)) this.winners.push(x);
            }

            embed.description = `Winner: ${this.winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(", ")}`;
            embed.footer.text = `Giveaway Finished`;

            this.msg.edit({ embed });

            if (this.winners.length) this.msg.channel.send(`Congratulations, ${this.winners.map(u => u.toString()).join(", ")}! You won the giveaway for **${this.title}**!`);
        }*/
    }

    shuffle(arr) {
        for (let i = arr.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }
        return arr;
    }

    draw(list) {
        const shuffled = this.shuffle(list);
        return shuffled[Math.floor(Math.random() * shuffled.length)];
    }
}

module.exports = Giveaway;
