
import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Check, Ticket, Heart, Truck } from 'lucide-react';
import { CartItem, Coupon, ShippingOption } from '../types';
import { MOCK_COUPONS, SHIPPING_OPTIONS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: (finalTotal: number, coupon: Coupon | null, shippingMethod: ShippingOption, shippingCost: number) => void;
  onClear?: () => void;
  onMoveToFavorites: (item: CartItem) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  onCheckout,
  onClear,
  onMoveToFavorites
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<string>(SHIPPING_OPTIONS[0].id);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discount = subtotal * (1 - appliedCoupon.value);
    } else {
      discount = appliedCoupon.value;
    }
  }

  // Shipping Cost Logic (Free shipping over $200)
  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === selectedShippingId) || SHIPPING_OPTIONS[0];
  const isFreeShipping = subtotal >= 200;
  const shippingCost = isFreeShipping ? 0 : selectedShipping.price;
  
  // Ensure total isn't negative
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyCoupon = () => {
    const coupon = MOCK_COUPONS.find(c => c.code === couponCode.trim().toUpperCase());
    if (coupon) {
      validateAndApply(coupon);
    } else {
      setCouponError("無效的優惠代碼");
      setAppliedCoupon(null);
    }
  };

  const validateAndApply = (coupon: Coupon) => {
    if (subtotal < coupon.minSpend) {
      setCouponError(`此優惠券需消費滿 $${coupon.minSpend}`);
    } else {
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setCouponError(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-serif font-bold text-stone-900">您的購物袋 ({items.length})</h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && onClear && (
              <button 
                onClick={onClear}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors mr-2 flex items-center gap-1"
                title="清空購物袋"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p>您的購物袋是空的。</p>
              <button onClick={onClose} className="mt-4 text-stone-900 underline text-sm">開始購物</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-24 h-32 flex-shrink-0 bg-stone-100 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-stone-900 line-clamp-1">{item.name}</h3>
                    <p className="text-stone-500 text-sm">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-stone-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm text-stone-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        <button 
                          onClick={() => onMoveToFavorites(item)}
                          className="text-xs text-stone-500 hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <Heart size={12} /> 移至收藏
                        </button>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={12} /> 移除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50 max-h-[50vh] overflow-y-auto custom-scrollbar">
            
            {/* Shipping Options */}
            <div className="mb-6">
               <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                 <Truck size={12} /> 運送方式
               </p>
               <div className="space-y-2">
                  {SHIPPING_OPTIONS.map(option => (
                    <div 
                      key={option.id}
                      onClick={() => setSelectedShippingId(option.id)}
                      className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all ${
                         selectedShippingId === option.id 
                           ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm' 
                           : 'border-stone-200 bg-stone-100/50 hover:border-stone-400'
                      }`}
                    >
                       <div>
                          <p className="font-bold text-sm text-stone-900">{option.name}</p>
                          <p className="text-xs text-stone-500">{option.description}</p>
                       </div>
                       <div className="text-right">
                          <p className={`font-medium text-sm ${isFreeShipping ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                            ${option.price}
                          </p>
                          {isFreeShipping && <p className="text-xs font-bold text-primary">免運</p>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              {!appliedCoupon ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="輸入優惠代碼" 
                        className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                      className="bg-stone-200 text-stone-900 px-4 py-2 text-sm font-medium hover:bg-stone-300 disabled:opacity-50 transition-colors"
                    >
                      套用
                    </button>
                  </div>

                  {/* Available Coupons List */}
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Ticket size={12} /> 可用優惠券
                    </p>
                    <div className="space-y-2">
                      {MOCK_COUPONS.map((coupon) => {
                        const isEligible = subtotal >= coupon.minSpend;
                        return (
                          <div 
                            key={coupon.code} 
                            className={`border rounded-lg p-3 flex justify-between items-center transition-colors ${
                              isEligible 
                                ? 'bg-white border-stone-200 hover:border-primary/30' 
                                : 'bg-stone-100 border-stone-200 opacity-60'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-sm text-stone-900">{coupon.code}</span>
                                <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">
                                  {coupon.discountType === 'percent' 
                                    ? `${Math.round((1 - coupon.value) * 100)}% OFF` 
                                    : `-$${coupon.value}`}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500">{coupon.description}</p>
                            </div>
                            <button
                              onClick={() => validateAndApply(coupon)}
                              disabled={!isEligible}
                              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                                isEligible
                                  ? 'bg-stone-900 text-white hover:bg-stone-700 shadow-sm'
                                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              }`}
                            >
                              使用
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-stone-400 hover:text-stone-600">
                    <X size={16} />
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><X size={12} /> {couponError}</p>}
            </div>

            <div className="flex justify-between mb-2 text-stone-600 text-sm">
              <span>小計</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-stone-600 text-sm">
              <span>運費 ({selectedShipping.name})</span>
              <span>{isFreeShipping ? <span className="text-primary font-bold">免運</span> : `$${shippingCost}`}</span>
            </div>
            {appliedCoupon && (
               <div className="flex justify-between mb-2 text-green-600 text-sm">
                <span>折扣 ({appliedCoupon.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-6 text-stone-900 font-bold text-lg border-t border-stone-200 pt-2">
              <span>總計</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => onCheckout(total, appliedCoupon, selectedShipping, shippingCost)}
              className="w-full bg-stone-900 text-white py-4 uppercase text-sm tracking-widest hover:bg-stone-800 transition-colors shadow-md"
            >
              前往結帳
            </button>
            <p className="text-center text-xs text-stone-400 mt-4">運費與稅金已計算</p>
          </div>
        )}
      </div>
    </div>
  );
};
