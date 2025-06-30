const fs = require('fs');
const { launchmode } = require('./config.json');

if (launchmode === '0') {
	require('./bot.js');
	console.log("Starting: Custom Commands [Revolt Bot]");
}
else if (launchmode === '1') {
	require('./botdiscord.js');
	console.log("Starting: Custom Commands [Discord Bot]");
}
else if (launchmode === '2') {
	require('./bot.js');
	require('./botdiscord.js');
	console.log("Starting: Custom Commands [Discord Bot] and Custom Commands [Revolt Bot]");
}
else {
	console.log("ERROR: INVALID VALUE.")
	console.log("Please edit the launchmode value in the config.json file. Here are the available values")
	console.log("0) Revolt.chat Bot Only")
	console.log("1) Discord Bot Only")
	console.log("1) Revolt.chat Bot and Discord Bot")
}