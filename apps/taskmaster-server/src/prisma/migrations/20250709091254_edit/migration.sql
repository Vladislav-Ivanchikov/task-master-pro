-- AlterTable
ALTER TABLE "TaskNote" ADD COLUMN     "fileId" TEXT;

-- AddForeignKey
ALTER TABLE "TaskNote" ADD CONSTRAINT "TaskNote_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "TaskFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
