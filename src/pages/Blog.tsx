import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, PenSquare } from "lucide-react";
import { blogApi, BlogPost, API_BASE_URL } from "@/services/api";

const resolveImageUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE_URL.replace(/\/api$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getPublished();
        setPosts(response.posts);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          Loading blog posts...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Blog</p>
            <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
            <Button
              className="mt-4"
              onClick={() => {
                setError(null);
                setLoading(true);
                blogApi
                  .getPublished()
                  .then((response) => {
                    setPosts(response.posts);
                    setError(null);
                  })
                  .catch((err: any) => {
                    setError(err.message || "Failed to load blog posts");
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          No blog posts available yet. Please check back soon.
        </div>
      );
    }

    return (
      <div className="grid gap-10 lg:grid-cols-3 relative z-10">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift animate-fadeInUp"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={resolveImageUrl(post.cover_image) || DEFAULT_IMAGE}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <PenSquare className="w-3.5 h-3.5" />
                  {post.author_name || "CSAM Team"}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-foreground leading-tight">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
              <Button variant="outline" className="w-full group justify-between" disabled>
                Continue Reading
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-24 left-12 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-24 right-12 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <section className="relative z-10">
          <header className="text-center max-w-3xl mx-auto mb-12 animate-fadeInDown">
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-school-primary dark:text-school-accent font-semibold bg-school-primary/10 dark:bg-school-accent/10 px-4 py-1 rounded-full mb-4">
              <PenSquare className="w-4 h-4" />
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Stories & Insights from CSAM Zaccaria
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore highlights from our classrooms, workshops, and community engagements. Stay inspired with success stories,
              tips, and resources curated for students, parents, and partners.
            </p>
          </header>

          {renderContent()}

          <section className="mt-16 bg-muted/50 rounded-3xl p-8 md:p-12 text-center animate-fadeInUp delay-200">
            <h2 className="text-3xl font-bold mb-4">Share Your Story</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Have a memorable CSAM experience or insight? We welcome contributions from students, alumni, and staff. Submit
              your story and inspire the next generation of innovators.
            </p>
            <Button size="lg" className="bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90">
              Submit an Article
            </Button>
          </section>
        </section>
      </main>
    </Layout>
  );
}
