import { Logger } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export default (): CorsOptions => {
    const LOGGER = new Logger('CorsConfiguration');
    Logger.log(
      `Loading CORS Configuration for '${process.env.NODE_ENV}' environment`,
    );
    const addLocalHostsToCorsPolicy = process.env.ADD_LOCALHOST_TO_CORS_POLICY;
    const localHosts = ['*','http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://localhost:3004', 'https://magical-licorice-a74288.netlify.app/', 'https://magical-licorice-a74288.netlify.app', 'http://localhost:4000', 'http://localhost:4200'];
  
    const allowOrigins = new Set<string>(
      JSON.parse(process.env.FRONTEND_HOST || '[]'),
    );
  
    if (addLocalHostsToCorsPolicy === 'true') {
      LOGGER.warn('Local front-end app hosts added to allow cors policy.');
      localHosts.forEach((it) => allowOrigins.add(it));
    }
  
    const corsPolicy = {
      origin: "*",
      methods: "*",
      allowedHeaders: "*",
      credentials: true,
      exposedHeaders: ['Access-Control-Allow-Origin'],
    };
  
    LOGGER.log(
      `Cors application config instanciated as: ${JSON.stringify(corsPolicy)}`,
    );
    return corsPolicy;
  };