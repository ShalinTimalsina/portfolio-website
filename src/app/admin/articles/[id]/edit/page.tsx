import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "../../article-form";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);

  if (!article) {
    notFound();
  }

  // Format date for the input type="date"
  const publishedAtDate = new Date(article.publishedAt);
  const formattedDate = publishedAtDate.toISOString().split('T')[0];

  return (
    <ArticleForm 
      initialData={{
        id: article.id,
        title: article.title,
        url: article.url,
        publisher: article.publisher,
        publishedAt: formattedDate,
      }} 
    />
  );
}
