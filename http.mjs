import http from 'http';
import Parser from 'rss-parser';

const parser = new Parser();

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        let body = '';

        // 收集请求体数据
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                // 解析请求体为JSON
                const data = JSON.parse(body);
                const rssUrl = data.url;

                if (!rssUrl) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Bad Request: Please provide a valid RSS URL in the request body.');
                    return;
                }

                // 解析RSS链接
                const feed = await parser.parseURL(rssUrl);
                let output = `Title: ${feed.title}\n\n`;

                feed.items.forEach(item => {
                    output += `${item.enclosure.url}\n`;
                });

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(output);
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error: Unable to parse the RSS feed.');
            }
        });

    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed: Only POST requests are supported.');
    }
});

const PORT = 8888;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
