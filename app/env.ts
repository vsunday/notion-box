// environment schema with zod
import { z } from 'zod';

const envSchema = z.object({
  NOTION_TOKEN: z.string(),
  NOTION_DATABASE_ID: z.string(),
  BOX_CLIENT_ID: z.string(),
  BOX_CLIENT_SECRET: z.string(),
  BOX_ENTERPRISE_ID: z.string(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) { 
  console.error('Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

const parsedEnv = env.data;

export default parsedEnv;