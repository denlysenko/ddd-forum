-- CreateTable
CREATE TABLE "base_user" (
    "base_user_id" UUID NOT NULL,
    "user_email" VARCHAR(250) NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_admin_user" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "username" VARCHAR(250) NOT NULL,
    "user_password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "base_user_pkey" PRIMARY KEY ("base_user_id")
);

-- CreateTable
CREATE TABLE "member" (
    "member_id" UUID NOT NULL,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_base_id" UUID NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "post" (
    "post_id" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "title" TEXT,
    "link" TEXT,
    "slug" VARCHAR(300) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "total_num_comment" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "post_vote" (
    "post_vote_id" UUID NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "post_vote_pkey" PRIMARY KEY ("post_vote_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "parent_comment_id" UUID NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "comment_vote" (
    "comment_vote_id" UUID NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "comment_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "comment_vote_pkey" PRIMARY KEY ("comment_vote_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_user_user_email_key" ON "base_user"("user_email");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_member_base_id_fkey" FOREIGN KEY ("member_base_id") REFERENCES "base_user"("base_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_vote" ADD CONSTRAINT "post_vote_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_vote" ADD CONSTRAINT "post_vote_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_vote" ADD CONSTRAINT "comment_vote_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_vote" ADD CONSTRAINT "comment_vote_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;
