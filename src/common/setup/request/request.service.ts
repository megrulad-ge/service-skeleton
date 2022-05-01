import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import * as Joi from 'joi';

@Injectable()
export class RequestService {
  private static readonly REQUEST_ID_HEADER = 'x-request-id';
  private static readonly validationSchema = Joi.string().uuid({
    version: 'uuidv4',
  });

  public constructor(private readonly request: Request) {}

  private static forgeReqId(): string {
    return uuidv4();
  }

  public static hasRequestId(request: Request): boolean {
    const reqId = request.get(RequestService.REQUEST_ID_HEADER);
    if (!reqId) return false;

    return !RequestService.validationSchema.validate(reqId).error;
  }

  public static injectRequestId(request: Request): void {
    request.headers[RequestService.REQUEST_ID_HEADER] =
      RequestService.forgeReqId();
  }

  public getRequestId(): string {
    return this.request.headers[RequestService.REQUEST_ID_HEADER] as string;
  }
}
