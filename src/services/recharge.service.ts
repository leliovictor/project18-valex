import * as cardService from "./card.service.js";

import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function rechargeCard(
  cardId: number,
  amount: number,
  apiKey: string
) {
  await cardService.checkCompanyApiKey(apiKey);
  const card = await cardService.checkCardRegister(cardId);
  await cardService.checkIfCardIsActive(card.password);
  cardService.checkCardExpirationDate(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}
