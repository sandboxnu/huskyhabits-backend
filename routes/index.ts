import { Router } from 'express';
import profiles from './profile.route';
import challenges from './challenge.route';


const router: Router = Router();

router.use('/profiles', profiles);
router.use('/challenges', challenges);

export default router;