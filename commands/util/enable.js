const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const config = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class EnableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'cmd-on', 'command-on'],
			group: 'util',
			memberName: 'enable',
			description: 'Enables a command or command group.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Only administrators may use this command.
			`,
			examples: ['enable util', 'enable Utility', 'enable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to enable?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
        const group = args.cmdOrGrp.group;
        var response = ""
        var color = ""
		if(args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
            response = `${config.error} The ${args.cmdOrGrp.name} ${args.cmdOrGrp.group ? 'command' : 'group'} is already enabled${group && !group.isEnabledIn(msg.guild) ? `, but the ${group.name} group is disabled, so it still can't be used.` : '.'}.`
            color = config.errorColor
        } else {
            response = `${config.success} Enabled the ${args.cmdOrGrp.name} ${group ? 'command' : 'group'}${group && !group.isEnabledIn(msg.guild) ?`, but the ${group.name} group is disabled, so it still can't be used` :''}.`
            color = config.successColor
            args.cmdOrGrp.setEnabledIn(msg.guild, true);
        }
        let embed = new MessageEmbed()
        .setColor(color)
        .setDescription(response)
        return msg.embed(embed)
	}
};