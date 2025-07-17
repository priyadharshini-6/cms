
import { useState } from 'react';
import { BlogList } from '@/components/BlogList';
import { BlogEditor } from '@/components/BlogEditor';
import { AuthModal } from '@/components/AuthModal';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleSavePost = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onBack={() => setShowEditor(false)}
        />
        <BlogEditor 
          post={editingPost}
          currentUser={currentUser}
          onSave={handleSavePost}
          onCancel={() => setShowEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            BlogCraft CMS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, manage, and share your stories with the world
          </p>
          
          <Button 
            onClick={handleCreatePost}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Write New Post
          </Button>
        </div>

        <BlogList 
          onEditPost={handleEditPost}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
        />
      </main>

      {showAuthModal && (
        <AuthModal 
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
