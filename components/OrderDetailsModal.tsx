
import React from 'react';
import { X, Package, Truck, CheckCircle, MapPin, CreditCard, Download, ExternalLink } from 'lucide-react';
import { Order } from '../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Logic to determine progress step
  const getProgressStep = (status: string) => {
    switch (status) {
      case '處理中': return 1;
      case '已出貨': return 2;
      case '已完成': return 3;
      case '已取消': return 0; // Handle separately or show 0
      default: return 1;
    }
  };

  const currentStep = getProgressStep(order.status);
  const isCancelled = order.status === '已取消';

  // Calculate Mock Delivery Date (Order Date + 5 days)
  const orderDateObj = new Date(order.date);
  const estDeliveryDate = new Date(orderDateObj);
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 5);
  const formattedDelivery = estDeliveryDate.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });

  // Calculate costs
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Use stored shipping cost if available, otherwise fallback (for legacy mock orders)
  const shippingCost = order.shippingCost !== undefined ? order.shippingCost : (subtotal >= 200 ? 0 : 60);
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col animate-scale-up relative">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex justify-between items-start sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h3 className="text-xl font-serif font-bold">訂單詳情</h3>
               <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                 isCancelled ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
               }`}>
                 {order.status}
               </span>
            </div>
            <p className="text-stone-400 text-sm">編號: {order.id} • 日期: {order.date}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Progress Tracker */}
          {!isCancelled && (
            <div>
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">物流進度</h4>
              <div className="relative flex justify-between items-center px-2">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-100 -z-10"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-1000"
                  style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                ></div>

                {/* Steps */}
                <div className="flex flex-col items-center gap-2 bg-white px-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-stone-200 text-stone-400'}`}>
                     <Package size={16} />
                   </div>
                   <span className={`text-xs font-medium ${currentStep >= 1 ? 'text-stone-900' : 'text-stone-400'}`}>訂單成立</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white px-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-stone-200 text-stone-400'}`}>
                     <Truck size={16} />
                   </div>
                   <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-stone-900' : 'text-stone-400'}`}>已出貨</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white px-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                     <CheckCircle size={16} />
                   </div>
                   <span className={`text-xs font-medium ${currentStep >= 3 ? 'text-stone-900' : 'text-stone-400'}`}>已送達</span>
                </div>
              </div>
              {currentStep < 3 && (
                 <p className="text-center text-xs text-stone-500 mt-4 bg-stone-50 py-2 rounded">
                   預計送達時間：<span className="font-bold text-stone-900">{formattedDelivery}</span>
                 </p>
              )}
            </div>
          )}

          {/* Items List */}
          <div>
             <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">購買商品 ({order.items.length})</h4>
             <div className="border border-stone-200 rounded-lg overflow-hidden">
               {order.items.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                    <div className="w-16 h-20 bg-stone-100 rounded flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-stone-900 truncate">{item.name}</h5>
                      <p className="text-xs text-stone-500 mb-1">{item.category}</p>
                      <p className="text-xs text-stone-500">數量: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Info Grid (Mock Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <MapPin size={16} /> 配送資訊
               </h4>
               <div className="bg-stone-50 p-4 rounded-lg text-sm text-stone-600 space-y-1">
                 <p className="font-bold text-stone-900">王小美</p>
                 <p>0912-345-678</p>
                 <p>台北市信義區信義路五段7號</p>
                 <p>11049</p>
                 {order.shippingMethod && (
                    <p className="mt-2 pt-2 border-t border-stone-200 text-stone-800 font-medium flex items-center gap-1">
                        <Truck size={14} /> {order.shippingMethod.name}
                    </p>
                 )}
               </div>
            </div>
            <div>
               <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <CreditCard size={16} /> 付款詳情
               </h4>
               <div className="bg-stone-50 p-4 rounded-lg text-sm text-stone-600 space-y-1">
                 <p className="flex justify-between">
                   <span>付款方式</span>
                   <span className="font-bold text-stone-900">信用卡 (Visa **** 4242)</span>
                 </p>
                 <p className="flex justify-between">
                   <span>付款狀態</span>
                   <span className="text-green-600 font-bold">已付款</span>
                 </p>
               </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
             <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">費用明細</h4>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between text-stone-600">
                 <span>小計</span>
                 <span>${subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-stone-600">
                 <span>運費 {order.shippingMethod ? `(${order.shippingMethod.name})` : ''}</span>
                 <span>{shippingCost === 0 ? '免運費' : `$${shippingCost.toFixed(2)}`}</span>
               </div>
               {order.discount && order.discount > 0 && (
                 <div className="flex justify-between text-green-600">
                   <span>折扣優惠</span>
                   <span>-${order.discount.toFixed(2)}</span>
                 </div>
               )}
               <div className="flex justify-between font-serif font-bold text-xl text-stone-900 pt-4 border-t border-stone-100">
                 <span>總計</span>
                 <span>${order.total.toFixed(2)}</span>
               </div>
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button className="flex-1 py-3 border border-stone-200 rounded flex items-center justify-center gap-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm font-medium">
              <Download size={16} /> 下載發票
            </button>
             {!isCancelled && (
              <button className="flex-1 py-3 bg-stone-900 text-white rounded flex items-center justify-center gap-2 hover:bg-stone-700 transition-colors text-sm font-medium">
                <ExternalLink size={16} /> 追蹤包裹
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
