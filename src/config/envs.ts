import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
  PORT: number
  JWT_SECRET: string
  FRONTEND_URL: string
  SEND_EMAIL: boolean
  MAILER_SERVICE: string
  MAILER_EMAIL: string
  MAILER_SECRET_KEY: string
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.string().required(),
  FRONTEND_URL: joi.string().required(),
  SEND_EMAIL: joi.boolean().required(),
  MAILER_SERVICE: joi.string().required(),
  MAILER_EMAIL: joi.string().required(),
  MAILER_SECRET_KEY: joi.string().required()
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
  frontendUrl: envVars.FRONTEND_URL,
  sendEmail: envVars.SEND_EMAIL,
  mailerService: envVars.MAILER_SERVICE,
  mailerEmail: envVars.MAILER_EMAIL,
  mailerSecretKey: envVars.MAILER_SECRET_KEY
}


