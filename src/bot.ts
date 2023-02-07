import * as booru from 'booru'
import { CronJob } from 'cron';
import { promises as fs } from 'fs';

let mikuJob = new CronJob('*/10 * * * * *', mikuSearch, null, true, 'Europe/Madrid');

async function mikuSearch() {
    const posts = await booru.search('safebooru', ["hatsune_miku"], { limit: 1, random: true });
    for (let post of posts){
        console.log(post.fileUrl);
        await downloadImage(post.fileUrl!, `pics/${post.id}.jpg`);
    }
}

const downloadImage = async (url:string, path:string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);
    console.log('Image saved.');
    var sex = 'lol';
}