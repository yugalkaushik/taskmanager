/*
  Warnings:

  - Added the required column `orgId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_inviteCode_key" ON "Organization"("inviteCode");

-- Insert default organization
INSERT INTO "Organization" (id, name, "inviteCode") VALUES ('default-org', 'Default Organization', 'default-invite-code');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "orgId" TEXT NOT NULL DEFAULT 'default-org';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "orgId" TEXT NOT NULL DEFAULT 'default-org';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
