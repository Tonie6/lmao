const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
var json = require('./package.json');
const axios = require('axios')

client.on("ready", async() => {
    let startdate = new Date();
    let starttime = startdate.getHours() + ":" + startdate.getMinutes() + ":" + startdate.getSeconds();
    let enabled;
    if (config.options.consolelogs === true) enabled = `Yes`;
    else if (config.options.consolelogs === false) enabled = `No`;
    else enabled = `Can't Detect`;
})

client.once('ready', () => {
    client.user.setActivity({ type: "WATCHING", name: `Your Status! .gg/kronos` })
});


client.on('message', message => {
    if (message.content === "$help") {
        const embed = new discord.MessageEmbed()
            .setAuthor(`${message.author.username} in ${message.channel.name}`, `${message.author.displayAvatarURL({dynamic: true })}`, 'https://kronosx.dev')
            .setColor('#000000')
            .addFields({ name: 'discord.gg', value: 'Please Add discord.gg/kronos To Receive a Role With Perks' }, )
            .setTimestamp()
            .setFooter('©kronos.dev');

        message.channel.send(embed);
    }
})

client.on('presenceUpdate', async(oldm, newm) => {
    try {
        let date = new Date()
        let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        if (oldm.member.user.bot || newm.member.user.bot) return;
        let olds = oldm.activities[0].state;
        let news = newm.activities[0].state;
        if (olds === news) return;
        if (news.includes(config.status.vanity) && !newm.member.roles.cache.has(config.status.roletogiveid)) {
            newm.member.roles.add(config.status.roletogiveid).then(async d => {
                const kronos = new discord.MessageEmbed()
                    .setColor('#000000')
                    .setAuthor(`${newm.user.tag}`, `${newm.user.displayAvatarURL({dynamic: true})}`)
                    .setDescription(`<@${newm.user.id}> Has Added Vantity ${config.status.vanity} into their status!`)
                    .setTimestamp()
                    .setFooter('©kronos.dev');
                if (config.options.consolelogs === true) client.channels.cache.get(config.status.channelid).send(kronos);
                console.log(`${newm.user.tag} Has Added Vantity:${config.status.vanity} Into Their Status!`)
            }).catch(() => {})
        } else if (!news.includes(config.status.vanity) && newm.member.roles.cache.has(config.status.roletogiveid)) {
            newm.member.roles.remove(config.status.roletogiveid).catch(() => {})
            const kronosremoved = new discord.MessageEmbed()
                .setColor('#000000')
                .setAuthor(`${newm.user.tag}`, `${newm.user.displayAvatarURL({dynamic: true})}`)
                .setDescription(`<@${newm.user.id}> Has Taken Out Vantity ${config.status.vanity} Of Their Status!`)
                .setTimestamp()
                .setFooter('©kronos.dev');
            if (config.options.consolelogs === true) client.channels.cache.get(config.status.channelid).send(kronosremoved);
            console.log(`${newm.user.tag} Has Taken Out Vantity:${config.status.vanity} Of Their Status!`)
        }
    } catch (e) {}
})

client.on("ready", async() => {
    const nodelogger = require('hyperz-nodelogger')
    const logger = new nodelogger()
    logger.hypelogger(`Kronos`, '500', 'blue', `https://kronosx.dev!\n\nVerison: 1.0.0\n\n${client.user.tag} has came online\n\nConsole Logging Below:`, 'disabled', 'blue', 'single', false)
})

client.login(config.bot.token)