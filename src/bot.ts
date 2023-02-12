import * as booru from 'booru'
import { CronJob } from 'cron';
import fs from 'fs';
import generator, { Entity, Response } from 'megalodon';
import https from 'https';

const BASE_URL: string = 'https://botsin.space'
const access_token: string = 'ftKpSn_psozTAjTwlpw5DS6rS4n7ukqs1pUbjybCDuQ'
const client = generator('mastodon', BASE_URL, access_token)
// const toot: string = 'miku'
const image = fs.createReadStream('pics/4245447.jpg')

// async function mikuSearch() {
//     const posts = await booru.search('safebooru', ["hatsune_miku"], { limit: 1, random: true });
//     for (let post of posts){
//         console.log(post.fileUrl);
//         await downloadImage(post.fileUrl!, `pics/${post.id}.jpg`);
//     }
// }

booru.search('safebooru', ['hatsune_miku'], { limit: 1, random: true})
    .then( pics => {
        const pic = pics[0]
        https.get(pic.fileUrl!, imageResponse => 
            client.uploadMedia(imageResponse)
            .then((uploadResponse: Response<Entity.Attachment | Entity.AsyncAttachment>) => {
                console.log(uploadResponse.data)
                client.postStatus(`Tags: ${pic.tags.slice(0,10).join(', ')}\nPost: ${pic.postView}`, {media_ids: [uploadResponse.data.id], sensitive: true})
                    .then((postResponse: Response<Entity.Status>) => {
                        console.log(postResponse.data)
                    })
            })
        )
    })



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