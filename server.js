const express = require('express');
const app = express();
const path  = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com',
                    'http://127.0.0.1:5500',
                    'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
        optionsSuccessStatus: 200
}
// This is an open-to-the-public API without a whitelist ^^ (the sites
// that can access this server)
app.use(cors(corsOptions));

// built-in middleware
// Takes info submitted by a form
app.use(express.urlencoded({extended: false}))

// Built-in middleware for JSON
app.use(express.json())

// Basically telling .js scripts in the given dir (default root)
// where to look for files (like html and css)
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => {
    res.send("Hello World!")
})

app.all('*', (req, res) => {
   res.status(404);
   if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html')); 
   }
   else if (req.accepts('json')) {
    res.json({error: "404 Not Found"}); 
   } else {
    res.type('txt').send("404 Not Found");
   }
   
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`))