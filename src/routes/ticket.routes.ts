import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controllers';
import { protect } from '../controllers/auth.controllers';

const router = Router();

router.use(protect);

router
    .route('/')
    .get(ticketController.getMyAllTickets)
    .post(ticketController.createTicket);

router
    .route('/:id')
    .get(ticketController.getMyOneTicket)
    .patch(ticketController.updateMyTicket)
    .delete(ticketController.deleteMyTicket);

export default router;