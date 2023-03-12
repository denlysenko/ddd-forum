import type { FastifyReply, FastifyRequest } from 'fastify';
import { isProduction } from '../../../../config';
import type { IAuthService } from '../../../../modules/users/services/authService';

export class Hooks {
  #authService: IAuthService;

  constructor(authService: IAuthService) {
    this.#authService = authService;
  }

  includeDecodedTokenIfExists() {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const token = req.headers['authorization'];
      // Confirm that the token was signed with our signature.
      if (token) {
        const decoded = await this.#authService.decodeJWT(token);
        const signatureFailed = !!decoded === false;

        if (signatureFailed) {
          return reply.unauthorized('Token signature expired.');
        }

        // See if the token was found
        const { username } = decoded;
        const tokens = await this.#authService.getTokens(username);

        // if the token was found, just continue the request.
        if (tokens.length !== 0) {
          req.user = decoded;
        }
      }
    };
  }

  ensureAuthenticated() {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const token = req.headers['authorization'];
      // Confirm that the token was signed with our signature.
      if (token) {
        const decoded = await this.#authService.decodeJWT(token);
        const signatureFailed = !!decoded === false;

        if (signatureFailed) {
          return reply.unauthorized('Token signature expired.');
        }

        // See if the token was found
        const { username } = decoded;
        const tokens = await this.#authService.getTokens(username);

        // if the token was found, just continue the request.
        if (tokens.length !== 0) {
          req.user = decoded;
        } else {
          return reply.unauthorized(
            'Auth token not found. User is probably not logged in. Please login again.'
          );
        }
      } else {
        return reply.unauthorized('No access token provided');
      }
    };
  }

  // public static createRateLimit (mins: number, maxRequests: number) {
  //   return rateLimit({
  //     windowMs: mins * 60 * 1000,
  //     max: maxRequests,
  //   })
  // }

  static restrictedUrl(req, res, next) {
    if (!isProduction) {
      return next();
    }

    const approvedDomainList = ['https://khalilstemmler.com'];

    const domain = req.headers.origin;

    const isValidDomain = !!approvedDomainList.find((d) => d === domain);
    console.log(`Domain =${domain}, valid?=${isValidDomain}`);

    if (!isValidDomain) {
      return res.status(403).json({ message: 'Unauthorized' });
    } else {
      return next();
    }
  }
}
