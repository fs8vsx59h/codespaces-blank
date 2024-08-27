import Parser from 'rss-parser';
import fs from 'fs';
const parser = new Parser();
let output = '';
const url = '';

(async () => {
    try {
        const feed = await parser.parseURL(`${url}`);
        console.log(`Title: ${feed.title}`);

        feed.items.forEach(item => {
            output += `${item.enclosure.url}\n`;
        });

        await fs.promises.writeFile('output.txt', output);
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
})();