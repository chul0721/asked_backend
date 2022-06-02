"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = exports.StatusError = void 0;
class StatusError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.StatusError = StatusError;
class Middleware {
    static fbRewriteFix(prefix) {
        return (ctx, next) => {
            console.log(ctx.url);
            if (ctx.url.startsWith(prefix)) {
                const orig = ctx.url;
                ctx.url = ctx.url.replace(prefix, '');
                return next().then(() => {
                    ctx.url = orig;
                });
            }
            return next();
        };
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map