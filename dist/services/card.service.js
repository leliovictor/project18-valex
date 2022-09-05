var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
dotenv.config();
var cryptr = new Cryptr(process.env.CRYPTR);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
export function checkCompanyApiKey(apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var company;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
                case 1:
                    company = _a.sent();
                    if (!company) {
                        throw new AppError(404, "Company not found", "Register your company before add a new card");
                    }
                    return [2 /*return*/, company];
            }
        });
    });
}
function checkEmployeeRegister(id) {
    return __awaiter(this, void 0, void 0, function () {
        var register;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, employeeRepository.findById(id)];
                case 1:
                    register = _a.sent();
                    if (!register) {
                        throw new AppError(404, "Employee register not found", "Register employee before add a new card");
                    }
                    return [2 /*return*/, register];
            }
        });
    });
}
function checkCardDuplicate(id, type) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(type, id)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        throw new AppError(409, "Employee already have a ".concat(type, " card"), "Register another type card");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function formatEmployeeName(name) {
    var arrName = name.split(" ");
    var formatNameArr = [];
    for (var i = 0; i < arrName.length; i++) {
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
export function addNewCard(employeeId, type, apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var employee, cardNumber, cardName, cardCVCCripter, expirationDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkCompanyApiKey(apiKey)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, checkCardDuplicate(employeeId, type)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, checkEmployeeRegister(employeeId)];
                case 3:
                    employee = _a.sent();
                    cardNumber = faker.finance.creditCardNumber();
                    cardName = formatEmployeeName(employee.fullName);
                    cardCVCCripter = cryptr.encrypt(faker.finance.creditCardCVV());
                    expirationDate = dayjs().add(5, "year").format("MM/YYYY");
                    return [4 /*yield*/, cardRepository.insert({
                            employeeId: employeeId,
                            number: cardNumber,
                            cardholderName: cardName,
                            securityCode: cardCVCCripter,
                            expirationDate: expirationDate,
                            password: null,
                            isVirtual: false,
                            originalCardId: null,
                            isBlocked: true,
                            type: type
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkCardRegister(id) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!card) {
                        throw new AppError(404, "Card not found", "Check card id before activate");
                    }
                    return [2 /*return*/, card];
            }
        });
    });
}
export function checkCardExpirationDate(expirateDate) {
    var beforeOrSame = dayjs().isSameOrBefore(dayjs(expirateDate, "MM/YYYY"), "month");
    if (!beforeOrSame) {
        throw new AppError(409, "Card has expired", "Expiration date is before today date");
    }
}
function checkIfAlreadyActive(password) {
    if (password) {
        throw new AppError(409, "Card already active", "Card already have a password");
    }
}
export function validateCVC(CVC, registerCVC) {
    var registerCVCdecrypt = cryptr.decrypt(registerCVC);
    if (CVC !== registerCVCdecrypt) {
        throw new AppError(409, "CVC invalid", "Check card security code");
    }
}
export function activateCard(id, CVC, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, passwordCript, updateObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkCardRegister(id)];
                case 1:
                    card = _a.sent();
                    checkCardExpirationDate(card.expirationDate);
                    checkIfAlreadyActive(card.password);
                    validateCVC(CVC, card.securityCode);
                    passwordCript = bcrypt.hashSync(password, 10);
                    updateObject = {
                        isBlocked: false,
                        password: passwordCript
                    };
                    return [4 /*yield*/, cardRepository.update(id, updateObject)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function checkCardAlreadyBlock(block) {
    if (block) {
        throw new AppError(409, "Card blocked", "Cannot procede because card is block");
    }
}
export function checkCardPassword(passwordBody, passwordCard) {
    var validPassword = bcrypt.compareSync(passwordBody, passwordCard);
    if (!validPassword) {
        throw new AppError(401, "Password Invalid", "Check password before procede");
    }
}
export function blockCard(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, blockObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkCardRegister(id)];
                case 1:
                    card = _a.sent();
                    checkCardExpirationDate(card.expirationDate);
                    checkCardAlreadyBlock(card.isBlocked);
                    checkCardPassword(password, card.password);
                    blockObject = {
                        isBlocked: true
                    };
                    return [4 /*yield*/, cardRepository.update(id, blockObject)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkCardUnblock(block) {
    if (!block) {
        throw new AppError(409, "Card is already unlock", "Cannot procede because card is already unlock");
    }
}
export function unblockCard(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, unblockObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkCardRegister(id)];
                case 1:
                    card = _a.sent();
                    checkCardExpirationDate(card.expirationDate);
                    checkCardUnblock(card.isBlocked);
                    checkCardPassword(password, card.password);
                    unblockObject = {
                        isBlocked: false
                    };
                    return [4 /*yield*/, cardRepository.update(id, unblockObject)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function calcAmountFromArrObject(arrObj) {
    return arrObj.reduce(function (sum, _a) {
        var amount = _a.amount;
        return sum + amount;
    }, 0);
}
export function balanceCard(id) {
    return __awaiter(this, void 0, void 0, function () {
        var card, recharge, rechargeTotal, payment, paymentTotal, balance, balanceObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkCardRegister(id)];
                case 1:
                    card = _a.sent();
                    return [4 /*yield*/, rechargeRepository.findByCardId(id)];
                case 2:
                    recharge = _a.sent();
                    rechargeTotal = calcAmountFromArrObject(recharge);
                    return [4 /*yield*/, paymentRepository.findByCardId(id)];
                case 3:
                    payment = _a.sent();
                    paymentTotal = calcAmountFromArrObject(payment);
                    balance = rechargeTotal - paymentTotal;
                    balanceObject = {
                        balance: balance,
                        transactions: payment,
                        recharges: recharge
                    };
                    return [2 /*return*/, balanceObject];
            }
        });
    });
}
export function checkIfCardIsActive(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!password) {
                throw new AppError(409, "Card is not active", "Active your card before procede");
            }
            return [2 /*return*/];
        });
    });
}
