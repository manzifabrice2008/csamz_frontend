import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, Tag, Loader2, ArrowLeft, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  image_urls?: string[];
  published_date: string;
  author_name?: string;
  created_at: string;
}

const resolveImageUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE_URL.replace(/\/api$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isManuallyNavigating, setIsManuallyNavigating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`);
      const data = await response.json();

      if (data.success) {
        setArticle(data.article);
        setActiveImageIndex(0);
        // Fetch latest news after getting the article
        fetchLatestNews();
      } else {
        setError("Article not found");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      const data = await response.json();

      if (data.success) {
        // Filter out current article and get latest 3
        const filtered = data.articles
          .filter((article: NewsArticle) => article.id !== parseInt(id || "0"))
          .slice(0, 3);
        setLatestNews(filtered);
      }
    } catch (err) {
      console.error("Error fetching latest news:", err);
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

  const articleImages = useMemo(() => {
    if (!article) return [];
    const combined = [
      article.image_url,
      ...(article.image_urls || [])
    ].filter((url, index, self) => url && url.trim() !== "" && self.indexOf(url) === index);
    return combined.map((url) => resolveImageUrl(url));
  }, [article]);

  useEffect(() => {
    if (!articleImages.length) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % articleImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articleImages.length]);

  const handleManualNavigation = (nextIndex: number) => {
    setIsManuallyNavigating(true);
    setActiveImageIndex(nextIndex);
    setTimeout(() => setIsManuallyNavigating(false), 100);
  };

  if (loading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-school-primary dark:text-school-accent mb-4" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Article</p>
              <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
              <Button
                onClick={() => navigate('/news')}
                className="mt-4"
              >
                Back to News
              </Button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6 hover:bg-school-primary/10 dark:hover:bg-school-accent/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>

          <article className="bg-card rounded-lg overflow-hidden shadow-xl animate-fadeInUp">
            {/* Image Carousel */}
            <div className="bg-muted">
              <div className="relative h-96 overflow-hidden">
                {articleImages.length > 0 ? (
                  articleImages.map((imgSrc, index) => (
                    <img
                      key={`${article.id}-img-${index}`}
                      src={imgSrc || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop"}
                      alt={`${article.title} image ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === activeImageIndex ? "opacity-100" : "opacity-0"}`}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop";
                      }}
                    />
                  ))
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop"
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {articleImages.length > 1 && (
                  <>
                    <button
                      onClick={() => handleManualNavigation((activeImageIndex - 1 + articleImages.length) % articleImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all"
                      aria-label="Previous image"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleManualNavigation((activeImageIndex + 1) % articleImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-all"
                      aria-label="Next image"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {articleImages.length > 1 && (
                <div className="flex items-center justify-center gap-3 py-4 bg-card/80 backdrop-blur">
                  {articleImages.map((imgSrc, index) => (
                    <button
                      key={`${article.id}-dot-${index}`}
                      onClick={() => handleManualNavigation(index)}
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${index === activeImageIndex ? "bg-school-primary dark:bg-school-accent scale-110" : "bg-muted-foreground/40"}`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="p-8 md:p-12">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 bg-school-primary/10 dark:bg-school-accent/10 px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_date)}
                </span>
                <span className="flex items-center gap-2 bg-school-primary/10 dark:bg-school-accent/10 px-3 py-1 rounded-full">
                  <Tag className="h-4 w-4" />
                  {article.category}
                </span>
                {article.author_name && (
                  <span className="flex items-center gap-2 bg-school-primary/10 dark:bg-school-accent/10 px-3 py-1 rounded-full">
                    <User className="h-4 w-4" />
                    {article.author_name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground mb-8 italic border-l-4 border-school-primary dark:border-school-accent pl-4">
                {article.excerpt}
              </p>

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {article.content || article.excerpt}
                </div>
              </div>

              {/* Divider */}
              <div className="mt-12 pt-8 border-t border-border">
                <Button
                  onClick={() => navigate('/news')}
                  className="w-full md:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to All News
                </Button>
              </div>
            </div>
          </article>

          {/* Latest News Section */}
          {latestNews.length > 0 && (
            <div className="mt-12 animate-fadeInUp delay-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                  Latest News
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/news')}
                  className="hover:bg-school-primary/10 dark:hover:bg-school-accent/10"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {latestNews.map((newsArticle) => (
                  <article
                    key={newsArticle.id}
                    className="bg-card rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift cursor-pointer"
                    onClick={() => {
                      navigate(`/news/${newsArticle.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={resolveImageUrl(newsArticle.image_url) || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop"}
                        alt={newsArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(newsArticle.published_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {newsArticle.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground hover:text-school-primary dark:hover:text-school-accent transition-colors line-clamp-2 mb-2">
                        {newsArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {newsArticle.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
