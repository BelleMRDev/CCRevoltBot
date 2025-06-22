const { Client } = require("revolt.js");
const fs = require('fs');
const { revoltbottoken, revoltbotprefix } = require('./config.json');
const { MessageEmbed } = require('revolt.js');
const BotVer = require('./package.json');
const os = require("os");

let client = new Client();
const token = revoltbottoken;
const prefix = revoltbotprefix;

client.on("ready", async () => {
	console.info(`${client.user.username} Revolt Bot - ONLINE! - Made by AXOL#6594 on Revolt.chat`);
});

let commands = JSON.parse(fs.readFileSync('ccommands.json', 'utf8'));





client.on("message", async (message) => {
	if (message.author?. bot) return;
	if (message.content === prefix + "help") {
		message.channel.sendMessage(`Commands for ${client.user.username}\n\n${prefix}help\n${prefix}ping\n${prefix}botinfo\n${prefix}say\n${prefix}serverinfo\n${prefix}addcmd\n${prefix}deletecmd\n${prefix}listcmds\n${prefix}resetccmds\n${prefix}status`);
	}
});

client.on("message", async (message) => {
	if (message.content === prefix + "ping") {
		let now = Date.now();
		message.channel.sendMessage(`Checking ping....`).then((msg) => {
			msg.edit({ content: `Bot Latency: ${Date.now() - now}ms\nAPI Latency: ${Math.round(client.websocket.ping)}ms`})
		});
	}
});

client.on("message", async (message) => {
	if (message.author?. bot) return;
	if (message.content === prefix + "botinfo") {
		function uptime() {
			const uptime = process.uptime();
			const hours = Math.floor(uptime / 3600);
			const minutes = Math.floor((uptime % 3600) / 60);
			const seconds = Math.floor(uptime % 60);
			return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		}
		const embed = { title: `Information about ${client.user.username}`, description: `Bot Username: ${client.user.username}\nServers Im in: ${client.servers.size}\nBot Version: ${BotVer.version}\nNode.JS version: ${process.version}\nRevolt.JS version: ${require("revolt.js").LIBRARY_VERSION}\nMy Uptime: ${uptime()}\nMachine: ${os.machine()}\nMemory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\nInvite Me: https://app.revolt.chat/bot/${client.user._id}\nSource code: https://gitlab.com/bellemr/ccrevoltbot` }
		message.channel.sendMessage({ embeds: [embed] });
    }
});

client.on("message", async (message) => {
	if (message.author?. bot) return;
	if (typeof message.content != "string") return;
	if (message.content.startsWith(prefix + "say")) {
		const words = message.content.split(" ");
		words.shift();
		const toSay = words.join(" ");
		if(!toSay) return message.channel.sendMessage("What do you want me to say?");
			
		const blockedwords = fs.readFileSync('blockedwords.txt', 'utf-8').split('\n').map(word => word.trim());
		const containsWord = words.some(arg => blockedwords.includes(arg.toLowerCase()));
		if (containsWord) {return message.reply('I will not say any words or phrases related to illegal content, scamming, or racism');}
		
		message.channel.sendMessage(toSay);
    }
});

client.on("message", async (message) => {
	if (message.author?. bot) return;
    if (message.content === prefix + "serverinfo") {
		const s = message.channel.server;    
		const memberCount = await s.fetchMembers();
		const embed = { title: `Information about ${s.name}`, description: `Server ID: ${s._id}\nMember Count: ${memberCount.members.length}\nServer Owner: <@${s.owner}> (${s.owner})\n\nServer Description:  ${s.description}` }
		message.channel.sendMessage({ embeds: [embed] });
    }
});

let words = [
	'help',
	'ping',
	'botinfo',
	'say',
	'serverinfo',
	'addcmd',
	'deletecmd',
	'listcmds',
	'resetccmds'
].map(word => word.trim().toLowerCase());

