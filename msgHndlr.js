const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
//const axios = require('axios')
const moment = require('moment-timezone')
//const get = require('got')
var colors = require('colors');
const { exec } = require('child_process')
const { stdout } = require('process')

moment.tz.setDefault('Europe/Rome').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
		var withNoDigits = ""
        const command = commands.toLowerCase().split(' ')[0] || ''
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
		//Konsol Arayüzü FOTO
		if (isMedia && type === 'image') {
			console.log(moment().format("H:mm:ss").green+" Veri alindi "+message.from);
			client.reply(from, 'Al knk kullan', id)
			const mediaData = await decryptMedia(message, uaOverride)
			console.log(moment().format("H:mm:ss").green+" fotograf cevrildi "+message.from);
			const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
			await client.sendImageAsSticker(from, imageBase64)
			console.log(moment().format("H:mm:ss").green+" sticker gonderildi. "+message.from);
		}
		//Konsol Arayüzü VİDEO
		if (isMedia &&(mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)) {
			const mediaData = await decryptMedia(message, uaOverride)
			console.log(moment().format("H:mm:ss").green+" Veri Alindi "+message.from);
			client.reply(from, 'Al knk kullan', id)
			const filename = `./media/input.${mimetype.split('/')[1]}`
			console.log(moment().format("H:mm:ss").green+" video cozumlendi "+message.from);
			await fs.writeFileSync(filename, mediaData)
			console.log(moment().format("H:mm:ss").green+" video cevrildi "+message.from);
			await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
				console.log(moment().format("H:mm:ss").green+" gif cevrildi. "+message.from);
				const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
				await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
				console.log(moment().format("H:mm:ss").green+" sticker gonderildi "+message.from);
			})//
		}

		if(command == '!yardim' || command == "!help"){
			console.log(moment().format("H:m:ss").green+": yardim "+message.from);
			client.sendText(message.from,'Fotoğrafı veya gifi at geç. Gerisini hallederiz. :) ');
			

		}
		if(command === "!admin"){
			console.log(moment().format("H:m:ss").green+": admin "+message.from);
			client.sendText(message.from,"https://www.instagram.com/onur.dll/ \n\n\n");
		}
		
		
		if(body.includes("media")){
			console.log(moment().format("H:mm:ss").green+" giphy "+message.from);
			if(!isNaN(body.charAt(13))){
				console.log(moment().format("H:mm:ss").green+" link con numero, tolgo il numero "+message.from);
				withNoDigits = body.replace(/\d+/,"");
				console.log(moment().format("H:mm:ss").green+withNoDigits);
				console.log(moment().format("H:mm:ss").green+" numero tolto "+message.from);
			}else{
				console.log(moment().format("H:mm:ss").green+" nessun numero "+message.from);
				withNoDigits = b
				console.log(moment().format("H:mm:ss").green+withNoDigits);
				console.log(moment().format("H:mm:ss").green+" link"+message.from);
			}
			client.sendGiphyAsSticker(message.from,withNoDigits);
			client.sendText(message.from,"Tutto ok! Attendi un attimo");
			console.log(moment().format("H:mm:ss").green+" sticker gonderildi "+message.from);
		}
    } catch (err) {
        console.log("errore".red)
        //client.kill().then(a => console.log(a))
    }
}
