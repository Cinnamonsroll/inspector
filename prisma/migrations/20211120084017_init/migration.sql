-- CreateTable
CREATE TABLE "Guild" (
    "id" VARCHAR(255) NOT NULL,
    "link_whitelist" TEXT[],

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);
