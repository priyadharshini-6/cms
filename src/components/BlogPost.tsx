
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  BarChart3 
} from 'lucide-react';

interface BlogPostProps {
  post: any;
  currentUser: any;
  isAuthenticated: boolean;
  onBack: () => void;
  onEdit: (post: any) => void;
  onDelete: (postId: number) => void;
}

export const BlogPost = ({ post, currentUser, isAuthenticated, onBack, onEdit, onDelete }: BlogPostProps) => {
  const canModifyPost = isAuthenticated && currentUser && post.authorId === currentUser.id;

  const getReadabilityBadge = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { level: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { level: 'Average', color: 'bg-yellow-500' };
    return { level: 'Poor', color: 'bg-red-500' };
  };

  const readability = getReadabilityBadge(post.readabilityScore);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Posts</span>
        </Button>
      </div>

      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                {post.title}
              </CardTitle>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {post.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <Badge className={`${readability.color} text-white`}>
                {readability.level} ({Math.round(post.readabilityScore)}/100)
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {canModifyPost && (
            <div className="flex space-x-4 pt-8 mt-8 border-t">
              <Button
                onClick={() => onEdit(post)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
              
              <Button
                onClick={() => onDelete(post.id)}
                variant="outline"
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
