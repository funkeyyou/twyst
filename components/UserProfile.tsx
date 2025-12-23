
import React, { useState, useRef } from 'react';
import { User, Order, Coupon, CartItem, RefundInfo } from '../types';
import { Package, Gift, User as UserIcon, LogOut, ChevronRight, MapPin, Phone, Mail, Crown, Info, X, RotateCcw, Image as ImageIcon, Upload, AlertCircle, Heart, ShoppingBag, Camera, Trash2, Link, CheckCircle, FileText } from 'lucide-react';
import { MOCK_COUPONS, MEMBER_TIERS, PRODUCTS } from '../constants';
import { OrderDetailsModal } from './OrderDetailsModal';

interface UserProfileProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onUpdateProfile: (updatedUser: Partial<User>) => void;
  onRefundRequest: (orderId: string, refundInfo: RefundInfo) => void;
  onBuyAgain: (items: CartItem[]) => void;
  onToggleFavorite: (id: number) => void;
  onProductClick: (product: any) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  orders, 
  onLogout, 
  onUpdateProfile,
  onRefundRequest,
  onBuyAgain,
  onToggleFavorite,
  onProductClick
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'coupons' | 'settings' | 'wishlist' | 'fitting_room'>('dashboard');
  const [showBenefits, setShowBenefits] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [loadingBinding, setLoadingBinding] = useState<string | null>(null);
  
  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('size_issue');
  const [refundDescription, setRefundDescription] = useState('');
  const [refundImages, setRefundImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tryOnInputRef = useRef<HTMLInputElement>(null);

  // Order Details Modal State
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Calculate Progress
  const currentTierIndex = MEMBER_TIERS.findIndex(t => t.name === user.level);
  const currentTier = MEMBER_TIERS[currentTierIndex] || MEMBER_TIERS[0];
  const nextTier = MEMBER_TIERS[currentTierIndex + 1];
  
  const progressPercent = nextTier 
    ? Math.min(100, Math.max(0, ((user.points - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100))
    : 100;

  // Get Favorite Products
  const favoriteProducts = PRODUCTS.filter(p => user.favorites.includes(p.id));

  // Handle Image Upload Preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setRefundImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOnPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const newPhotos = [...(user.tryOnPhotos || []), reader.result as string];
          onUpdateProfile({ tryOnPhotos: newPhotos });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setRefundImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeTryOnPhoto = (index: number) => {
    const newPhotos = user.tryOnPhotos.filter((_, i) => i !== index);
    onUpdateProfile({ tryOnPhotos: newPhotos });
  };

  const submitRefund = () => {
    if (selectedOrderForRefund) {
      const reasonMap: {[key: string]: string} = {
        'size_issue': '尺寸不合',
        'quality_issue': '商品瑕疵',
        'changed_mind': '改變心意',
        'wrong_item': '寄錯商品'
      };

      const info: RefundInfo = {
        reasonType: reasonMap[refundReason] || '其他',
        description: refundDescription,
        images: refundImages,
        date: new Date().toISOString().split('T')[0]
      };

      onRefundRequest(selectedOrderForRefund.id, info);
      setRefundModalOpen(false);
      setSelectedOrderForRefund(null);
      setRefundDescription('');
      setRefundImages([]);
    }
  };

  const handleBindingToggle = (provider: 'google') => {
    setLoadingBinding(provider);
    setTimeout(() => {
      if (provider === 'google') {
         onUpdateProfile({ isGoogleLinked: !user.isGoogleLinked });
      }
      setLoadingBinding(null);
    }, 1000);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrderDetails(order);
    setIsOrderDetailsOpen(true);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-stone-900 text-white' 
          : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      <Icon size={18} />
      {label}
      {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'ALL') return true;
    if (orderFilter === 'ACTIVE') return ['處理中', '已出貨'].includes(order.status);
    if (orderFilter === 'COMPLETED') return ['已完成', '已取消'].includes(order.status) || order.refundStatus !== '無';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-stone-100 shadow-sm overflow-hidden mb-6">
            <div className="p-6 text-center border-b border-stone-100 bg-stone-50">
               <div className="w-20 h-20 mx-auto bg-stone-200 rounded-full flex items-center justify-center mb-3 overflow-hidden border-2 border-white shadow-md relative">
                 {user.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-2xl font-serif text-stone-500">{user.name.charAt(0)}</span>
                 )}
                 <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                 </div>
               </div>
               <h3 className="font-serif font-bold text-lg text-stone-900">{user.name}</h3>
               <p className="text-primary text-xs uppercase tracking-widest font-bold mt-1">{user.level}</p>
            </div>
            <nav className="flex flex-col">
              <TabButton id="dashboard" label="會員概覽" icon={Crown} />
              <TabButton id="orders" label="購買記錄" icon={Package} />
              <TabButton id="wishlist" label="收藏清單" icon={Heart} />
              <TabButton id="fitting_room" label="我的試衣間" icon={Camera} />
              <TabButton id="coupons" label="我的優惠券" icon={Gift} />
              <TabButton id="settings" label="個人資料" icon={UserIcon} />
            </nav>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
          >
            <LogOut size={18} />
            登出帳戶
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">會員概覽</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-stone-900 text-white p-6 shadow-md relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest opacity-70 mb-1">目前積分</p>
                    <p className="text-3xl font-serif">{user.points}</p>
                  </div>
                  <Crown className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 rotate-12" />
                </div>
                <div className="bg-white border border-stone-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">訂單總數</p>
                  <p className="text-3xl font-serif text-stone-900">{orders.length}</p>
                </div>
                 <div className="bg-white border border-stone-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">收藏商品</p>
                  <p className="text-3xl font-serif text-stone-900">{user.favorites.length}</p>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-white border border-stone-200 p-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-xl text-stone-900">{user.level}</h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">Current Status</span>
                    </div>
                    {nextTier ? (
                      <p className="text-sm text-stone-500">
                        距離 <span className="font-bold text-stone-800">{nextTier.name}</span> 還需 <span className="text-primary font-bold">{nextTier.threshold - user.points}</span> 積分
                      </p>
                    ) : (
                       <p className="text-sm text-stone-500">您已達到最高尊榮等級！</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowBenefits(true)}
                    className="text-xs flex items-center gap-1 text-stone-500 hover:text-stone-900 border-b border-stone-300 pb-0.5 hover:border-stone-900 transition-all"
                  >
                    <Info size={12} /> 查看會員權益
                  </button>
                </div>

                <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-pink-400 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs font-medium text-stone-400 uppercase tracking-wider">
                  <span>{currentTier.name} ({currentTier.threshold})</span>
                  {nextTier ? (
                    <span>{nextTier.name} ({nextTier.threshold})</span>
                  ) : (
                    <span>MAX</span>
                  )}
                </div>
              </div>

              {/* Current Benefits Preview */}
               <div className="bg-stone-50 border border-stone-100 p-6">
                  <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-primary" /> 
                    您目前的專屬禮遇
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'fitting_room' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif font-bold text-stone-900">我的試衣間</h2>
                 <button 
                   onClick={() => tryOnInputRef.current?.click()}
                   className="bg-stone-900 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-stone-700 transition-colors"
                 >
                   <Upload size={16} /> 上傳全身照
                 </button>
                 <input 
                   type="file" 
                   ref={tryOnInputRef} 
                   className="hidden" 
                   accept="image/*" 
                   onChange={handleTryOnPhotoUpload}
                 />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex gap-3">
                <Info className="text-blue-500 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-700">
                  上傳您的全身照片，即可在商品頁面使用「AI 虛擬試衣」功能。建議使用背景乾淨、光線充足且身形完整的照片以獲得最佳效果。
                </p>
              </div>

              {!user.tryOnPhotos || user.tryOnPhotos.length === 0 ? (
                <div className="text-center py-16 bg-stone-50 border border-dashed border-stone-300 rounded-lg">
                  <Camera className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                  <p className="text-stone-500 mb-4">尚未上傳任何照片</p>
                  <button 
                     onClick={() => tryOnInputRef.current?.click()}
                     className="text-primary font-bold hover:underline"
                  >
                    立即上傳第一張
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.tryOnPhotos.map((photo, idx) => (
                    <div key={idx} className="group relative bg-stone-100 aspect-[3/4] overflow-hidden rounded-lg shadow-sm">
                       <img src={photo} alt={`My Photo ${idx+1}`} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => removeTryOnPhoto(idx)}
                            className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">收藏清單</h2>
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-16 bg-stone-50 border border-stone-100">
                  <Heart className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                  <p className="text-stone-500 mb-4">您的收藏清單是空的</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map(product => (
                    <div key={product.id} className="group bg-white border border-stone-100">
                       <div 
                        className="relative overflow-hidden aspect-[3/4] cursor-pointer bg-stone-100"
                        onClick={() => onProductClick(product)}
                       >
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(product.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500 hover:bg-white transition-colors"
                          >
                            <Heart size={16} fill="currentColor" />
                          </button>
                       </div>
                       <div className="p-4">
                         <h3 className="font-medium text-stone-900 mb-1 truncate">{product.name}</h3>
                         <p className="text-stone-500 text-sm mb-4">${product.price}</p>
                         <button 
                            onClick={() => onBuyAgain([{...product, quantity: 1}])}
                            className="w-full border border-stone-900 text-stone-900 py-2 text-xs font-bold uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                         >
                           <ShoppingBag size={14} /> 加入購物袋
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-stone-900">購買記錄</h2>
                {/* Filter Tabs */}
                <div className="flex bg-stone-100 p-1 rounded-lg">
                  {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                        orderFilter === filter 
                          ? 'bg-white text-stone-900 shadow-sm' 
                          : 'text-stone-500 hover:text-stone-700'
                      }`}
                    >
                      {filter === 'ALL' ? '全部' : filter === 'ACTIVE' ? '進行中' : '已完成/退款'}
                    </button>
                  ))}
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 border border-stone-100">
                  <Package className="mx-auto h-12 w-12 text-stone-300 mb-3" />
                  <p className="text-stone-500">沒有符合條件的訂單</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white border border-stone-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                      <div className="bg-stone-50 p-4 flex flex-wrap justify-between items-center text-sm border-b border-stone-100 gap-4">
                        <div className="flex gap-6">
                          <div>
                            <span className="block text-stone-500 text-xs uppercase">下單日期</span>
                            <span className="font-medium text-stone-900">{order.date}</span>
                          </div>
                          <div>
                            <span className="block text-stone-500 text-xs uppercase">總計</span>
                            <span className="font-medium text-stone-900">${order.total.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="block text-stone-500 text-xs uppercase">訂單編號</span>
                            <span className="font-medium text-stone-900">{order.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {order.refundStatus !== '無' && (
                             <span className={`px-2 py-1 rounded border text-xs flex items-center gap-1 ${
                               order.refundStatus === '審核中' ? 'bg-orange-50 border-orange-200 text-orange-700' : 
                               order.refundStatus === '已退款' ? 'bg-stone-100 border-stone-300 text-stone-600 line-through' : 
                               'bg-red-50 text-red-700'
                             }`}>
                               {order.refundStatus === '審核中' && <AlertCircle size={12} />}
                               {order.refundStatus}
                             </span>
                           )}

                           {order.discount && order.discount > 0 && (
                             <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                               已折抵 ${order.discount}
                             </span>
                           )}
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                             order.status === '已完成' ? 'bg-green-100 text-green-800' : 
                             order.status === '處理中' ? 'bg-blue-100 text-blue-800' : 
                             'bg-stone-200 text-stone-800'
                           }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 py-3 border-b last:border-0 border-stone-50">
                            <div 
                              className="w-16 h-20 bg-stone-100 cursor-pointer overflow-hidden flex-shrink-0"
                              onClick={() => onProductClick(item)}
                            >
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 
                                className="text-stone-900 font-medium cursor-pointer hover:text-primary"
                                onClick={() => onProductClick(item)}
                              >
                                {item.name}
                              </h4>
                              <p className="text-sm text-stone-500">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-stone-900">${item.price}</p>
                              <p className="text-sm text-stone-500">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Order Actions */}
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-stone-50">
                          {/* View Details Button */}
                          <button 
                            onClick={() => handleViewOrderDetails(order)}
                            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 border border-stone-200 px-3 py-2 rounded hover:bg-stone-50 transition-colors"
                          >
                            <FileText size={14} /> 查看詳情
                          </button>

                          {/* Buy Again Button */}
                          <button 
                            onClick={() => onBuyAgain(order.items)}
                            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 border border-stone-200 px-3 py-2 rounded hover:bg-stone-50 transition-colors"
                          >
                            <RotateCcw size={14} /> 再次購買
                          </button>

                          {/* Refund Button Logic */}
                          {(order.status === '已完成' || order.status === '已出貨') && order.refundStatus === '無' && (
                            <button 
                              onClick={() => {
                                setSelectedOrderForRefund(order);
                                setRefundModalOpen(true);
                              }}
                              className="text-xs font-medium text-stone-600 hover:text-red-600 flex items-center gap-1 border border-stone-200 px-3 py-2 rounded hover:bg-red-50 hover:border-red-200 transition-colors"
                            >
                              申請退款
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">我的優惠券</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_COUPONS.map(coupon => (
                  <div key={coupon.code} className="border border-stone-200 p-6 bg-white flex flex-col justify-between relative overflow-hidden group hover:border-primary transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-stone-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-secondary/20"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Gift size={20} />
                        <span className="font-bold tracking-wider text-sm">Twýst 獨家</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 mb-2">{coupon.code}</h3>
                      <p className="text-stone-600 text-sm mb-4">{coupon.description}</p>
                      <p className="text-xs text-stone-400">低消限制: ${coupon.minSpend}</p>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(coupon.code)}
                      className="mt-4 w-full py-2 border border-stone-300 text-stone-600 text-sm hover:bg-stone-50 hover:text-stone-900 transition-colors"
                    >
                      複製代碼
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Profile Edit */}
              <div>
                 <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">編輯個人資料</h2>
                 <form 
                    className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm"
                    onSubmit={(e) => { e.preventDefault(); alert('資料已更新！'); }}
                 >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs uppercase tracking-wide text-stone-500 mb-2">姓名</label>
                          <div className="flex items-center border-b border-stone-300 py-2">
                             <UserIcon size={18} className="text-stone-400 mr-3" />
                             <input 
                                type="text" 
                                defaultValue={user.name} 
                                onChange={(e) => onUpdateProfile({ name: e.target.value })}
                                className="w-full focus:outline-none text-stone-900" 
                             />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs uppercase tracking-wide text-stone-500 mb-2">電子郵件</label>
                          <div className="flex items-center border-b border-stone-300 py-2 bg-stone-50 cursor-not-allowed">
                             <Mail size={18} className="text-stone-400 mr-3" />
                             <input type="email" value={user.email} readOnly className="w-full focus:outline-none text-stone-500 bg-transparent" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs uppercase tracking-wide text-stone-500 mb-2">電話號碼</label>
                          <div className="flex items-center border-b border-stone-300 py-2">
                             <Phone size={18} className="text-stone-400 mr-3" />
                             <input 
                                type="tel" 
                                placeholder="未設定" 
                                defaultValue={user.phone}
                                onChange={(e) => onUpdateProfile({ phone: e.target.value })}
                                className="w-full focus:outline-none text-stone-900" 
                             />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs uppercase tracking-wide text-stone-500 mb-2">寄送地址</label>
                          <div className="flex items-center border-b border-stone-300 py-2">
                             <MapPin size={18} className="text-stone-400 mr-3" />
                             <input 
                                type="text" 
                                placeholder="未設定" 
                                defaultValue={user.address} 
                                onChange={(e) => onUpdateProfile({ address: e.target.value })}
                                className="w-full focus:outline-none text-stone-900" 
                             />
                          </div>
                       </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                       <button type="submit" className="bg-stone-900 text-white px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-stone-700 transition-colors">
                          儲存變更
                       </button>
                    </div>
                 </form>
              </div>

              {/* Linked Accounts */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">第三方帳號綁定</h2>
                <div className="bg-white border border-stone-200 p-6 shadow-sm">
                   <div className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center bg-white p-2">
                           <svg viewBox="0 0 24 24" className="w-full h-full">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                           </svg>
                         </div>
                         <div>
                            <h4 className="font-bold text-stone-900">Google</h4>
                            <p className="text-xs text-stone-500">
                               {user.isGoogleLinked ? '已綁定 Google 帳號' : '未綁定'}
                            </p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleBindingToggle('google')}
                        disabled={loadingBinding === 'google'}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded transition-all ${
                           user.isGoogleLinked 
                              ? 'border-stone-200 text-stone-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50' 
                              : 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700'
                        }`}
                      >
                         {loadingBinding === 'google' ? '處理中...' : user.isGoogleLinked ? '解除綁定' : '立即綁定'}
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Modal */}
      {showBenefits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-serif font-bold text-stone-900">會員權益一覽</h3>
              <button onClick={() => setShowBenefits(false)} className="text-stone-400 hover:text-stone-900">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {MEMBER_TIERS.map((tier) => {
                const isCurrent = tier.name === user.level;
                return (
                  <div 
                    key={tier.name} 
                    className={`border rounded-xl p-5 transition-all ${
                      isCurrent 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                        : 'border-stone-200 bg-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className={`font-bold text-lg ${isCurrent ? 'text-primary' : 'text-stone-900'}`}>
                          {tier.name}
                        </h4>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                           {tier.threshold === 0 ? '註冊即可享有' : `累積 ${tier.threshold} 積分`}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="bg-primary text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide">
                          目前等級
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Crown size={14} className={`mt-1 ${isCurrent ? 'text-primary' : 'text-stone-300'}`} />
                          <span className={`text-sm ${isCurrent ? 'text-stone-800' : 'text-stone-500'}`}>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-500">消費 $1 = 1 積分。積分有效期為 365 天。</p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {refundModalOpen && selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-fade-in-up overflow-hidden">
             <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
                <h3 className="font-serif font-bold">申請退款 #{selectedOrderForRefund.id}</h3>
                <button onClick={() => setRefundModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X size={20} />
                </button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-bold text-stone-500 uppercase mb-1">退款原因</label>
                 <select 
                   className="w-full border border-stone-200 p-2 rounded text-sm focus:ring-1 focus:ring-stone-900 outline-none bg-white"
                   value={refundReason}
                   onChange={(e) => setRefundReason(e.target.value)}
                 >
                   <option value="size_issue">尺寸不合</option>
                   <option value="quality_issue">商品瑕疵 (請附照片)</option>
                   <option value="changed_mind">改變心意</option>
                   <option value="wrong_item">收到錯誤商品</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-stone-500 uppercase mb-1">詳細說明</label>
                 <textarea 
                   className="w-full border border-stone-200 p-2 rounded text-sm h-24 focus:ring-1 focus:ring-stone-900 outline-none resize-none"
                   placeholder="請描述您遇到的問題..."
                   value={refundDescription}
                   onChange={(e) => setRefundDescription(e.target.value)}
                   required
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                   上傳照片 <span className="text-stone-300 font-normal">(選填)</span>
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {refundImages.map((img, idx) => (
                     <div key={idx} className="relative w-16 h-16 border border-stone-200 rounded overflow-hidden group">
                       <img src={img} alt="upload preview" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => removeImage(idx)}
                         className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X size={14} className="text-white" />
                       </button>
                     </div>
                   ))}
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-16 h-16 border border-dashed border-stone-300 rounded flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 hover:bg-stone-50 transition-colors"
                   >
                     <Upload size={16} />
                     <span className="text-[10px] mt-1">新增</span>
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*" 
                     onChange={handleImageUpload}
                   />
                 </div>
               </div>

               <div className="bg-stone-50 p-3 text-xs text-stone-500 rounded">
                 <p>提交申請後，我們將在 1-3 個工作天內進行審核。若審核通過，款項將退回您的原付款方式。</p>
               </div>

               <button 
                 onClick={submitRefund}
                 disabled={!refundDescription.trim()}
                 className="w-full bg-stone-900 text-white py-3 uppercase text-sm font-bold tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 提交申請
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal 
        isOpen={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
        order={selectedOrderDetails}
      />

    </div>
  );
};
