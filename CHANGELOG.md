# Custom Commands Revolt Bot

Here is the changelog for all of the changes made to the Custom Commands Revolt bot by Axol's Software

### Version 0.1.0 - June 22nd, 2025

The first early release of the Custom Commands Revolt bot source code. Here is the features of this earl release:

- The bot is using revolt.js v6.0.20
- Added the following commands: help, ping, botinfo, say, serverinfo, addcmd, deletecmd, listcmds, resetccmds, status
- The custom commands feature and the say command has a filter so bad stuff can not be said through the bot.
- You can not create custom commands with a command name of an already built-in command and you need the Manage Server permission to create and remove custom commands.
- Custom commands supports the following tags: embed:, reply:, nsfw:, and admin: (having no tag will just be a normal response)
- Custom commands value support: {server_id}, {server_name}, {server_owner}, {author_id}
- The project is licensed under the MIT license
- Added a setup.sh file for easy setup on Linux.