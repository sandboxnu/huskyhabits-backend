import { Request, Response, Router } from 'express';
import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { sendError, sendValidationError } from '../exceptions/utils';
import { ajv } from '../types/validation';
const profile_controller = require('../controllers/profile');

const router: Router = Router();

// Gets the challenge id
router.get('/', (req: Request, res: Response) => {
    const name = req.params?.name;
    
});