import Express from "express";
import authRouter from "./auth";
import userRouter from "./user";
import gameRouter from "./game";

const Router = Express.Router();

Router.use('/auth', authRouter);
Router.use('/user', userRouter);
Router.use('/game', gameRouter);

export default Router;
module.exports = Router;
