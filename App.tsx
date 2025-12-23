
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AiStylist } from './components/AiStylist';
import { UserProfile } from './components/UserProfile';
import { AiFittingRoom } from './components/AiFittingRoom';
import { ProductModal } from './components/ProductModal';
import { OrderSuccess } from './components/OrderSuccess';
import { PRODUCTS, MOCK_ORDERS, MOCK_TRY_ON_PHOTO, CATEGORIES_DATA } from './constants';
import { Product, CartItem, User, ViewState, Order, Coupon, RefundInfo, ShippingOption } from './types';
import { ArrowLeft, ShoppingBag, Star, Heart, Sparkles, ArrowRight, Truck, RefreshCcw, ShieldCheck } from 'lucide-react';

// Simple Toast Component inside App
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg text-sm animate-fade-in-up flex items-center gap-2">
    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
    {message}
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>(MOCK_ORDERS);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFittingRoomOpen, setIsFittingRoomOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Data States
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`已將 ${product.name} 加入購物袋`);
    setIsCartOpen(true);
    // Don't close product modal if it's open, users might want to keep reading
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (window.confirm("確定要清空購物袋嗎？")) {
      setCart([]);
    }
  };

  const handleCheckout = (finalTotal: number, coupon: Coupon | null, shippingMethod: ShippingOption, shippingCost: number) => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      showToast("請先登入以結帳");
      return;
    }

    // Simulate Checkout Process
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-2024-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        total: finalTotal,
        status: '處理中',
        refundStatus: '無',
        items: [...cart],
        discount: coupon ? (cart.reduce((sum, i) => sum + i.price * i.quantity, 0) - finalTotal + shippingCost) : 0,
        shippingMethod: shippingMethod,
        shippingCost: shippingCost
      };
      
      setUserOrders(prev => [newOrder, ...prev]);
      setLastOrder(newOrder); // Set last order for success page
      setCart([]);
      setIsCartOpen(false);
      
      // Add points (1 point per dollar)
      const earnedPoints = Math.floor(finalTotal);
      setUser(prev => prev ? { ...prev, points: prev.points + earnedPoints } : null);

      // Redirect to Order Success Page instead of User Profile
      setView(ViewState.ORDER_SUCCESS);
    }, 1500);
  };

  // --- Favorites Logic ---
  const toggleFavorite = (productId: number) => {
    if (!user) {
      setIsAuthOpen(true);
      showToast("請先登入以收藏商品");
      return;
    }
    
    setUser(prev => {
      if (!prev) return null;
      const isFav = prev.favorites.includes(productId);
      const newFavs = isFav
        ? prev.favorites.filter(id => id !== productId)
        : [...prev.favorites, productId];
      
      showToast(isFav ? "已取消收藏" : "已加入收藏清單");
      return { ...prev, favorites: newFavs };
    });
  };

  const handleMoveToFavorites = (item: CartItem) => {
    if (!user) {
      setIsAuthOpen(true);
      showToast("請先登入以收藏商品");
      return;
    }
    
    // 1. Add to favorites (if not already there)
    setUser(prev => {
      if (!prev) return null;
      if (prev.favorites.includes(item.id)) return prev;
      return { ...prev, favorites: [...prev.favorites, item.id] };
    });

    // 2. Remove from cart
    removeFromCart(item.id);
    showToast(`已將 ${item.name} 移至收藏清單`);
  };

  // --- Refund & Reorder Logic ---
  const handleRefundRequest = (orderId: string, refundInfo: RefundInfo) => {
    setUserOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          refundStatus: '審核中',
          refundInfo: refundInfo
        };
      }
      return order;
    }));
    showToast("退款申請已送出，我們將盡快審核。");
  };

  const handleBuyAgain = (orderItems: CartItem[]) => {
    orderItems.forEach(item => {
      addToCart(item);
    });
    setIsCartOpen(true);
  };

  // --- Navigation & Product Click Logic ---
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
    // We no longer change ViewState, so user stays on HOME/SHOP
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setView(ViewState.SHOP);
    window.scrollTo(0, 0);
  };

  const handleOpenFittingRoom = () => {
    if (!user) {
      setIsAuthOpen(true);
      showToast("請先登入以使用試衣間");
      return;
    }
    setIsProductModalOpen(false); 
    setIsFittingRoomOpen(true);
  };

  // --- Filter Logic ---
  const categories = ['全部', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const filteredProducts = selectedCategory === '全部' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const newArrivals = PRODUCTS.filter(p => p.tags?.includes('new'));
  const bestSellers = PRODUCTS.filter(p => p.tags?.includes('best-seller'));

  // --- Main Content Renderer ---
  const renderContent = () => {
    if (view === ViewState.ORDER_SUCCESS && lastOrder) {
      return (
        <OrderSuccess 
          order={lastOrder}
          onGoToProfile={() => setView(ViewState.USER_PROFILE)}
          onContinueShopping={() => setView(ViewState.SHOP)}
        />
      );
    }

    if (view === ViewState.USER_PROFILE && user) {
      return (
        <UserProfile 
          user={user} 
          orders={userOrders} 
          onLogout={() => {
            setUser(null);
            setView(ViewState.HOME);
          }}
          onUpdateProfile={(updated) => setUser(prev => prev ? { ...prev, ...updated } : null)}
          onRefundRequest={handleRefundRequest}
          onBuyAgain={handleBuyAgain}
          onToggleFavorite={toggleFavorite}
          onProductClick={handleProductClick}
        />
      );
    } else if (view === ViewState.USER_PROFILE && !user) {
      setView(ViewState.HOME); 
      return null;
    }

    if (view === ViewState.HOME) {
      return (
        <div className="animate-fade-in">
          <Hero onShopNow={() => setView(ViewState.SHOP)} />
          
          {/* Categories Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">探索系列</h2>
               <div className="w-16 h-0.5 bg-stone-900 mx-auto"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {CATEGORIES_DATA.map((cat) => (
                 <div 
                   key={cat.id} 
                   className="group relative h-[400px] overflow-hidden cursor-pointer"
                   onClick={() => handleCategoryClick(cat.filter)}
                 >
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center text-white">
                     <span className="text-sm uppercase tracking-widest mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{cat.subtitle}</span>
                     <h3 className="text-3xl font-serif font-bold mb-6">{cat.name}</h3>
                     <button className="border border-white px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                       瀏覽商品
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* New Arrivals Section */}
          <section className="bg-stone-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-end mb-10">
                 <div>
                   <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">本週新品</h2>
                   <p className="text-stone-500">最新上市的時尚單品，定義您的季節風格。</p>
                 </div>
                 <button onClick={() => setView(ViewState.SHOP)} className="hidden sm:flex items-center gap-2 text-stone-900 hover:text-primary transition-colors font-medium">
                   查看全部 <ArrowRight size={16} />
                 </button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {newArrivals.map(product => (
                   <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                      <div className="relative overflow-hidden mb-4 bg-white aspect-[3/4]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <span className="absolute top-3 left-3 bg-white text-stone-900 text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">New</span>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             toggleFavorite(product.id);
                           }}
                           className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm z-10"
                        >
                           <Heart size={16} fill={user?.favorites.includes(product.id) ? "currentColor" : "none"} className={user?.favorites.includes(product.id) ? "text-red-500" : ""} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="absolute bottom-0 left-0 w-full bg-white/95 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-stone-900 text-xs font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white"
                        >
                          加入購物袋
                        </button>
                      </div>
                      <h3 className="text-base font-medium text-stone-900 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-stone-500">${product.price}</p>
                   </div>
                 ))}
               </div>
               <div className="mt-8 text-center sm:hidden">
                  <button onClick={() => setView(ViewState.SHOP)} className="border-b border-stone-900 pb-1 text-stone-900 uppercase text-xs font-bold">查看全部新品</button>
               </div>
            </div>
          </section>

          {/* Promo Banner */}
          <section className="py-20 relative bg-stone-900 overflow-hidden">
             <img 
               src="https://picsum.photos/id/325/1600/600" 
               alt="Promo" 
               className="absolute inset-0 w-full h-full object-cover opacity-40"
             />
             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <span className="block text-accent font-bold uppercase tracking-widest mb-4">Limited Time Offer</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">春季閃購特賣</h2>
                <p className="text-xl text-stone-200 mb-10 max-w-2xl mx-auto">精選商品低至 7 折優惠。輸入優惠碼 <span className="text-white font-bold bg-white/20 px-2 py-1 rounded">SUMMER2024</span> 享額外折扣。</p>
                <button 
                  onClick={() => setView(ViewState.SHOP)}
                  className="bg-white text-stone-900 px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-accent hover:text-stone-900 transition-colors"
                >
                  立即搶購
                </button>
             </div>
          </section>

          {/* Best Sellers */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">熱銷排行</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">顧客最愛的經典單品，值得您擁有。</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {bestSellers.slice(0, 3).map((product, idx) => (
                <div key={product.id} className="group cursor-pointer flex gap-4 items-center sm:block" onClick={() => handleProductClick(product)}>
                  <div className="relative w-1/3 sm:w-full sm:mb-4 bg-stone-100 aspect-[3/4] overflow-hidden">
                    <div className="absolute top-2 left-2 bg-stone-900 text-white w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full z-10">
                      {idx + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-medium text-stone-900 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-stone-900 font-medium">${product.price}</p>
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         addToCart(product);
                       }}
                       className="text-xs uppercase font-bold text-stone-500 border-b border-stone-300 hover:text-stone-900 hover:border-stone-900 transition-colors mt-2 sm:hidden"
                    >
                      加入購物袋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Service Features */}
          <section className="border-t border-stone-100 bg-white py-16">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                   <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-900">
                        <Truck size={24} />
                      </div>
                      <h4 className="font-bold text-stone-900 mb-2">全球免運費</h4>
                      <p className="text-sm text-stone-500">訂單滿 $200 即可享有</p>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-900">
                        <RefreshCcw size={24} />
                      </div>
                      <h4 className="font-bold text-stone-900 mb-2">輕鬆退換貨</h4>
                      <p className="text-sm text-stone-500">30 天內無條件退款</p>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-900">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="font-bold text-stone-900 mb-2">安全支付</h4>
                      <p className="text-sm text-stone-500">保障您的交易安全</p>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-900">
                        <Sparkles size={24} />
                      </div>
                      <h4 className="font-bold text-stone-900 mb-2">AI 造型顧問</h4>
                      <p className="text-sm text-stone-500">24/7 專屬時尚建議</p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      );
    }

    if (view === ViewState.SHOP) {
      return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 border-b border-stone-200 pb-6">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
               {selectedCategory === '全部' ? '所有商品' : selectedCategory}
            </h2>
            
            <div className="mt-4 md:mt-0 flex gap-6 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'text-stone-900 font-bold border-b-2 border-stone-900' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                <div className="relative overflow-hidden mb-4 bg-stone-100 aspect-[3/4]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleFavorite(product.id);
                       }}
                       className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm z-10 opacity-0 group-hover:opacity-100"
                  >
                       <Heart size={18} fill={user?.favorites.includes(product.id) ? "currentColor" : "none"} className={user?.favorites.includes(product.id) ? "text-red-500" : ""} />
                  </button>
                  {product.tags?.includes('new') && (
                    <span className="absolute top-3 left-3 bg-white text-stone-900 text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">New</span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    <span className="bg-white text-stone-900 px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-stone-100 transition-colors pointer-events-auto shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                      加入購物袋
                    </span>
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-stone-900 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2 mb-2 h-10 leading-tight">{product.description}</p>
                  </div>
                </div>
                <p className="text-stone-900 font-medium">${product.price}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-800 font-sans">
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        setView={setView}
        onLogout={() => {
          setUser(null);
          setView(ViewState.HOME);
          showToast("已登出");
        }}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white font-serif font-bold text-2xl mb-6 tracking-wider">Twýst</h4>
            <p className="text-sm leading-relaxed mb-6">
              以永續實踐與永恆設計重新定義奢華，獻給現代謬思女神。我們致力於為您帶來最優質的購物體驗。
            </p>
            <div className="flex gap-4">
               {/* Social Icons Mockup */}
               <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors cursor-pointer">f</div>
               <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors cursor-pointer">in</div>
               <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors cursor-pointer">ig</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">購物指南</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">新進商品</a></li>
              <li><a href="#" className="hover:text-white transition-colors">熱銷排行</a></li>
              <li><a href="#" className="hover:text-white transition-colors">禮物專區</a></li>
              <li><a href="#" className="hover:text-white transition-colors">尺寸對照表</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">客戶服務</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">聯絡我們</a></li>
              <li><a href="#" className="hover:text-white transition-colors">運送政策</a></li>
              <li><a href="#" className="hover:text-white transition-colors">退換貨說明</a></li>
              <li><a href="#" className="hover:text-white transition-colors">常見問題</a></li>
              <li><a href="#" className="hover:text-white transition-colors">隱私權條款</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6">訂閱電子報</h4>
            <p className="text-sm mb-4">訂閱以接收最新消息、專屬優惠及更多資訊。</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="輸入您的電子郵件" 
                className="bg-stone-800 border-none px-4 py-2 text-sm focus:ring-1 focus:ring-stone-600 text-white placeholder-stone-500 w-full" 
              />
              <button className="bg-white text-stone-900 px-4 py-2 uppercase text-xs font-bold hover:bg-stone-200 transition-colors">
                訂閱
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-stone-800 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 Twýst Fashion. All rights reserved.</p>
          <p className="text-stone-600">Designed with AI for Modern Elegance.</p>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        onClear={clearCart}
        onMoveToFavorites={handleMoveToFavorites}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(u) => {
          setUser({
             ...u,
             level: '金卡會員',
             points: 2250,
             favorites: [],
             tryOnPhotos: [MOCK_TRY_ON_PHOTO] // Add default mock photo for demo
          });
          showToast(`歡迎回來，${u.name}`);
        }}
      />

      {/* Product Details Modal (New) */}
      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        isFavorite={user && selectedProduct ? user.favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={(id) => toggleFavorite(id)}
        onAddToCart={addToCart}
        onOpenFittingRoom={handleOpenFittingRoom}
      />

      {user && selectedProduct && (
        <AiFittingRoom 
          isOpen={isFittingRoomOpen}
          onClose={() => setIsFittingRoomOpen(false)}
          product={selectedProduct}
          userPhotos={user.tryOnPhotos || []}
        />
      )}

      <AiStylist />
      
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
