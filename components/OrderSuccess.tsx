import React from 'react';
import { CheckCircle, Truck, ArrowRight, ShoppingBag, User as UserIcon, Calendar } from 'lucide-react';
import { Order, ViewState } from '../types';

interface OrderSuccessProps {
  order: Order | null;
  onGoToProfile: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, onGoToProfile, onContinueShopping }) => {
  if (!order) return null;

  // Calculate estimated delivery date (today + 5 days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-up">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">感謝您的購買！</h2>
          <p className="text-stone-300">您的訂單已成功建立，我們將盡快為您出貨。</p>
        </div>

        {/* Order Info */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-stone-100">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">訂單編號</p>
              <p className="text-lg font-bold text-stone-900 font-serif">{order.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">下單日期</p>
              <p className="text-lg font-medium text-stone-900">{order.date}</p>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-6 mb-8 flex items-start gap-4">
            <div className="bg-white p-3 rounded-full text-stone-900 shadow-sm">
              <Truck size={24} />
            </div>
            <div>
               <h3 className="font-bold text-stone-900 mb-1">預計送達時間</h3>
               <p className="text-stone-600 text-sm mb-2">您的包裹預計將於 <span className="font-bold text-primary">{formattedDelivery}</span> 送達。</p>
               <p className="text-xs text-stone-400">物流狀態可隨時在會員中心查詢。</p>
            </div>
          </div>

          {/* Order Summary Snippet */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-4">訂單摘要</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-stone-100 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-stone-700 font-medium">
                      {item.name} <span className="text-stone-400">x{item.quantity}</span>
                    </span>
                  </div>
                  <span className="text-stone-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
               <span className="text-stone-500">總計</span>
               <span className="text-2xl font-serif font-bold text-stone-900">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onGoToProfile}
              className="flex-1 bg-stone-900 text-white py-4 rounded-lg uppercase text-xs font-bold tracking-widest hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <UserIcon size={16} /> 前往會員中心
            </button>
            <button 
              onClick={onContinueShopping}
              className="flex-1 bg-white border border-stone-200 text-stone-900 py-4 rounded-lg uppercase text-xs font-bold tracking-widest hover:bg-stone-50 hover:border-stone-300 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> 繼續購物
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};