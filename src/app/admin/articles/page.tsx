import { db } from "@/db"
import { articles } from "@/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { Plus, PencilSimple, ArrowSquareOut, Article, ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { DeleteArticleButton } from "./delete-article-button"

export default async function ArticlesPage() {
  const allArticles = await db.select().from(articles).orderBy(desc(articles.publishedAt))

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <div>
        <Link href="/admin" className="hidden md:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Articles</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage links to your external blog posts.</p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" weight="bold" />
          New Article
        </Link>
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl overflow-x-auto overflow-y-hidden">
        {allArticles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Article className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">No articles found. Add your first external link!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Publisher</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Published</th>
                <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allArticles.map((article) => (
                <tr key={article.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 w-fit">
                      {new URL(article.url).hostname} <ArrowSquareOut className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-medium bg-muted text-muted-foreground rounded-md">
                      {article.publisher}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                      >
                        <PencilSimple className="w-5 h-5" />
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
