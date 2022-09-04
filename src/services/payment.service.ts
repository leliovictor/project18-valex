import * as cardService from "./card.service.js";

import { AppError } from "../middlewares/error.handler.middleware.js";

function checkCardActive(password: string | null) {
  if(!password) {
    throw new AppError(
      409,
      "Card is not active",
      "Activate your card before buy something"
    );
  }
}

export async function payment(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {

  //Somente cartões cadastrados devem poder comprar
    const card = await cardService.checkCardRegister(cardId);

//- Somente cartões ativos devem poder comprar;
    checkCardActive(card.password);

//- Somente cartões não expirados devem poder comprar
    cardService.checkCardExpirationDate(card.expirationDate);

    /*


- Somente cartões não bloqueados devem poder comprar
- A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
- Somente estabelecimentos cadastrados devem poder transacionar
- Somente estabelecimentos do mesmo tipo do cartão devem poder transacionar com ele
- O cartão deve possuir saldo suficiente para cobrir o montante da compra
- A compra deve ser persistida
    */

    console.log('chegou aqui');
}
