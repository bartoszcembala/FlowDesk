/*
  Warnings:

  - You are about to drop the `WorkspaceMember` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkspaceMember" DROP CONSTRAINT "WorkspaceMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceMember" DROP CONSTRAINT "WorkspaceMember_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "WorkspaceMember";

-- DropEnum
DROP TYPE "WorkspaceRole";

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
