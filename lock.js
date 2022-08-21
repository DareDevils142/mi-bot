const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "lock", 
  alias: ["cerrar"], 

run: async (client, message, args, prefix) => {

  if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send("solo los administradores pueden usar este comando")
  
  const everyone  = message.guild.roles.cache.find(c => c.name == "@everyone")

  message.channel.permissionOverwrites.edit(everyone, {SEND_MESSAGES: false})

  message.channel.send({ content: "Se bloqueo el canal con exito" }) 

 }

}

 