client.on('message', async (message) => {
	if (message.author?. bot) return;
	if (typeof message.content != "string") return;
	const serverId = message.channel.server_id;
	const content = message.content.trim();
	
	const placeholders = {
		'{server_name}': message.channel.server.name,
		'{server_id}': message.channel.server._id,
		'{server_owner}': message.channel.server.owner,
		'{author_id}': message.author_id
	};
	const replacePlaceholders = (text) => {
		let newText = text;
		for (const placeholder in placeholders) {
			newText = newText.replace(new RegExp(escapeRegExp(placeholder), 'g'), placeholders[placeholder]);
		}
		return newText;
	};
	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the matched substring
	}
	
	if (message.content.startsWith(prefix)) {
		const [command, ...args] = content.slice(prefix.length).trim().split(/\s+/);
		if (commands[serverId] && commands[serverId][command]) {
			let response = commands[serverId][command];
			response = replacePlaceholders(response);
			if (response.startsWith('embed:')) {
				const embedresponse = response.slice(6).trim();
				const embed = { description: `${embedresponse}` }
				message.channel.sendMessage({ embeds: [embed] });
			} else if (response.startsWith('reply:')){
				const replyresponse = response.slice(6).trim();
				message.reply(replyresponse);
			} else if (response.startsWith('nsfw:')){
				if (!message.channel.nsfw) return message.channel.sendMessage("This custom command requires the use of a NSFW marked channel");
				const replyresponse = response.slice(6).trim();
				message.channel.sendMessage(replyresponse);
			} else if (response.startsWith('admin:')){
				if (message.member.hasPermission(message.channel.server, "ManageServer") === false) {
					return message.channel.sendMessage("You are missing the following permission to use this command: ManageServer");
				}
				const replyresponse = response.slice(6).trim();
				message.channel.sendMessage(replyresponse);
			} else {
				message.channel.sendMessage(response);
			}
			return;
		}
	}
	if (message.content.startsWith(prefix + "addcmd")) {
		if (message.member.hasPermission(message.channel.server, "ManageServer") === false) {
			return message.channel.sendMessage("You are missing the following permission to use this command: ManageServer");
		}
		const args = content.split(' ').slice(1);
		const [commandName, ...response] = args;
		const commandResponse = response.join(' ').replace(/\\n/g, '\n');
			
		const blockedwords = fs.readFileSync('blockedwords.txt', 'utf-8').split('\n').map(word => word.trim());
		const containsWord = args.some(arg => blockedwords.includes(arg.toLowerCase()));
		if (containsWord) {return message.reply('Please do not create commands that includes words or phrases related to illegal content, scamming, or racism');}
		
		if (!commands[serverId]) {
			commands[serverId] = {};
		}
		
		if (words.includes(commandName)) {return message.reply(`${commandName} is one of my built in commands. Therefore, I will not create a command with this command name.`)};

		if (commands[serverId][commandName]) {
			message.reply(`The command "${commandName}" already exists!`);
			return;
		}
		commands[serverId][commandName] = commandResponse;
		fs.writeFileSync('ccommands.json', JSON.stringify(commands, null, 2));
		message.reply(`Command "${commandName}" added successfully!`);
	}
	if (message.content.startsWith(prefix + "deletecmd")) {
		if (message.member.hasPermission(message.channel.server, "ManageServer") === false) {
			return message.channel.sendMessage("You are missing the following permission to use this command: ManageServer");
		}
		const args = content.split(' ').slice(1);
		const commandName = args[0];
		if (commands[serverId] && commands[serverId][commandName]) {
			delete commands[serverId][commandName];
			fs.writeFileSync('ccommands.json', JSON.stringify(commands, null, 2));
			message.reply(`Command "${commandName}" deleted successfully!`);
		} else {
			message.reply(`Command "${commandName}" not found.`);
		}
	}
	if (message.content === prefix + "listcmds") {
		if (commands[serverId] && Object.keys(commands[serverId]).length > 0) {
			const commandList = Object.keys(commands[serverId]).join(', ');
			return message.reply(`Here are the custom commands for this server:\n${commandList}`);
		} else {
			return message.reply("There are no custom commands created for this server.");
		}
	}
	if (message.content === prefix + "resetccmds") {
		if (message.member.hasPermission(message.channel.server, "ManageServer") === false) {
			return message.channel.sendMessage("You are missing the following permission to use this command: ManageServer");
		}
		if (commands[serverId]) {
			delete commands[serverId];
			fs.writeFileSync('ccommands.json', JSON.stringify(commands, null, 2));
			message.reply("All custom commands for this server has been removed.");
		} else {
			message.reply("There are no custom commands to remove for this server.");
		}
	}
});

client.on("message", async (message) => {
	if (message.author?. bot) return;
    if (typeof message.content != "string") return;
    if (message.content.startsWith(prefix + "status")) {
		if (message.author._id !== client.user.bot.owner) {
			return message.channel.sendMessage("You are not my owner");
		}
		const presenceoption = message.content.split(' ')[1];
		if(!presenceoption) return message.channel.sendMessage("What should the presence be? Online/Idle/Busy/Focus/Invisible");
		client.api.patch("/users/@me", { status: { presence: presenceoption } });
		message.channel.sendMessage(`Changed presence to "${presenceoption}"`);
	}
});





client.loginBot(token);