import * as cardService from "./card.service.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

import { AppError } from "../middlewares/error.handler.middleware.js";

export async function checkBusinessRegister(id: number) {
  const business = await businessRepository.findById(id);

  if (!business) {
    throw new AppError(
      404,
      "Business not found",
      "Check business id before procede"
    );
  }

  return business;
}

export function compareBusinessCardTypes(
  cardType: string,
  businessType: string
) {
  if (cardType !== businessType) {
    throw new AppError(
      409,
      "Card type invalid",
      "Only business and card types with same value are valid"
    );
  }
}

export async function checkCardBalance(cardId: number, amount: number) {
  const { balance } = await cardService.balanceCard(cardId);

  if (balance - amount < 0) {
    throw new AppError(
      409,
      "Insufficient card balance",
      "Recharge your card before procede"
    );
  }
}

export async function payment(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await cardService.checkCardRegister(cardId);
  await cardService.checkIfCardIsActive(card.password);
  cardService.checkCardExpirationDate(card.expirationDate);
  cardService.checkCardAlreadyBlock(card.isBlocked);
  cardService.checkCardPassword(password, card.password);
  const business = await checkBusinessRegister(businessId);
  compareBusinessCardTypes(card.type, business.type);
  await checkCardBalance(cardId, amount);

  await paymentRepository.insert({ cardId, businessId, amount });
}

async function checkCardInfos(number: string, cardholderName: string, expirationDate: string) {
  const result = await cardRepository.findByCardDetails(number, cardholderName, expirationDate);

  if(!result) {
    throw new AppError(
      404,
      "Card not found",
      "Check card details"
    );
  }

  return result;
}

export async function onlinePayment(
  number: string,
  cardholderName: string,
  expirationDate: string,
  CVC: string,
  businessId: number,
  amount: number
) {

  const card = await checkCardInfos(number, cardholderName, expirationDate);
  cardService.validateCVC(CVC, card.securityCode);
  cardService.checkCardExpirationDate(card.expirationDate);
  cardService.checkCardAlreadyBlock(card.isBlocked);
  const business = await checkBusinessRegister(businessId);
  compareBusinessCardTypes(card.type, business.type);
  await checkCardBalance(card.id, amount);

  await paymentRepository.insert({ cardId:card.id, businessId, amount });


}
