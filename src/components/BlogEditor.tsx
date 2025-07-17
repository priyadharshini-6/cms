
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { calculateReadabilityScore } from '@/utils/readabilityCalculator';
import { Save, X, FileText, BarChart3 } from 'lucide-react';

interface BlogEditorProps {
  post?: any;
  currentUser: any;
  onSave: () => void;
  onCancel: () => void;
}

export const BlogEditor = ({ post, currentUser, onSave, onCancel }: BlogEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [readabilityScore, setReadabilityScore] = useState(0);

  useEffect(() => {
    if (content) {
      const score = calculateReadabilityScore(content);
      setReadabilityScore(score);
    }
  }, [content]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your blog post",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please write some content for your blog post",
        variant: "destructive"
      });
      return;
    }

    if (content.trim().length < 50) {
      toast({
        title: "Content Too Short",
        description: "Blog post content should be at least 50 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const blogPost = {
        id: post?.id || Date.now(),
        title: title.trim(),
        content: content.trim(),
        author: currentUser.name,
        authorId: currentUser.id,
        readabilityScore,
        createdAt: post?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving blog post:', blogPost);
      
      toast({
        title: post ? "Post Updated!" : "Post Created!",
        description: `Your blog post "${title}" has been ${post ? 'updated' : 'published'} successfully.`
      });
      
      setIsLoading(false);
      onSave();
    }, 1000);
  };

  const getReadabilityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { level: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { level: 'Average', color: 'bg-yellow-500' };
    return { level: 'Needs Improvement', color: 'bg-red-500' };
  };

  const readability = getReadabilityLevel(readabilityScore);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">
                {post ? 'Edit Blog Post' : 'Create New Blog Post'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <Badge className={`${readability.color} text-white`}>
                {readability.level} ({Math.round(readabilityScore)}/100)
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter an engaging title for your blog post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg py-3 border-2 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg font-semibold text-gray-700">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Write your blog post content here... Share your thoughts, ideas, and stories with the world!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="text-base leading-relaxed border-2 focus:border-blue-500 transition-colors resize-none"
            />
            <div className="text-sm text-gray-500 flex justify-between">
              <span>{content.length} characters</span>
              <span>{content.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
            </div>
          </div>

          {content && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Readability Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="ml-2 font-semibold">{Math.round(readabilityScore)}/100</span>
                </div>
                <div>
                  <span className="text-gray-600">Level:</span>
                  <span className="ml-2 font-semibold">{readability.level}</span>
                </div>
                <div>
                  <span className="text-gray-600">Grade:</span>
                  <span className="ml-2 font-semibold">
                    {readabilityScore >= 80 ? 'A' : readabilityScore >= 60 ? 'B' : readabilityScore >= 40 ? 'C' : 'D'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-5 w-5 mr-2" />
              {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Publish Post')}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              className="px-8 py-3 text-lg border-2 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
