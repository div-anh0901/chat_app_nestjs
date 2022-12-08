import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class ThrottlerBehindProxyGurad extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): string {
        return req.ips.length ? req.ips[0] : req.ips;
    }
}