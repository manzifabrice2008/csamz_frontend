import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, Tag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  image_urls?: string[];
  published_date: string;
  author_name?: string;
}

const resolveImageUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return "";
  if (/^https?:\/\//i.test(url)) return url;

  const base = API_BASE_URL.replace(/\/api$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

export default function News() {
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      const data = await response.json();

      if (data.success) {
        setNewsArticles(data.articles);
      } else {
        setError("Failed to load news articles");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 animate-fadeInDown">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Latest News & Updates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
              Stay informed about events, achievements, and developments at CSAM Zaccaria
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-school-primary dark:text-school-accent mb-4" />
              <p className="text-muted-foreground">Loading news articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading News</p>
                <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
                <button
                  onClick={fetchNews}
                  className="mt-4 px-4 py-2 bg-school-primary dark:bg-school-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
                <p className="text-muted-foreground text-lg">No news articles available yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for updates!</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsArticles.map((article, index) => {
                const animationDelay = `delay-${(index + 1) * 100}`;
                return (
                  <article key={article.id} className={`bg-card rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift animate-fadeInUp ${animationDelay} transform hover:scale-105`}>
                    <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                      {(() => {
                        const primary = article.image_urls?.find((url) => url && url.trim().length > 0) || article.image_url;
                        const resolved = resolveImageUrl(primary);
                        const fallback = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop";
                        return (
                          <img
                            src={resolved || fallback}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = fallback;
                            }}
                          />
                        );
                      })()}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 hover:text-school-primary dark:hover:text-school-accent transition-colors">
                          <Calendar className="h-4 w-4" />
                          {formatDate(article.published_date)}
                        </span>
                        <span className="flex items-center gap-1 hover:text-school-primary dark:hover:text-school-accent transition-colors">
                          <Tag className="h-4 w-4" />
                          {article.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 text-foreground hover:text-school-primary dark:hover:text-school-accent transition-colors cursor-pointer" onClick={() => navigate(`/news/${article.id}`)}>
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-3 mb-4">{article.excerpt}</p>
                      {article.author_name && (
                        <p className="text-xs text-muted-foreground mb-4 italic">
                          By {article.author_name}
                        </p>
                      )}
                      <Button
                        onClick={() => navigate(`/news/${article.id}`)}
                        variant="outline"
                        className="w-full group hover:bg-school-primary hover:text-white dark:hover:bg-school-accent transition-all"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
