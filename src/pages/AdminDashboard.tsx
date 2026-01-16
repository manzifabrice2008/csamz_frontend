import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Image as ImageIcon, Calendar, Tag, Loader2, AlertCircle, Star } from "lucide-react";
import { newsApi, NewsArticle, API_BASE_URL } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/auth";

interface NewsArticle {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_urls: string[];
  published_date: string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>(Array(5).fill(false));
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(Array(5).fill(null));
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(Array(5).fill(null));
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const resolveImageUrl = (url: string | null | undefined) => {
    if (!url || url.trim() === "") return "";
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const base = API_BASE_URL.replace(/\/api$/, "");
    if (url.startsWith("/")) {
      return `${base}${url}`;
    }
    return `${base}/${url}`;
  };

  // Function to upload a single image to the server
  const uploadImage = async (file: File, index: number): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      return data.url; // Assuming the server returns { url: '...' }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    published_date: "",
    category: "",
    excerpt: "",
    content: "",
    image_urls: ["", "", "", "", ""],
  });

  const getFilenameFromUrl = (url: string) => {
    if (!url) return null;
    try {
      const parsed = new URL(url, window.location.origin);
      const pathname = parsed.pathname;
      const segments = pathname.split('/').filter(Boolean);
      return segments.length ? segments[segments.length - 1] : null;
    } catch (error) {
      const cleaned = url.split('?')[0];
      const parts = cleaned.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : null;
    }
  };

  const deleteImageFromServer = async (url: string) => {
    const filename = getFilenameFromUrl(url);
    if (!filename) return;

    try {
      const response = await fetch(`${API_BASE_URL}/upload/image/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        console.warn('Failed to delete image from server', await response.text());
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const response = await newsApi.getAll();
      setArticles(response.articles);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch articles');
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch articles',
        variant: "destructive",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const filteredImageUrls = formData.image_urls
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const submissionData = {
        ...formData,
        image_urls: filteredImageUrls
      };

      if (isEditing && currentArticle) {
        await newsApi.update(currentArticle.id, submissionData);
        toast({
          title: "Success",
          description: "Article updated successfully",
        });

        if (imagesToDelete.length) {
          await Promise.all(imagesToDelete.map((url) => deleteImageFromServer(url)));
        }
      } else {
        await newsApi.create(submissionData);
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }
      resetForm();
      fetchArticles();
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
      toast({
        title: "Error",
        description: err.message || 'Failed to save article',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setIsEditing(true);
    setCurrentArticle(article);
    
    // Initialize with empty image URLs array if none exists
    const articleImageUrls = article.image_urls || [];
    
    // Set form data with article data
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || "",
      category: article.category,
      image_urls: [...articleImageUrls, ...Array(5 - articleImageUrls.length).fill("")].slice(0, 5),
      published_date: article.published_date,
    });
    
    // Set image previews
    const previews = Array(5).fill(null);
    articleImageUrls.forEach((url, index) => {
      if (url) previews[index] = resolveImageUrl(url);
    });
    setImagePreviews(previews);
    
    // Reset uploading states
    setUploadingImages(Array(5).fill(false));
    setInitialImageUrls(articleImageUrls);
    setImagesToDelete([]);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Set uploading state for this image
      const newUploadingStates = [...uploadingImages];
      newUploadingStates[index] = true;
      setUploadingImages(newUploadingStates);
      
      try {
        // Upload the image to the server
        const imageUrl = await uploadImage(file, index);
        
        // Update preview with the uploaded image
        const newPreviews = [...imagePreviews];
        newPreviews[index] = resolveImageUrl(imageUrl);
        setImagePreviews(newPreviews);
        
        // Update form data with the new image URL
        const newImageUrls = [...formData.image_urls];
        newImageUrls[index] = imageUrl;
        setFormData({
          ...formData,
          image_urls: newImageUrls
        });
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        // Reset uploading state
        const resetUploadingStates = [...uploadingImages];
        resetUploadingStates[index] = false;
        setUploadingImages(resetUploadingStates);
      }
    }
  };
  
  const removeImage = async (index: number) => {
    const newImageUrls = [...formData.image_urls];
    const removedUrl = newImageUrls[index];
    newImageUrls[index] = "";
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    
    setFormData({
      ...formData,
      image_urls: newImageUrls
    });
    setImagePreviews(newPreviews);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }

    if (removedUrl) {
      if (isEditing && currentArticle && initialImageUrls.includes(removedUrl)) {
        setImagesToDelete((prev) => (prev.includes(removedUrl) ? prev : [...prev, removedUrl]));
      } else {
        await deleteImageFromServer(removedUrl);
      }
    }
  };

  const setAsPrimaryImage = (index: number) => {
    if (index <= 0) return;

    const updatedImageUrls = [...formData.image_urls];
    const [selectedUrl] = updatedImageUrls.splice(index, 1);
    updatedImageUrls.unshift(selectedUrl);

    const updatedPreviews = [...imagePreviews];
    const [selectedPreview] = updatedPreviews.splice(index, 1);
    updatedPreviews.unshift(selectedPreview);

    setFormData({
      ...formData,
      image_urls: [...updatedImageUrls]
    });
    setImagePreviews([...updatedPreviews]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }
    
    try {
      setLoading(true);
      await newsApi.delete(id);
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      await fetchArticles();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete article',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentArticle(null);
    setFormData({
      title: "",
      published_date: "",
      category: "",
      excerpt: "",
      content: "",
      image_urls: ["", "", "", "", ""],
    });
    setImagePreviews(Array(5).fill(null));
    setUploadingImages(Array(5).fill(false));
    setInitialImageUrls([]);
    setImagesToDelete([]);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <AdminLayout>
      <section className="p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fadeInDown">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">News Management</span>
            </h1>
            <p className="text-muted-foreground">
              Manage news articles and updates
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="shadow-lg hover-lift animate-fadeInLeft">
              <CardHeader>
                <CardTitle className="text-2xl text-school-primary dark:text-school-accent flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  {isEditing ? "Edit News Article" : "Add New Article"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Article Title
                    </label>
                    <Input
                      placeholder="Enter article title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </label>
                      <Input
                        type="date"
                        value={formData.published_date}
                        onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full p-2 border rounded-md bg-background text-foreground"
                      >
                        <option value="">Select category</option>
                        <option value="Achievements">Achievements</option>
                        <option value="Facilities">Facilities</option>
                        <option value="Partnerships">Partnerships</option>
                        <option value="Events">Events</option>
                        <option value="Announcements">Announcements</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      News Images (Up to 5)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="relative">
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="block cursor-pointer border-2 border-dashed rounded-md p-4 w-full h-48 flex flex-col items-center justify-center hover:bg-accent/20 transition-colors"
                          >
                            {uploadingImages[index] ? (
                              <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                              </div>
                            ) : imagePreviews[index] ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={imagePreviews[index] || ""}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground mx-auto" />
                                <p className="text-xs text-muted-foreground">
                                  Image {index + 1}
                                </p>
                              </div>
                            )}
                            <input
                              id={`image-upload-${index}`}
                              name={`image-upload-${index}`}
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleImageChange(e, index)}
                              accept="image/*"
                              ref={el => fileInputRefs.current[index] = el}
                            />
                          </label>
                          {!uploadingImages[index] && formData.image_urls[index] && (
                            <div className="absolute top-2 right-2 flex gap-2 z-20">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setAsPrimaryImage(index);
                                  }}
                                  className="bg-amber-500 text-white rounded-full p-1 hover:bg-amber-600 transition-colors"
                                  title="Set as primary image"
                                >
                                  <Star className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  removeImage(index);
                                }}
                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Upload up to 5 images (PNG, JPG, GIF up to 5MB each)
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Excerpt
                    </label>
                    <Textarea
                      placeholder="Enter article excerpt..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                      disabled={loading}
                      className="h-24"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Full Content (Optional)
                    </label>
                    <Textarea
                      placeholder="Enter full article content..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      disabled={loading}
                      className="h-32"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isEditing ? "Updating..." : "Publishing..."}
                        </>
                      ) : (
                        isEditing ? "Update Article" : "Publish Article"
                      )}
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Articles List Section */}
            <div className="animate-fadeInRight">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-school-primary dark:text-school-accent">
                    Published Articles ({articles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fetchLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                      <span className="ml-2 text-muted-foreground">Loading articles...</span>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-red-500">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <p>{error}</p>
                      <Button onClick={fetchArticles} variant="outline" className="mt-4">
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {articles.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No articles yet. Create your first article!
                        </p>
                      ) : (
                        articles.map((article, index) => (
                        <Card
                          key={article.id}
                          className={`hover-lift animate-scaleIn delay-${(index + 1) * 100}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {(() => {
                                const firstImage = article.image_urls?.find((url) => url && url.trim().length > 0);
                                const resolved = firstImage ? resolveImageUrl(firstImage) : "";
                                if (!resolved) {
                                  return (
                                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                      No Image
                                    </div>
                                  );
                                }
                                return (
                                  <img
                                    src={resolved}
                                    alt={article.title}
                                    className="w-24 h-24 object-cover rounded-lg"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                                    }}
                                  />
                                );
                              })()}
                              <div className="flex-1">
                                <h3 className="font-bold text-foreground mb-1">
                                  {article.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(article.published_date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {article.category}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {article.excerpt}
                                </p>
                                {article.author_name && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    By: {article.author_name}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(article)}
                                  disabled={loading}
                                  className="hover:bg-school-primary hover:text-white"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(article.id)}
                                  disabled={loading}
                                  className="hover:bg-red-500 hover:text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
