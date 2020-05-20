import Express, {Request, Response, NextFunction} from "express";
import Mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session"
import cors from "cors";
import errorHandler from "errorhandler";
import IO from "./sockets/index";
import Router from "./routes";
import passport from "passport";
import strategy from "./config/passport";

const Server = Express();

Server.use(cors());
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({extended: true}));

Server.use(session({
    secret: Math.random().toString(36),
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));

Server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

const isProduction = process.env.NODE_ENV === 'production';
if(!isProduction) {
    Server.use(errorHandler());
    Server.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

Mongoose.Promise = global.Promise;
Mongoose.connect("mongodb://localhost/DotsAndBoxesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

Mongoose.set('debug', true);

passport.use(strategy);

Server.use(Router);

const server = Server.listen(4000);
IO.listen(server);
