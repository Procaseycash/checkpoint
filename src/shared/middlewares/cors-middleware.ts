import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class CorsMiddleware implements NestMiddleware {
    resolve(): ExpressMiddleware {
        return (req, res, next) => {
            // list os domains
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'MERCHANT_SECRET, MERCHANT_KEY, API-KEY, API_KEY, User-Agent, Accept-Encoding, Origin, Accept, Accept-Language, Content-Language, Content-Type, Authorization, x-forwarded-by, Last-Event-ID, DPR, Save-Data, Viewport-Width, Width');
            res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,OPTIONS,DELETE');
            if (req.method === 'OPTIONS') res.sendStatus(200);
            else next();
        };
    }
}