import Express from "express";
import userController from "../controllers/user";

const { get, update, updateHistory} = userController;

const user = Express.Router();

user.get('/get', get);
user.post('/update', update);
user.post('/updateHistory', updateHistory);

export default user;
