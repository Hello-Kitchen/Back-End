import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
/**
 * @class JwtAuthGuard
 * @brief A guard that handles JWT authentication for incoming HTTP requests.
 * 
 * This guard checks if the request contains a valid JWT token in the Authorization header,
 * verifies it, and assigns the decoded token (payload) to the request object.
 */
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    /**
     * @brief Determines whether the request can proceed based on the presence and validity of the JWT token.
     * 
     * @param context ExecutionContext object, which provides details of the current request.
     * @return Promise<boolean> Returns true if the request is allowed to proceed, false otherwise.
     * 
     * @throws UnauthorizedException If no token is found or if the token verification fails.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Extracting the request object from the execution context
        const request = context.switchToHttp().getRequest();

        // Extracting the token from the authorization header
        const token = this.extractTokenFromHeader(request);
        
        // If no token is found, throw an unauthorized exception
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            // Verifying the JWT token with the secret key
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: "secret" // You should replace "secret" with an actual environment variable for security reasons
                }
            );
            
            /**
             * @brief Attaching the decoded token (payload) to the request object.
             * This makes the user information available to route handlers.
             */
            request['user'] = payload;
        } catch {
            // If the token verification fails, throw an unauthorized exception
            throw new UnauthorizedException();
        }
        
        // If everything is valid, return true to allow the request to proceed
        return true;
    }

    /**
     * @brief Extracts the JWT token from the 'Authorization' header.
     * 
     * @param request The incoming HTTP request.
     * @return string | undefined Returns the token if present and properly formatted, otherwise undefined.
     * 
     * This method expects the 'Authorization' header to follow the format: "Bearer <token>".
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // Splitting the 'Authorization' header by space, expecting "Bearer <token>"
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        
        // Returning the token if the type is 'Bearer', otherwise undefined
        return type === 'Bearer' ? token : undefined;
    }
}
