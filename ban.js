```

const {Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "ban",
    description: "ban users.",
    userPerms: ["BanMembers"],
    botPerms: ["BanMembers"],
    options: [
        {
            name: "user",
            description: "Select the users",
            type: 6,
            required: true
        },
        {
            name: "razon",
            description: "proporcionar una razón",
            type: 3,
            required: false
        }
    ],
    category: "Moderation",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const member = options.getUser("user")
        const reason = options.getString("reason") || "Ninguna razón dada."
        let members = guild.members.cache.get(member.id)

        if(member.id === user.id) return interaction.editReply({content: ":x: | No puedes banearte a ti mismo !", ephemeral: true })
        if(guild.ownerId === member.id) return interaction.editReply({content: ":x: | No puedes banerar al owner del servidor !", ephemeral: true })
        if(guild.members.me.roles.highest.position <= members.roles.highest.position) return interaction.editReply({content: ":x: | No puedo banear a un usuario que tiene un rol más alto que yo", ephemeral: true })
        if(interaction.member.roles.highest.position <= members.roles.highest.position) return interaction.editReply({content: ":x: | No puedes banear a un usuario que tiene un rol más alto que el tuyo !", ephemeral: true })

        const Embed = new EmbedBuilder()
        .setColor("Green")

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("ban.yes")
            .setLabel("SI")
            .setEmoji("✅"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ban.no")
            .setLabel("No")
            .setEmoji("❌")
        )
        const Page = interaction.editReply({
            embeds: [
                Embed.setDescription("⚠️ | ¿De verdad banear prohibir a esta persona?")
            ],
            components: [row]
        })

        const collect = await (await Page).createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s")
        })

        collect.on("collect", async i => {
            if(i.user.id !== user.id) return
            switch(i.customId) {
                case "ban.yes":
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Has sido baneado del servidor ${guild.name} por la razón: ${reason}`)
                        ],
                    }).catch((e) => {
                        interaction.editReply({
                            embeds: [
                                Embed.setDescription(`✅ | ${members} fue baneado por la razón: ${reason} pero no pude enviar mensaje privado al usuario !`)
                            ]
                        })
                    })
                        await interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | ${members} fue baneado por la razón: ${reason}`)
                        ],
                        components: []
                    })
                    await members.ban({reason})

                break;
                case "ban.no":
                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("✅ | La solicitud de baneo ha sido cancelada. !")
                        ],
                        components: []
                    })
                break;
            }
        })

        collect.on("end", (collected) => {
            if(collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(":x: | Se acabó el tiempo !")
                ],
                components: []
            })
        })
    }
}
```
