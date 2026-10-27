import "dotenv/config";
import { deriveDatabaseUrl } from "./databaseUrl";

// Импортируется первым в e2eServer.ts: config.ts и Prisma должны увидеть адрес E2E-базы
process.env.DATABASE_URL = deriveDatabaseUrl("_e2e");
