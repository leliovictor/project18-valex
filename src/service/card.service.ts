import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import dayjs from "dayjs";

import { AppError } from "../middlewares/error.handler.middleware.js";

import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";

dotenv.config();

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
  const employee = await checkEmployeeRegister(employeeId);
  await checkCardDuplicate(employeeId, type);

  const cardNumber = faker.finance.creditCardNumber();
  const cardName = formatEmployeeName(employee.fullName);

  const cryptr = new Cryptr(process.env.CRYPTR);
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
