
import React, { useState } from 'react';
import { X, Sparkles, Camera, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { generateTryOn } from '../services/geminiService';

interface AiFittingRoomProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  userPhotos: string[];
}

export const AiFittingRoom: React.FC<AiFittingRoomProps> = ({
  isOpen,
  onClose,
  product,
  userPhotos
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!selectedPhoto) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateTryOn(selectedPhoto, product.image, product.category);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("AI 生成失敗，請稍後再試。");
      }
    } catch (e) {
      setError("連線發生錯誤。");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/90 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
               <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">AI 虛擬試衣間</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
           {generatedImage ? (
             <div className="h-full flex flex-col items-center">
               <div className="flex-1 w-full flex items-center justify-center bg-stone-100 rounded-lg mb-6 relative overflow-hidden">
                  <img src={generatedImage} alt="Generated Try-On" className="max-h-full max-w-full object-contain shadow-lg" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    AI 生成結果
                  </div>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={reset}
                    className="px-6 py-3 border border-stone-300 text-stone-600 font-medium rounded hover:bg-stone-50 transition-colors"
                  >
                    試穿其他照片
                  </button>
                  <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = `twyst-tryon-${product.id}.png`;
                        link.click();
                    }}
                    className="px-6 py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    下載圖片
                  </button>
               </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
               {/* Left: Product Info */}
               <div className="flex flex-col gap-6">
                  <div className="bg-stone-50 p-4 rounded-lg flex gap-4 items-center">
                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded" />
                    <div>
                       <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">正在試穿</p>
                       <h3 className="font-bold text-stone-900">{product.name}</h3>
                       <p className="text-sm text-stone-500">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                     <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                       <Camera size={18} /> 選擇您的全身照
                     </h3>
                     
                     {!userPhotos || userPhotos.length === 0 ? (
                       <div className="bg-stone-50 border border-dashed border-stone-300 rounded-lg p-8 text-center">
                          <p className="text-stone-500 mb-2">您尚未上傳任何照片</p>
                          <p className="text-xs text-stone-400">請前往「會員中心 > 我的試衣間」上傳</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                          {userPhotos.map((photo, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedPhoto(photo)}
                              className={`relative aspect-[3/4] cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                selectedPhoto === photo ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-stone-300'
                              }`}
                            >
                              <img src={photo} alt={`User ${idx}`} className="w-full h-full object-cover" />
                              {selectedPhoto === photo && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                   <div className="bg-primary text-white p-1 rounded-full">
                                     <Sparkles size={16} />
                                   </div>
                                </div>
                              )}
                            </div>
                          ))}
                       </div>
                     )}
                  </div>
               </div>

               {/* Right: Action */}
               <div className="flex flex-col justify-center items-center bg-stone-50 rounded-xl p-8 text-center border border-stone-100">
                  {loading ? (
                    <div className="space-y-4">
                       <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                       <h3 className="text-lg font-bold text-stone-900">Lumi 正在施展魔法...</h3>
                       <p className="text-sm text-stone-500">正在分析您的身形並進行虛擬試穿，這可能需要幾秒鐘。</p>
                    </div>
                  ) : (
                    <>
                       <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 text-primary">
                          <Sparkles size={32} />
                       </div>
                       <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">準備好了嗎？</h3>
                       <p className="text-stone-500 mb-8 max-w-xs">
                         選擇左側的一張照片，讓 AI 為您展示穿上這件單品的效果。
                       </p>
                       {error && (
                         <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4 flex items-center gap-2">
                           <X size={14} /> {error}
                         </div>
                       )}
                       <button
                         onClick={handleGenerate}
                         disabled={!selectedPhoto}
                         className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-stone-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                       >
                         生成試穿效果 <ArrowRight size={18} />
                       </button>
                    </>
                  )}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
