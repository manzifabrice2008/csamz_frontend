import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { blogApi, BlogPost, CreateBlogPostData, API_BASE_URL } from "@/services/api";
import { Loader2, Plus, Edit, Trash2, RefreshCw, Image as ImageIcon, X } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

interface BlogFormState {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published_date: string;
  is_published: boolean;
}

const defaultFormState: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  published_date: new Date().toISOString().slice(0, 10),
  is_published: true,
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const resolveImageUrl = (url?: string | null) => {
  if (!url || url.trim() === "") return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE_URL.replace(/\/api$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<BlogFormState>(defaultFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter((post) =>
      [post.title, post.slug, post.excerpt, post.author_name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [posts, searchTerm]);

  const handleFetchPosts = async () => {
    try {
      setFetching(true);
      const response = await blogApi.adminList();
      setPosts(response.posts);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load blog posts");
      toast({
        title: "Error",
        description: err.message || "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    handleFetchPosts();
  }, []);

  const resetForm = () => {
    setFormState(defaultFormState);
    setIsEditing(false);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormState({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || "",
      published_date: post.published_date,
      is_published: post.is_published,
    });
    setCoverPreview(resolveImageUrl(post.cover_image));
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete blog post "${post.title}"?`)) {
      return;
    }
    try {
      setLoading(true);
      await blogApi.delete(post.id);
      toast({
        title: "Deleted",
        description: "Blog post removed successfully.",
      });
      handleFetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload: CreateBlogPostData = {
        title: formState.title,
        slug: formState.slug,
        excerpt: formState.excerpt,
        content: formState.content,
        cover_image: formState.cover_image.trim(),
        published_date: formState.published_date,
        is_published: formState.is_published,
      };

      if (formState.id) {
        await blogApi.update(formState.id, payload);
        toast({
          title: "Updated",
          description: "Blog post updated successfully.",
        });
      } else {
        await blogApi.create(payload);
        toast({
          title: "Created",
          description: "Blog post created successfully.",
        });
      }

      resetForm();
      handleFetchPosts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BlogFormState, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTitleChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      title: value,
      slug: prev.id ? prev.slug : generateSlug(value),
    }));
  };

  const uploadCoverImage = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}` || "",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result.url;
  };

  const handleCoverSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];

    setUploadingCover(true);
    try {
      const imageUrl = await uploadCoverImage(file);
      setFormState((prev) => ({
        ...prev,
        cover_image: imageUrl,
      }));
      setCoverPreview(resolveImageUrl(imageUrl));
      toast({
        title: "Uploaded",
        description: "Cover image uploaded successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const clearCoverImage = () => {
    setFormState((prev) => ({
      ...prev,
      cover_image: "",
    }));
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {isEditing ? "Edit Blog Post" : "Create Blog Post"}
              </h1>
              <p className="text-muted-foreground">
                Manage stories, insights, and updates for the CSAM blog.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleFetchPosts} disabled={fetching}>
              <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {isEditing ? "Update Blog Post" : "New Blog Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={formState.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter blog post title"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <Input
                      value={formState.slug}
                      onChange={(e) => handleChange("slug", generateSlug(e.target.value))}
                      placeholder="unique-slug"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Published Date</label>
                    <Input
                      type="date"
                      value={formState.published_date}
                      onChange={(e) => handleChange("published_date", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="is_published"
                      checked={formState.is_published}
                      onCheckedChange={(checked) => handleChange("is_published", checked)}
                      disabled={loading}
                    />
                    <label htmlFor="is_published" className="text-sm font-medium">
                      Published
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <Textarea
                    value={formState.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    placeholder="Short summary that appears on the blog listing..."
                    required
                    disabled={loading}
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Cover Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative w-48 h-32 border border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted/40">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                            setCoverPreview(null);
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground text-sm">
                          <ImageIcon className="w-6 h-6 mb-2" />
                          <span>No image</span>
                        </div>
                      )}
                      {uploadingCover && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                      {coverPreview && !uploadingCover && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                          onClick={clearCoverImage}
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverSelect}
                        ref={coverInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={loading || uploadingCover}
                        className="w-full sm:w-auto"
                      >
                        {uploadingCover ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                          </>
                        ) : (
                          "Upload Cover Image"
                        )}
                      </Button>
                      {formState.cover_image && (
                        <Input
                          value={formState.cover_image}
                          readOnly
                          className="w-full sm:w-72 text-xs text-muted-foreground"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={formState.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="Write the full blog content here..."
                    required
                    disabled={loading}
                    className="min-h-[240px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      isEditing ? "Update Post" : "Create Post"
                    )}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-2xl">Existing Posts</CardTitle>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  <span>Loading posts...</span>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500 font-medium">{error}</p>
                  <Button variant="outline" className="mt-4" onClick={handleFetchPosts}>
                    Retry
                  </Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No blog posts yet. Create your first article above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="font-semibold text-foreground">{post.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </div>
                          </TableCell>
                          <TableCell>{post.slug}</TableCell>
                          <TableCell>{post.is_published ? "Published" : "Draft"}</TableCell>
                          <TableCell>
                            {new Date(post.published_date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>{post.author_name || "—"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEdit(post)}
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(post)}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
