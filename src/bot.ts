import * as booru from 'booru'
import { CronJob } from 'cron';
import fs from 'fs';
import generator, { Entity, NotificationType, Response, WebSocketInterface } from 'megalodon';
import https from 'https';

const BASE_URL: string = 'https://botsin.space'
const WSS_BASE_URL: string = 'wss://botsin.space'
const access_token: string = 'ftKpSn_psozTAjTwlpw5DS6rS4n7ukqs1pUbjybCDuQ'
const client = generator('mastodon', BASE_URL, access_token)
const WSSclient = generator('mastodon', WSS_BASE_URL, access_token)
const toot: string = 'miku'
const image = fs.createReadStream('pics/4245447.jpg')
const regex = new RegExp('(?<=!)\w+') // (?<=!) possitive lookahead assertion
// var lastNotifID = '';
// const excludes: Array<string> = [
//     NotificationType.Follow,
//     NotificationType.Favourite,
//     NotificationType.Reblog,
//     NotificationType.PollVote,
//     NotificationType.PollExpired,
//     NotificationType.EmojiReaction,
// ]

//Miku image every 30min
// let mikuJob = new CronJob('*/30 * * * *', mikuSearch, null, true, 'Europe/Madrid');
async function mikuSearch(){
    booru.search('safebooru', ['hatsune_miku'], { limit: 1, random: true})
        .then( pics => {
            const pic = pics[0];
            https.get(pic.fileUrl!, imageResponse => 
                client.uploadMedia(imageResponse)
                .then((uploadResponse: Response<Entity.Attachment | Entity.AsyncAttachment>) => {
                    console.log(uploadResponse.data)
                    // client.postStatus(`Tags: ${pic.tags.slice(0,10).join(', ')}\nPost: ${pic.postView}`, {media_ids: [uploadResponse.data.id], sensitive: true})
                    client.postStatus(`Miku time!`, {media_ids: [uploadResponse.data.id], sensitive: true})
                        .then((postResponse: Response<Entity.Status>) => {
                            console.log(postResponse.data);
                        })
                })
            )
        })
}

const stream: WebSocketInterface = WSSclient.userSocket()
stream.on('notification', (notification: Entity.Notification) => {
    // console.log(`New notification:\n${JSON.stringify(notification, null, 4)}`);
    let mention: string = '' + notification.status?.content;
    if (regex.test(mention)){
        mention += '!hatusne_miku';
        const addedTags = mention.match(regex);
        // console.log(addedTags)
        booru.search('safebooru', addedTags!, { limit: 1, random: true})
            .then( pics => {
                const pic = pics[0];
                https.get(pic.fileUrl!, imageResponse => 
                    client.uploadMedia(imageResponse)
                    .then((uploadResponse: Response<Entity.Attachment | Entity.AsyncAttachment>) => {
                        console.log(uploadResponse.data)
                        client.postStatus(`Miku with ${addedTags}\n`, {in_reply_to_id: notification.id, media_ids: [uploadResponse.data.id], sensitive: true})
                    })
                )
            })
        }
    })
    //post the notification data JSON formatted
    // console.log(`New notification:\n${JSON.stringify(notification, null, 4)}`);
// })

// Overkill notification reader lol
// let notiJob = new CronJob('*/1 * * * *', getNotifs, null, true, 'Europe/Madrid');
// async function getNotifs() {
//     client.getNotifications({limit: 1, exclude_types: excludes})
//         .then(Notif => {
//             if (Notif.data[0].id != lastNotifID){
//                 lastNotifID = Notif.data[0].id;
//                 console.log(`New notification:\n${Notif.data[0]}`);
//             }
//         })
// }

// async function mikuSearch() {
//     const posts = await booru.search('safebooru', ["hatsune_miku"], { limit: 1, random: true });
//     for (let post of posts){
//         console.log(post.fileUrl);
//         await downloadImage(post.fileUrl!, `pics/${post.id}.jpg`);
//     }
// }

// uploads an image from its url
// https.get('https://www.nippon.com/es/ncommon/contents/japan-topics/560508/560508.jpg', res => 
//     client.uploadMedia(res)
//     .then((res: Response<Entity.Attachment | Entity.AsyncAttachment>) => {
//         console.log(res.data)
//     })
// )

// Post an image
// const client = generator('mastodon', BASE_URL, access_token)
// client.uploadMedia(image)
//     .then((res: Response<Entity.Attachment | Entity.AsyncAttachment>) => {
//         console.log(res.data)
//         client.postStatus('miku', {'media_ids': [res.data.id]})
//             .then((rep: Response<Entity.Status>) => {
//                 console.log(rep.data)
//             })
//     })

//Post tweet
// const client = generator('mastodon', BASE_URL, access_token)
// client.postStatus(toot)
//     .then((res: Response<Entity.Status>) => {
//         console.log(res.data)
//     })

//Download a Miku img evry 10sec
// let mikuJob = new CronJob('*/10 * * * * *', mikuSearch, null, true, 'Europe/Madrid');

// async function mikuSearch() {
//     const posts = await booru.search('safebooru', ["hatsune_miku"], { limit: 1, random: true });
//     for (let post of posts){
//         console.log(post.fileUrl);
//         await downloadImage(post.fileUrl!, `pics/${post.id}.jpg`);
//     }
// }

// const downloadImage = async (url:string, path:string) => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     const arrayBuffer = await blob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     await fs.writeFile(path, buffer);
//     console.log('Image saved.');
//     var sex = 'lol';
// }