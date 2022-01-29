import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'This is a test. Looks like it worked!' });
});

router.post('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'Sent some test data. Looks like it worked!' });
});

export default router;
