import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";
import dayjs from "dayjs";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { AppError } from "../middlewares/error.handler.middleware.js";

import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";

dotenv.config();
const cryptr = new Cryptr(process.env.CRYPTR);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

async function checkCompanyApiKey(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);

  if (!company) {
    throw new AppError(
      404,
      "Company not found",
      "Register your company before add a new card"
    );
  }

  return company;
}

async function checkEmployeeRegister(id: number) {
  const register = await employeeRepository.findById(id);

  if (!register) {
    throw new AppError(
      404,
      "Employee register not found",
      "Register employee before add a new card"
    );
  }

  return register;
}

async function checkCardDuplicate(
  id: number,
  type: cardRepository.TransactionTypes
) {
  const result = await cardRepository.findByTypeAndEmployeeId(type, id);

  if (result) {
    throw new AppError(
      409,
      `Employee already have a ${type} card`,
      "Register another type card"
    );
  }
}

function formatEmployeeName(name: string) {
  const arrName = name.split(" ");
  const formatNameArr = [];
  for (let i = 0; i < arrName.length; i++) {
    if (i === 0 || i === arrName.length - 1) {
      formatNameArr.push(arrName[i].toUpperCase());
      continue;
    }

    if (i !== 0 && i !== arrName.length - 1 && arrName[i].length >= 3) {
      formatNameArr.push(arrName[i][0].toUpperCase());
      continue;
    }
  }

  return formatNameArr.join(" ");
}

export async function addNewCard(
  employeeId: number,
  type: cardRepository.TransactionTypes,
  apiKey: string
) {
  await checkCompanyApiKey(apiKey);
  await checkCardDuplicate(employeeId, type);
  const employee = await checkEmployeeRegister(employeeId);

  const cardNumber = faker.finance.creditCardNumber();
  const cardName = formatEmployeeName(employee.fullName);
  const cardCVCCripter = cryptr.encrypt(faker.finance.creditCardCVV());

  const expirationDate = dayjs().add(5, "year").format("MM/YYYY");

  await cardRepository.insert({
    employeeId,
    number: cardNumber,
    cardholderName: cardName,
    securityCode: cardCVCCripter,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type,
  });
}


///////////////////////////////////////////////////////
////////////ACTIVATION CARD SERVICE ///////////////////
///////////////////////////////////////////////////////

export async function checkCardRegister(id: number) {
  const card = await cardRepository.findById(id);

  if(!card) {
    throw new AppError(
      404,
      `Card not found`,
      "Check card id before activate"
    );
  }

  return card;
}

export function checkCardExpirationDate(expirateDate: string) {
  const beforeOrSame = dayjs().isSameOrBefore(dayjs(expirateDate, "MM/YYYY"), "month");
  
  if(!beforeOrSame) {
    throw new AppError(
      409,
      "Card has expired",
      "Expiration date is before today date"
    );
  }
}

function checkIfAlreadyActive(password: string | null) {
  if(password) {
    throw new AppError(
      409,
      "Card already active",
      "Card already have a password"
    );
  }
}

function validateCVC(CVC: string, registerCVC: string) {
  const registerCVCdecrypt = cryptr.decrypt(registerCVC);
  
  if(CVC !== registerCVCdecrypt) {
    throw new AppError(
      409,
      "CVC invalid",
      "Check card security code"
    );
  }


}

export async function activateCard(id:number, CVC:string, password:string) {
  const card = await checkCardRegister(id);
  checkCardExpirationDate(card.expirationDate);
  checkIfAlreadyActive(card.password);
  validateCVC(CVC, card.securityCode);

  const passwordCript = bcrypt.hashSync(password, 10);
  
  const updateObject = {
    isBlocked: false,
    password: passwordCript,
  };

  await cardRepository.update(id, updateObject);
}

export function checkCardBlock(block: boolean) {
  if(block) {
    throw new AppError(
      409,
      "Card blocked",
      "Cannot procede because card is block"
    );
  }
}

export function checkCardPassword(passwordBody: string, passwordCard: string) {
  const validPassword = bcrypt.compareSync(passwordBody, passwordCard);
  if(!validPassword) {
    throw new AppError(
      401,
      "Password Invalid",
      "Check password before procede"
    );
  }
}

export async function blockCard(id: number, password: string) {
  const card = await checkCardRegister(id);
  checkCardExpirationDate(card.expirationDate);
  checkCardBlock(card.isBlocked);
  checkCardPassword(password, card.password);

  const blockObject = {
    isBlocked: true,
  }

  await cardRepository.update(id, blockObject);
}
