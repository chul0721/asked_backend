"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asked = void 0;
const fastify_1 = require("fastify");
const cors_1 = require("@fastify/cors");
const client_1 = require("@prisma/client");
const constant_1 = require("./constant");
require("dotenv/config");
const http = require("http");
const functions = require("firebase-functions");
const prisma = new client_1.PrismaClient();
let handleRequest = null;
const serverFactory = (handler, opts) => {
    handleRequest = handler;
    return http.createServer();
};
const app = (0, fastify_1.default)({ serverFactory });
app.register(cors_1.default, { origin: '*' });
app.get('/data', async () => {
    const questions = await prisma.question.findMany().catch((err) => {
        console.log(err);
        throw err;
    });
    return {
        data: questions
    };
});
app.post('/regist', async (req, res) => {
    const { content } = req.body;
    const ip = req.ip;
    if (!content)
        return res.send({ success: false, error: 'content is required' });
    if (content.length > 200)
        return res.send({ success: false, error: 'content should be under 200' });
    console.log(content);
    const question = await prisma.question
        .create({
        data: {
            content,
            address: ip
        }
    })
        .catch((err) => {
        console.log(err);
        throw err;
    });
    return {
        data: question
    };
});
app.post('/anwser', async (req, res) => {
    const { id, answer } = req.body;
    const password = req.headers.authorization;
    if (!id)
        return res.send({ success: false, error: 'id is required' });
    if (!answer)
        return res.send({ success: false, error: 'answer is required' });
    if (!password)
        return res.send({ success: false, error: 'password is required' });
    if (password !== constant_1.PASSWORD)
        return res.send({ success: false, error: 'password is incorrect' });
    console.log(answer);
    const question = await prisma.question
        .update({
        where: {
            id
        },
        data: {
            answer,
            isAnswered: true
        }
    })
        .catch((err) => {
        console.log(err);
        throw err;
    });
    return res.send({ data: question });
});
exports.asked = functions.https.onRequest((req, res) => {
    app.ready((err) => {
        if (err)
            throw err;
        handleRequest(req, res);
    });
});
//# sourceMappingURL=index.js.map