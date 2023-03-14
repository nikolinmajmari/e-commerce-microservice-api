import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {ConfigService} from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.get<string>("AUTH0_ISSUER_URL")}`
            }),
            jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: [configService.get<string>("AUTH0_AUDIENCE")],
            issuer: configService.get<string>("AUTH0_ISSUER_URL"),
            algorithms: ["RS256"]
        })
    }

    validate(payload:unknown):unknown{
        return payload;
    }
}