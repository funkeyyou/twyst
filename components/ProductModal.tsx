import React from 'react';
import { X, ShoppingBag, Sparkles, Star, Heart, Truck, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onOpenFittingRoom: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenFittingRoom
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative animate-scale-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-stone-500 hover:text-stone-900 hover:bg-white transition-colors shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-stone-100 relative h-1/2 md:h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          {product.tags?.includes('new') && (
            <span className="absolute top-6 left-6 bg-white text-stone-900 text-xs font-bold px-3 py-1 uppercase tracking-widest">New</span>
          )}
           <button 
             onClick={() => onToggleFavorite(product.id)}
             className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white text-stone-400 hover:text-red-500 transition-all"
          >
             <Heart size={24} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
          </button>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
          <div className="flex flex-col h-full">
            <div className="mb-auto">
              <p className="text-sm text-stone-500 uppercase tracking-widest mb-2 font-bold">{product.category}</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">{product.name}</h2>
              <p className="text-2xl font-medium text-stone-900 mb-6">${product.price}</p>
              
              <div className="flex gap-1 text-yellow-400 mb-6 items-center">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                <span className="text-stone-400 text-sm ml-2 border-b border-stone-300 cursor-pointer hover:text-stone-600 hover:border-stone-600 transition-colors">45 則評論</span>
              </div>

              <p className="text-stone-600 leading-relaxed mb-8 text-lg font-light">
                {product.description} 這款單品展現了 Twýst 對細節的極致追求。採用頂級面料製作，
                確保舒適度與耐用性兼具。無論是日常穿搭還是特殊場合，都能讓您散發自信光彩。
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-4">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-stone-900 text-white py-4 uppercase text-sm font-bold tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
                  >
                    <ShoppingBag size={18} /> 加入購物袋
                  </button>
                  <button 
                    onClick={onOpenFittingRoom}
                    className="flex-1 bg-white text-stone-900 border border-stone-900 px-6 py-4 uppercase text-sm font-bold tracking-widest hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Sparkles size={18} className="text-primary" /> AI 虛擬試衣
                  </button>
                </div>
                <p className="text-xs text-stone-500 text-center flex items-center justify-center gap-1">
                   <Sparkles size={12} /> 試衣功能需上傳您的全身照，AI 將模擬穿著效果。
                </p>
              </div>

              <div className="pt-8 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-6 text-sm text-stone-500">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-stone-400" />
                    <span>全球免運費</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <RefreshCcw size={20} className="text-stone-400" />
                    <span>30 天免費退換貨</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-stone-400" />
                    <span>安全支付保障</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart size={20} className="text-stone-400" />
                    <span>禮品包裝服務</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};