#!/bin/sh
echo "Custom Commands Revolt Bot - By Axol's Software"
echo "Press the approprite key to start an action"
echo "x) Close setup.sh script"
echo "0) Information about the Custom Commands Bot"
echo "1) Launch the application"
echo "2) Install required npm packages for Revolt bot ONLY"
echo "2) Install required npm packages for Revolt bot and Discord bot"
while true; do
	read -n 1 -p "Enter Option: " option
	case $option in
		[x]* )
			echo
			echo "The setup.sh script is now closing...."
			exit 1
		;;
		[0]* )
			echo
			echo "Custom Commands Revolt Bot"
			echo "This source code allows you to host a Revolt.chat bot and"
			echo "allows you to create simple custom commands for your server"
			echo "This source code does include the Discord Bot build to use on a Discord bot."
			echo "Please read the README.md file for more information"
		;;
		[1]* )
			echo
			node index.js
		;;
		[2]* )
			echo
			echo "Installing NPM Packages (for Revolt bot ONLY)"
			sudo npm install revolt.js@6.0.20
			sudo npm install axios
			sudo npm install nodemon
		;;
		[3]* )
			echo
			echo "Installing NPM Packages (for Revolt bot and Discord bot)"
			sudo npm install discord.js@14.21.0
			sudo npm install discord-api-types
			sudo npm install revolt.js@6.0.20
			sudo npm install axios
			sudo npm install nodemon
		;;
		*)
            echo
            echo "Invalid option was provided"
		;;
	esac
done