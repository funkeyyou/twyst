
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: name || email.split('@')[0],
        email: email,
        level: '一般會員',
        points: 0,
        favorites: [],
        tryOnPhotos: [],
        isGoogleLinked: false
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth delay
    setTimeout(() => {
      onLogin({
        name: "Google User",
        email: "user@gmail.com",
        level: '一般會員',
        points: 0,
        favorites: [],
        tryOnPhotos: [],
        isGoogleLinked: true,
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocIq8d_2s_4=s96-c" // Fake avatar url
      });
      setIsLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 w-full max-w-md relative shadow-2xl animate-fade-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
        >
          <X size={24} />
        </button>
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            {isLogin ? '歡迎回來' : '加入 Twýst'}
          </h2>
          <p className="text-stone-500 text-sm">
            {isLogin ? '請輸入您的資訊以登入。' : '建立帳戶以享受專屬優惠。'}
          </p>
        </div>

        {/* Google Login Button */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-stone-300 text-stone-700 py-3 rounded hover:bg-stone-50 transition-colors mb-6 shadow-sm"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="font-medium text-sm">使用 Google 帳號繼續</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-stone-500">或使用電子郵件</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">全名</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
                placeholder="王小美"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">電子郵件</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">密碼</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-stone-900 text-white py-3 mt-6 hover:bg-stone-800 transition-colors uppercase text-sm tracking-widest disabled:opacity-70"
          >
            {isLoading ? '處理中...' : (isLogin ? '登入' : '建立帳戶')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            {isLogin ? "還沒有帳戶？ " : "已經是會員？ "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-stone-900 underline hover:text-primary font-medium"
            >
              {isLogin ? '立即註冊' : '立即登入'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};