import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
  PORT: number
  JWT_SECRET: string
  // FRONTEND_URL: string
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.string().required(),
  // FRONTEND_URL: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}


const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  // frontendUrl: envVars.FRONTEND_URL,
}


