import express from 'express';
import { CreateLeaderboard, getLeaderboard } from '../controllers/LeaderboardController.js';
const router =express.Router();

router.post('/submit',CreateLeaderboard);
router.get('/:contestCode',getLeaderboard);
export default router;