import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { 
  Edit3, 
  Trash2, 
  Search, 
  Calendar, 
  User, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface BlogListProps {
  onEditPost: (post: any) => void;
  onViewPost: (post: any) => void;
  currentUser: any;
  isAuthenticated: boolean;
}

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    title: "The Future of Web Development",
    content: "<p>In this <strong>comprehensive guide</strong>, we explore the emerging trends and technologies that are shaping the future of web development. From <em>AI-powered tools</em> to new frameworks, the landscape is evolving rapidly.</p><ul><li>React and Next.js innovations</li><li>AI integration in development</li><li>Performance optimization techniques</li></ul>",
    author: "John Doe",
    authorId: 1,
    readabilityScore: 78,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: "Understanding React Hooks",
    content: "<p><strong>React Hooks</strong> have revolutionized how we write React components. This article dives deep into the most commonly used hooks and provides <em>practical examples</em> for each one.</p><blockquote>Hooks let you use state and other React features without writing a class.</blockquote><ol><li>useState Hook</li><li>useEffect Hook</li><li>Custom Hooks</li></ol>",
    author: "Jane Smith",
    authorId: 2,
    readabilityScore: 85,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    content: "<p>Learn how to design and build APIs that can handle <strong>millions of requests</strong>. We cover best practices, performance optimization, and security considerations.</p><p><em>This guide includes real-world examples</em> and practical tips for scaling your backend infrastructure.</p>",
    author: "Mike Johnson",
    authorId: 3,
    readabilityScore: 72,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const BlogList = ({ onEditPost, onViewPost, currentUser, isAuthenticated }: BlogListProps) => {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.replace(/<[^>]*>/g, '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "The blog post has been successfully deleted."
    });
  };

  const canModifyPost = (post: any) => {
    return isAuthenticated && currentUser && post.authorId === currentUser.id;
  };

  const getReadabilityBadge = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { level: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { level: 'Average', color: 'bg-yellow-500' };
    return { level: 'Poor', color: 'bg-red-500' };
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search posts by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 focus:border-blue-500 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchTerm ? `Search Results (${filteredPosts.length})` : `All Posts (${posts.length})`}
        </h2>
        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Blog Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => {
            const readability = getReadabilityBadge(post.readabilityScore);
            const textContent = post.content.replace(/<[^>]*>/g, '');
            
            return (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1 ml-2">
                      <BarChart3 className="h-3 w-3 text-gray-500" />
                      <Badge className={`${readability.color} text-white text-xs`}>
                        {Math.round(post.readabilityScore)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {textContent}
                  </p>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t">
                    <Button
                      onClick={() => onViewPost(post)}
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {canModifyPost(post) && (
                      <>
                        <Button
                          onClick={() => onEditPost(post)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-green-50 hover:border-green-300"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.id)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 space-y-4">
              <Search className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold">No posts found</h3>
              <p>
                {searchTerm 
                  ? `No blog posts match your search for "${searchTerm}"`
                  : "No blog posts have been created yet. Be the first to write one!"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                className={currentPage === page ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                size="sm"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
