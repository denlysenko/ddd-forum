/*
  Warnings:

  - You are about to drop the column `total_num_comment` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "total_num_comment",
ADD COLUMN     "text" TEXT,
ADD COLUMN     "total_num_comments" INTEGER NOT NULL DEFAULT 0;
