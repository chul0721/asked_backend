"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD = exports.PORT = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.PORT = process.env.PORT || 4040;
exports.PASSWORD = process.env.SECRET_KEY || 'secret';
//# sourceMappingURL=constant.js.map