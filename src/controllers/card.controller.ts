import {Request, Response} from 'express';

import * as service from "../services/card.service.js";

export async function postCard(req: Request, res: Response) {
    const {employeeId, type} = res.locals.body;
    const {apiKey} = res.locals;
    
    await service.addNewCard(employeeId, type, apiKey);

    return res.sendStatus(200);
}

export async function postActivationCard(req: Request, res: Response) {
    const {id, CVC, password} = res.locals.body;

    await service.activateCard(id, CVC, password);
    
    return res.sendStatus(200);
}

export async function postBlockCard(req: Request, res: Response) {
    const {id, password} = res.locals.body;
    
    await service.blockCard(id, password);

    return res.sendStatus(200);
}

export async function postUnblockCard(req: Request, res: Response) {
    const {id, password} = res.locals.body;

    await service.unblockCard(id, password);
    
    return res.sendStatus(200);
}