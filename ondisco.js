const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const express = require("express")
const port = process.env.PORT || 23011
const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')
const fs = require('fs')
const token = process.env.token || config.token
const prefix = process.env.prefix || config.prefix



client.on("ready", () => {
    console.log(`Bot Online, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
})

client.on('error', console.error);

client.on("presenceUpdate", async presenceupdate => {
    client.user.setActivity('Digite !dhelp para mais informações.')

})

client.on("guildCreate", guild => {
    console.log(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`)
    client.user.setActivity(`Agora estou em ${client.guilds.size} servidores.`)
})



client.on("guildMemberAdd", async newmember => {
    canal = client.channels.get('622940693022638090')
    guild = client.guilds.get('565566718446141450')
    if (newmember.guild != guild) return
    if (newmember.user == client.user.bot) return

    let embed = new discord.RichEmbed()
    embed.setTitle(newmember.user.tag)
        .setColor("#FFF100")
        .setTimestamp(canal.createdTimestamp)
        .setThumbnail(newmember.user.displayAvatarURL)
        .setDescription("**Você entrou no servidor:** **``" + newmember.guild.name + "``** \n**Com você temos:** **``" + newmember.guild.memberCount + "`` membros 🥳**")
        .setImage("https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif")
        .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")

    canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, embedMusic)
    console.log(`Novo membro \nEmbed enviada no servidor ${newmember.guild.name}`)
})
client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (message.content == "<@617522102895116358>") {
        const embedmsg = new discord.RichEmbed()
        embedmsg.setTitle(`Olá ${message.author.username}! \nMeu nome é Ondisco logo a baixo tem minha descrição:`)
            .setDescription("**prefixo:** **``!d``** \n **função do Ondisco:** **``Divertir os usuarios do Discord tocando músicas nos canais de voz``** \n **Criador do Ondisco:** **``Marcio#1506``**")
            .setColor('#B955D4')
            .setTimestamp(message.createdTimestamp)
            .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
        return message.channel.send(embedmsg)
    }
    if (!message.content.startsWith(prefix)) return;

    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)
    const arguments = message.content.split(' ')
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const embedMusic = new discord.RichEmbed()
        .setColor("#A331B6")
    let op;
    const { author, createdTimestamp,channel, member: { voiceChannel } } = message


    argsObject = {
        "!d": author + " Você esqueceu dos argumentos, Digite ``!dhelp`` ",
    }

    if (argsObject[message.content]) {
        channel.send(argsObject[message.content])
    }
    switch (comando) {
        case "avatar":
            if (mentionUser) {
                embedMusic.setColor(colorRadomEx())
                    .setTimestamp(createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar avatar](${memberMentions.user.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(memberMentions.user.displayAvatarURL)
                    .setAuthor(author.tag, author.displayAvatarURL)
            } else {
                embedMusic.setColor(colorRadomEx())
                    .setTimestamp(createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar avatar](${author.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(author.displayAvatarURL)
                    .setAuthor(author.tag, author.displayAvatarURL)
            }
                channel.send(embedMusic)
            break;
        case "help":
            const embedHelp = new discord.RichEmbed()
            embedHelp.setColor("#AD25D7")
                .setTitle("**```Help```**")
                .setTimestamp(createdTimestamp)
                .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
                .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                .addField("``avatar``", "Comando para visualizar o avatar do perfil")
                .addField("😀", "Comandos para ouvir música")
                .addBlankField()
                .addField("**``play``**", "inicia a música", true)
                .addField("**``leave``**", "Finalizar a música e sai do canal", true)
                .addField("**``back``**", "Continua a música pausada", true)
                .addField("**``pause``**", "Pausa a música", true)
                .addField("**``stop``**", "Finaliza a música", true)
                .addField("**``vol``**", "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", true)
                .addField("**``skip``**", "pula a música que está tocando no momento", true)

            const m = await channel.send(embedHelp)
            m.delete(35000)
            break;
        case "play":
            if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso conceder essa função se você estiver conectado em um canal de voz`)
            if (voiceChannel.joinable == false || voiceChannel.speakable == false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`)
            if (voiceChannel.muted == true) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
            if (!voiceChannel.memberPermissions(author.id)) return

            const memberPermission = voiceChannel.memberPermissions(author.id);
            if (!memberPermission.has("CONNECT") || !memberPermission.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`)

            arguments.shift()

            if (!arguments) return channel.send("<@" + author.id + "> Digite o nome da musica que deseja tocar. \n exe: ``!dplay Eminem Venom `` ")
            ytSearch(arguments.join(" "), async function (err, videoInfo) {
                if (err) console.log(err)

                const listVideos = videoInfo.videos
                let option = 1
                let cont = 1
                let optionTitle = []

                const optEmbed = new discord.RichEmbed()
                optEmbed.setTitle("Selecione a musica que deseja tocar digitando um numero entre ``1`` a ``10``")

                for (const video of listVideos) {
                    optionTitle.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video['title'] + "``** \n")
                    option = option + 1;
                    if (cont === 10) break
                    cont = cont + 1;
                }

                optEmbed.setDescription(optionTitle)
                const msg = await message.reply(optEmbed)
                msg.delete(40000)

                const filter = respon => respon.author.id === author.id

                channel.awaitMessages(filter, {
                    max: 1,
                    time: 40000
                }).then(async sellect => {

                    try {
                        if(sellect.first().content == "cancel") return channel.send("Música cancelada")
                        await selectOption(sellect.first().content)
                        let music = listVideos[op]
                        if (!music) return undefined
                        const voiceConnection = voiceChannel.join()

                        voiceConnection.then(connection => {
                            playMusic(connection, music)
                        })

                    } catch (error) {
                        console.log(`Tipo de erro: ${error}`)
                        return undefined
                    }
                })
                    .catch(console.error)
            })
            break;
        case "down":
            arguments.shift()
            if (!arguments) return channel.send(`<@${author.id}> Digite o nome da musica para fazer o download.`)

            ytSearch(arguments.join(" "), async function (err, videoInfo) {
                if (err) console.log(err)

                const listVideos = videoInfo.videos
                let option = 1
                let cont = 1
                let optionTitle = []

                const optEmbed = new discord.RichEmbed()
                optEmbed.setTitle("Selecione a musica para fazer o download digitando um numero entre ``1`` a ``10``")

                for (const video of listVideos) {
                    optionTitle.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video['title'] + "``** \n")
                    option = option + 1;
                    if (cont == 10) break
                    cont = cont + 1;
                }

                optEmbed.setDescription(optionTitle)
                const msg = await message.reply(optEmbed)
                msg.delete(40000)

                const filter = respon => respon.author.id === author.id

                channel.awaitMessages(filter, {
                    max: 1,
                    time: 40000
                }).then(async sellect => {
                    try {
                        await selectOption(sellect.first().content)
                        let music = listVideos[op]
                        if (!music) return undefined
                        downloadVideo(music)

                    } catch (error) {
                        return console.log(`Tipo de erro: \n${error}`)
                    }
                })
                    .catch(console.error)
            })
            break;

        case "leave":
            if (!voiceChannel.connection) return channel.send(`<@${author.id}>, <:huuum:648550001298898944> não posso sair do canal de voz ,se eu não estou nele.`)
            if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso sair do canal de voz você está ausente.`)

            embedMusic.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")
                .setColor(colorRadomEx())
            voiceChannel.connection.disconnect()
            channel.send(embedMusic)

            break;
        case "pause":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso pausar a musica você está ausente no canal de voz`)
            embedMusic.setColor(colorRadomEx())
            embedMusic.setDescription("<:pause:633071783465058334> paused")
            if (voiceChannel.connection.speaking == true) {
                voiceChannel.connection.dispatcher.pause()
                channel.send(embedMusic)
            } else {
                return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`)
            }

            break;
        case "back":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setDescription("<:play:633088252940648480> ")
                .setColor(colorRadomEx())

            if (voiceChannel.connection.dispatcher.paused == true) {
                voiceChannel.connection.dispatcher.resume()
                channel.send(embedMusic)
            } else {
                return console.log("erro! não pode continuar a musica pausada")
            }
            break;
        case "stop":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setDescription("<:stop:648561120155795466> stopped")
            if (voiceChannel.connection.speaking == true) {
                voiceChannel.connection.dispatcher.end()
                return channel.send(embedMusic)
            } else {
                return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`)
            }

        case "vol":
            let numberVol = parseInt(arguments[1])
            embedMusic.setColor(colorRadomEx())

            if (!voiceChannel || !numberVol || !voiceChannel.connection) return

            switch (numberVol) {
                case 0:
                    embedMusic.setDescription("<:silentmode:633076689202839612>")
                    channel.send(embedMusic)
                    break;
                case 1:
                    embedMusic.setDescription("<:lowvolume:633076130626404388>")
                    channel.send(embedMusic)
                    break;
                case 3:
                    embedMusic.setDescription("<:mediumvolume:633076130668085248>")
                    channel.send(embedMusic)
                    break;
                case 4:
                    embedMusic.setDescription("\🥴  Volume máximo, Não recomendo a altura desse volume")
                    channel.send(embedMusic)
                    break;
                default:
                    voiceChannel.connection.dispatcher.setVolume(1)
                    break;
            }
            return (numberVol >= 0 && numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(arguments[1]) : channel.send(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 4`)

        case "skip":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            voiceChannel.connection.receivers.shift()
            console.log(voiceChannel.connection.receivers)
            if (!voiceChannel.connection.receivers[0]) return

            voiceChannel.connection.playStream(await ytdl(voiceChannel.connection.receivers[0]))
            embedMusic.setTitle("música pulada")

            channel.send(embedMusic)
            break;
        case "rep":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            if (!voiceChannel.connection.receivers[0]) return
            const queue = voiceChannel.connection.receivers[0]
            voiceChannel.connection.playStream(await ytdl(queue))
            break;

            function colorRadomEx() {
                let letters = "123456789ABCDEFGH"
                color = "#"
                for (let c = 0; c < 6; c++) {
                    color += letters[Math.floor(Math.random() * 12)]
                }
                return color
            }

            function selectOption(arg) {
                const numbers = "12345678910"
                if (!arg || arg.length === 0) return channel.send(`Nenhuma opção escolhida`)
                if (arg.length > 2) return console.log(`O tamanho do caractere foi excedido pra :${arguments.length} caracteres`)
                if (!numbers.includes(arg)) return console.log("Só é aceito números")
                const option = Number(arg) - 1
                op = option;
            }

            function playMusic(connection, music) {
                if (connection.receivers[0]) {
                    connection.receivers.push("https://www.youtube.com" + music['url'])
                    embedMusic.setTitle(' ``' + music['title'] + '`` foi adicionado na fila')
                    channel.send(embedMusic)
                } else {
                    connection.receivers.push("https://www.youtube.com" + music['url'])
                    connection.playStream(ytdl(connection.receivers[0]))
                    connection.dispatcher.on("start", () => {
                        const video_url = music["videoId"]
                        embedMusic.setTitle('Tocando <a:Ondisco:630470764004638720> ``' + music['title'] + '``')
                            .setDescription(`Duração: ${music["timestamp"]} \n [Video](https://www.youtube.com/watch?v=${video_url})`)
                        channel.send(embedMusic)
                    })
                    connection.dispatcher.stream.on("end", () => {
                        connection.receivers.shift()
                        if (!connection.receivers[0]) return
                        connection.playStream(ytdl(connection.receivers[0]))
                    })
                    voiceChannel.connection.dispatcher.stream.on('error', error => console.log(error))
                }
            }

            function downloadVideo(music) {
                return new Promise((resolve, reject) => {
                    if (!music) return console.log("valor nulo, não posso baixar a musica")
                    if (ytdl.validateURL(music['url'])) {
                        const video_download = ytdl(music['url'])
                        channel.send("Espere o download")
                        const pathVideo = video_download.pipe(fs.createWriteStream(`/home/marcioubuntu/Documentos/bot-ondisco/assets/musics/${music['title']}.mp3`))
                        video_download.on("end", () => {
                            resolve(pathVideo['path'])
                            music['title'] = ""
                            music['url'] = ""
                        })
                        video_download.on("error", (error) => console.log(error))
                    } else {
                        reject("Erro na converção")
                    }
                })
                    .then(async (file) => {
                        embedMusic.attachFile(file)
                            .setColor("#B955D4")
                            .setTitle("Musica convertida")
                        await channel.send(embedMusic)
                        console.log(file)
                    })
                    .catch((erro) => console.warn(erro))
            }
    }

})

client.on("raw", async dados => {
    if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
    if (dados.d.message_id != "617843012617109515" && dados.d.channel_id != "617843012617109515") return

    let servidor = client.guilds.get("565566718446141450")
    let membro = servidor.members.get(dados.d.user_id)
    let cargo1 = servidor.roles.get("571713968834347065")
    let cargo2 = servidor.roles.get("571713974626680842")

    if (dados.t === "MESSAGE_REACTION_ADD") {
        if (dados.d.emoji.name == "🅰") {
            if (membro.roles.has(cargo1)) return
            membro.addRole(cargo1)
        } else if (dados.d.emoji.name == "🇧") {
            if (membro.roles.has(cargo2)) return
            membro.addRole(cargo2)
        }
    }
    if (dados.t === "MESSAGE_REACTION_REMOVE") {
        if (dados.d.emoji.name === "🅰") {
            if (membro.roles.has(cargo1)) return
            console.log("removeu cargo")
            membro.removeRole(cargo1)
        } else if (dados.d.emoji.name === "🇧") {
            if (membro.roles.has(cargo2)) return
            console.log("Removeu cargo")
            membro.removeRole(cargo2)
        }
    }

})
express()
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(token)