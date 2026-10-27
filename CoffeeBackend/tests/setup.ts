import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/prisma/client";
import { resetDatabase } from "./helpers";

// Каждый тест начинается с пустой базы
beforeEach(resetDatabase);

afterAll(() => prisma.$disconnect());
