import {Request, Response} from 'express';

import * as service from "../service/card.service.js";

export async function postCard(req: Request, res: Response) {
    const {employeeId, type} = res.locals.body;
    const {apiKey} = res.locals;
    
    await service.addNewCard(employeeId, type, apiKey);

    return res.sendStatus(200);
}