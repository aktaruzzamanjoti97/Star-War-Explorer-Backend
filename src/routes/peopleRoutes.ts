import { Router } from 'express';
import { getAllPeople, getPersonById } from '../controllers/peopleController';

const router = Router();

router.get('/people', getAllPeople);
router.get('/people/:id', getPersonById);

export default router;
