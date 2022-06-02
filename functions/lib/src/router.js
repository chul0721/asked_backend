"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
router.get('/data', async (ctx) => {
    const questions = await constant_1.prisma.question.findMany().catch((err) => {
        throw err;
    });
    ctx.body = JSON.stringify({
        data: questions
    });
});
router.post('/regist', async (ctx) => {
    const { content } = ctx.req.body;
    const ip = ctx.req.ip;
    if (!content)
        return (ctx.body = JSON.stringify({ success: false, error: 'content is required' }));
    if (content.length > 200)
        return (ctx.body = JSON.stringify({ success: false, error: 'content should be under 200' }));
    const question = await constant_1.prisma.question
        .create({
        data: {
            content,
            address: ip
        }
    })
        .catch((err) => {
        return (ctx.body = JSON.stringify({ success: false, error: err }));
    });
    return (ctx.body = JSON.stringify({ data: question }));
});
router.post('/anwser', async (ctx) => {
    const { id, answer } = ctx.req.body;
    const password = ctx.request.headers.authorization;
    if (!id)
        return (ctx.body = JSON.stringify({ success: false, error: 'id is required' }));
    if (!answer)
        return (ctx.body = JSON.stringify({ success: false, error: 'answer is required' }));
    if (!password)
        return (ctx.body = JSON.stringify({ success: false, error: 'password is required' }));
    if (password !== constant_1.PASSWORD)
        return (ctx.body = JSON.stringify({ success: false, error: 'password is incorrect' }));
    console.log(answer);
    const question = await constant_1.prisma.question
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
    return (ctx.body = JSON.stringify({
        data: question
    }));
});
exports.default = router;
//# sourceMappingURL=router.js.map