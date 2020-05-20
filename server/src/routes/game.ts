import Express from "express";
import gameController from "../controllers/game";

const { getScores, getGames} = gameController;

const gameRouter = Express.Router();

gameRouter.post('/scores', getScores);
gameRouter.post('/games', getGames);

export default gameRouter;
