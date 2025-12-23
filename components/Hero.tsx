
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      <img 
        src="https://picsum.photos/id/435/1920/1080" 
        alt="穿著時尚的女性" 
        className="absolute inset-0 w-full h-full object-cover object-top animate-ken-burns"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white animate-fade-in-up">
            <p className="text-sm md:text-base uppercase tracking-[0.2em] mb-4 font-medium text-stone-200">Spring Collection 2024</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg">
              優雅，<br/>是唯一不會褪色的美。
            </h1>
            <p className="text-lg md:text-xl mb-10 text-stone-100 font-light leading-relaxed max-w-lg drop-shadow-md">
              探索我們專為重視品質、舒適與永恆風格的現代女性設計的全新春季系列。
            </p>
            <button 
              onClick={onShopNow}
              className="group bg-white text-stone-900 px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-stone-100 transition-all duration-300 flex items-center gap-3"
            >
              立即選購 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
