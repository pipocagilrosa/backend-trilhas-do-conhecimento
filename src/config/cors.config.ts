import { Logger } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export default (): CorsOptions => {
  const LOGGER = new Logger('CorsConfiguration');
  Logger.log(
    `Loading CORS Configuration for '${process.env.NODE_ENV}' environment`,
  );

  // Domínios permitidos
  const allowedOrigins = [
    'https://trilha-de-conhecimento.netlify.app',
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:4000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4000',
  ];

  const corsPolicy: CorsOptions = {
    origin: (origin, callback) => {
      // Permite requests sem origin (ex: ferramentas internas, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin'],
  };

  LOGGER.log(
    `Cors application config instanciated as: ${JSON.stringify({ ...corsPolicy, origin: '[Function]' })}`,
  );
  return corsPolicy;
};