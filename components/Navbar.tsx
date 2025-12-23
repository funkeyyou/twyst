
import React from 'react';
import { ShoppingBag, User, Menu, X, Search, LogOut, Settings } from 'lucide-react';
import { User as UserType, ViewState } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: UserType | null;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onOpenAuth, 
  user, 
  setView,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const NavLink = ({ label, view }: { label: string, view: ViewState }) => (
    <button 
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
    >
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-stone-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <span className="font-serif text-2xl font-bold tracking-widest text-stone-900">Twýst</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <NavLink label="首頁" view={ViewState.HOME} />
            <NavLink label="瀏覽商品" view={ViewState.SHOP} />
            <button className="text-stone-600 hover:text-stone-900 transition-colors font-medium">時尚日誌</button>
            <button className="text-stone-600 hover:text-stone-900 transition-colors font-medium">關於我們</button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-stone-500 hover:text-stone-800 hidden sm:block">
              <Search size={20} />
            </button>
            
            {user ? (
               <div className="relative">
                 <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center space-x-2 text-stone-500 hover:text-stone-800 focus:outline-none"
                 >
                   <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {user.name.charAt(0)}
                   </div>
                   <span className="text-xs hidden sm:inline">{user.name}</span>
                 </button>

                 {isUserMenuOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-1 border border-stone-100 animate-fade-in-up">
                     <button 
                        onClick={() => {
                          setView(ViewState.USER_PROFILE);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                     >
                       <Settings size={14} /> 會員中心
                     </button>
                     <button 
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                     >
                       <LogOut size={14} /> 登出
                     </button>
                   </div>
                 )}
               </div>
            ) : (
              <button onClick={onOpenAuth} className="text-stone-500 hover:text-stone-800">
                <User size={20} />
              </button>
            )}

            <button onClick={onOpenCart} className="relative text-stone-500 hover:text-stone-800">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 p-4 space-y-4 flex flex-col shadow-lg">
          <NavLink label="首頁" view={ViewState.HOME} />
          <NavLink label="瀏覽商品" view={ViewState.SHOP} />
          <button className="text-left text-stone-600 font-medium">時尚日誌</button>
          <button className="text-left text-stone-600 font-medium">關於我們</button>
          {user ? (
            <>
              <button onClick={() => { setView(ViewState.USER_PROFILE); setIsMobileMenuOpen(false); }} className="text-left text-stone-600 font-medium">會員中心</button>
              <button onClick={onLogout} className="text-left text-red-500 font-medium">登出</button>
            </>
          ) : (
            <button onClick={onOpenAuth} className="text-left text-stone-600 font-medium">登入 / 註冊</button>
          )}
        </div>
      )}
    </nav>
  );
};
