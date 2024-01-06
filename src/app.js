import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// attach the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(cookieParser());
app.use(express.static('public'));

//ejs
app.set('view engine', 'ejs');
app.set('views', 'src/views');

//routes
app.get('/', (req, res) => {
    //res.send("<h1>Hello World !!!<h1>");
    res.sendFile('src/index.html');
});


export default app;
