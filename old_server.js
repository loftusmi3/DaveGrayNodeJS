/* const http  = require('http')
const path  = require('path')
const fs  = require('fs')
const fsPromises  = require('fs').promises;
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async(filePath, contentType, response) =>{
    try {
        // Find the file's encoding type
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes("image") ? 'utf8' : ''
        );
        // If it's a JSON, turn it into an array
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        // Return the code for the response header (errored or successful)
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType});
        // Send the response
        response.end(
            contentType === 'application/json' ? JSON.stringify (data): data
        );
        // If there's an error, log it and emit it (let everything know there was an error)
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

// Server definition
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    // Emit that you created  a server
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    // Figure out which file is requesting something from the server
    const extension = path.extname(req.url);

    let contentType;

    // Figure out what kind of file the requesting file is
    // so that you know what to give to it
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

        // Identify the file's absolute path (address)
        // so that you can send something to it
    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // Makes the .html extension unnecessary in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += ".html"

    const fileExists = fs.existsSync(filePath);

    // Send the response to the file...
    if (fileExists) {
        serveFile(filePath, contentType, res);
    // ... but if that doesn't work, route or send a 404 not found
    } else {
        switch(path.parse(filePath)){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            // Serve a 404 response
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        };
    }
});

// Run this baby
server.listen(PORT, () => console.log(`Server running on ${PORT}`)) */