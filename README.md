# Custom Commands Revolt Bot

Custom Commands Revolt bot is a simple Revolt bot source code made by Axol's Software that allows you to create simple custom commands for your server.

The custom commands feature has been taken from my Axol bot and instead of the Apache License, this code is licensed under the MIT license.

## Setup Guide

Before setting up this bot, here are the minimum requirements to run this bot on your server

- Node v20 or newer (Node v22 or newer recommended).
- 512mb ram and 512mb disk space free (1gb ram free recommended)

Assuming your server or computer meets the minimum requirements, you can now start setting up the bot. Below is the steps to setup the bot.

1. Copy/Fork this source code to your computer or server from your hosting provider
2. Create a Revolt.chat bot at https://app.revolt.chat/settings/bots and copy the bot's token
3. Open the config.json file and fill in everything it asks for

```json
{
	"revoltbottoken": "", #Your Revolt.chat bot token
	"revoltbotprefix": "!" #Your bot prefix the bot will respond to
}
```

4. Open the blockedwords.txt file and put in words or phrases (seperated with each line) you don't want the bot to say within the say command or the custom commands feature.
5. Install the required packages. (You can use "npm install" without the quotation marks to install everything from the package.json file).
6. Launch the bot and enjoy (which can be done by running "node ." without the quotation marks).

## Tags and Values:

Supported tags:

- embed: = Makes the response into an embed
- reply: = The bot will reply to your command execution message.
- nsfw: = The command requires you to use a NSFW marked channel 
- admin: = Users would need to have the Manage Server permission in order to use the command
- having no tag will just be a normal response

Supported Values:

- {server_id} = The ID of the server
- {server_name} = The server name
- {server_owner} = The ID of the server owner
- {author_id} = The ID of the executing command author.

## Links

[Revolt Server](https://rvlt.gg/WJmNxmkv) - [Developers Youtube](https://www.youtube.com/channel/UCCYCRAt1srptO3dc7eeN4Yw)