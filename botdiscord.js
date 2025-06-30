const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const { discordbottoken, discordbotprefix } = require('./config.json');
const path = require('path');
const BotVer = require('./package.json');
const os = require("os");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Channel]
});

const customCommandsPath = path.join(__dirname, 'ccommandsdiscord.json');

let customCommands = {};
if (fs.existsSync(customCommandsPath)) {
	customCommands = JSON.parse(fs.readFileSync(customCommandsPath, 'utf8'));
}

function saveCommands() {
	fs.writeFileSync(customCommandsPath, JSON.stringify(customCommands, null, 2));
}

client.on('ready', () => {
	console.log(`${client.user.tag} Discord Bot - ONLINE! - Made by axol.oti on Discord`);
});

function processResponse(template, message) {
	let owner = message.guild.members.fetch(message.guild.ownerId);
	const replacements = {
		'{server_name}': message.guild.name,
		'{server_id}': message.guild.id,
		'{server_mc}': message.guild.memberCount.toString(),
		'{server_owner}': owner.id,
		'{server_bc}': message.guild.premiumSubscriptionCount || '0',
		'{channel_name}': message.channel.name,
		'{author_id}': message.author.id,
		'{author_name}': message.author.username,
		'{author_tag}': message.author.tag
	};
	let result = template;
	for (const [key, value] of Object.entries(replacements)) {
		result = result.replace(new RegExp(key, 'g'), value);
	}
	result = result.replace(/@everyone/g, '[everyone]');
	result = result.replace(/@here/g, '[here]');
	result = result.replace(/<@&\d+>/g, '[RoleMention]');
	return result;
}

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	const prefix = discordbotprefix;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/\s+/);
	const command = args.shift().toLowerCase();
	const guildId = message.guild.id;

	if (command === 'help') {
		const embed = new Discord.EmbedBuilder()
			.setTitle(`${client.user.tag}`)
			.setDescription(`${prefix}help\n${prefix}ping\n${prefix}botinfo\n${prefix}say\n${prefix}addcmd\n${prefix}delcmd\n${prefix}listcmds\n${prefix}resetccmds`)
		return message.channel.send({ embeds: [embed] });
	}
	if (command === 'ping') {
		return message.channel.send({content: `Websocket Latency: ${client.ws.ping}ms`})
	}
	if (command === 'botinfo') {
		const embed = new Discord.EmbedBuilder()
			.setTitle(`Information about ${client.user.tag}`)
			.setDescription(`Servers Im in: ${client.guilds.cache.size}\nBot Version: ${BotVer.version}\nNode.JS version: ${process.version}\nSource code: https://gitlab.com/bellemr/ccrevoltbot`)
		return message.channel.send({ embeds: [embed] });
	}
	if (command === 'say') {
		const words = message.content.split(" ");
		words.shift();
		const toSay = words.join(" ");
		if (!toSay) {
			return message.reply('What do you want me to say?');
		}
		return message.channel.send(toSay);
	}
	if (command === 'addcmd') {
		if (!message.member.permissions.has('ManageGuild')) {
			return message.reply('You are missing the following permission to use this command: ManageGuild');
		}
		const [commandName, ...cmdResponse] = args;
		if (!commandName || !cmdResponse.length) {
			return message.reply('Usage: `${prefix}addcmd <name> <response>`');
		}
		const guildId = message.guild.id;
		if (!customCommands[guildId]) {
			customCommands[guildId] = {};
		}
		const blockedwords = fs.readFileSync('blockedwords.txt', 'utf-8').split('\n').map(word => word.trim());
		const containsWord = args.some(arg => blockedwords.includes(arg.toLowerCase()));
		if (containsWord) {return message.reply('Please do not create commands that includes words or phrases related to illegal content, scamming, or racism');}

		customCommands[guildId][commandName] = cmdResponse.join(' ');
		saveCommands();
		return message.reply(`Custom command \`${commandName}\` added successfully!`);
	}
	if (command === 'delcmd') {
		if (!message.member.permissions.has('ManageGuild')) {
			return message.reply('You are missing the following permission to use this command: ManageGuild');
		}
		const name = args[0]?.toLowerCase();
		if (!name || !customCommands[guildId] || !customCommands[guildId][name]) {
			return message.reply('That command cound not be found');
		}
		delete customCommands[guildId][name];
		saveCommands();
		return message.reply(`🗑️ Command \`${name}\` deleted successfully!`);
	}
	if (command === 'listcmds') {
        const cmds = customCommands[guildId] ? Object.keys(customCommands[guildId]) : [];
		if (!cmds.length) return message.reply('There are no custom commands created for this server.');

		const embed = new Discord.EmbedBuilder()
			.setTitle(`Custom Commands in ${message.guild.name}`)
			.setDescription(cmds.map(cmd => `\`${prefix}${cmd}\``).join('\n'))
			.setColor('Blue')
			.setFooter({ text: `Total: ${cmds.length}` });
		return message.channel.send({ embeds: [embed] });
	}
	if (command === 'resetccmds') {
		if (!message.member.permissions.has('Administrator')) {
			return message.reply('You are missing the following permission to use this command: Administrator');
		}
		if (!customCommands[guildId] || Object.keys(customCommands[guildId]).length === 0) {
			return message.reply('❌ There are no custom commands to remove for this server.');
		}
		delete customCommands[guildId];
		saveCommands();

		return message.reply('All custom commands for this server has been removed.');
	}



	if (customCommands[guildId] && customCommands[guildId][command]) {
		const response = customCommands[guildId][command];
		if (response.startsWith('embed:')) {
			const embedresponse = customCommands[guildId][command].slice(6).trim();
			const embed = new Discord.EmbedBuilder()
				.setDescription(embedresponse)
			return message.channel.send({ embeds: [embed] });
		} else if (response.startsWith('reply:')){
			const replyresponse = processResponse(response.slice(6).trim(), message);
			message.reply(replyresponse);
		} else if (response.startsWith('nsfw:')){
			if (!message.channel.nsfw) return message.reply('This custom command requires the use of a NSFW marked channel')
			const replyresponse = processResponse(response.slice(6).trim(), message);
			return message.channel.send(replyresponse);
		} else if (response.startsWith('admin:')){
			if (!message.member.permissions.has('Administrator')) {
				return message.reply('You are missing the following permission to use this command: Administrator');
			}
			const replyresponse = processResponse(response.slice(6).trim(), message);
			return message.channel.send(replyresponse);
		} else {
			const standardresponse = processResponse(response, message);
			return message.channel.send(standardresponse);
		}
		return message.channel.send(customCommands[guildId][command]);
	}
});

client.login(discordbottoken);