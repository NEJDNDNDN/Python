import React, { useState } from 'react';
import { getRecipeDetails } from '../services/geminiService';
import { RecipeData } from '../types';
import { Loader2, ChefHat, Utensils, X } from 'lucide-react';
import { Button } from './Button';

interface Props {
  lang: 'en' | 'ar';
}

export const CuisineSection: React.FC<Props> = ({ lang }) => {
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(false);

  const DISHES = [
    { name: lang === 'en' ? 'Maqluba' : 'المقلوبة', emoji: '🥘' },
    { name: lang === 'en' ? 'Musakhan' : 'المسخن', emoji: '🍗' },
    { name: lang === 'en' ? 'Hummus' : 'الحمص', emoji: '🥣' },
    { name: lang === 'en' ? 'Falafel' : 'الفلافل', emoji: '🧆' },
    { name: lang === 'en' ? 'Knafeh' : 'الكنافة', emoji: '🧀' },
    { name: lang === 'en' ? 'Waraq Enab' : 'ورق العنب', emoji: '🍇' },
  ];

  const handleDishClick = async (dishName: string) => {
    setSelectedDish(dishName);
    setRecipe(null);
    setLoading(true);
    try {
      const data = await getRecipeDetails(dishName, lang);
      setRecipe(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const texts = {
    title: lang === 'en' ? 'Palestinian Table' : 'المائدة الفلسطينية',
    subtitle: lang === 'en' ? '"Taste of the land, scent of ancestors."' : '"طعم الأرض، ورائحة الأجداد."',
    loading: lang === 'en' ? 'Preparing ingredients...' : 'نحضر المكونات...',
    tagline: lang === 'en' ? 'Our Cuisine Our Heritage' : 'مطبخنا تراثنا',
    ingredients: lang === 'en' ? 'Ingredients' : 'المكونات',
    steps: lang === 'en' ? 'Preparation' : 'طريقة التحضير',
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="text-center mb-10 lg:mb-16">
        <h2 className="text-4xl lg:text-7xl font-display font-black text-palestine-black mb-4">{texts.title}</h2>
        <p className={`mt-4 text-slate-600 ${lang === 'en' ? 'font-classic text-xl italic' : 'font-serif text-lg'} lg:text-2xl`}>{texts.subtitle}</p>
      </div>

      {!selectedDish ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {DISHES.map((dish) => (
            <button
              key={dish.name}
              onClick={() => handleDishClick(dish.name)}
              className="group relative bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-palestine-sand/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-palestine-olive/20 transition-colors"></div>
              
              <div className="text-6xl lg:text-7xl mb-6 lg:mb-8 transform group-hover:scale-125 transition-transform duration-500 drop-shadow-lg text-center">{dish.emoji}</div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 group-hover:text-palestine-green transition-colors text-center">{dish.name}</h3>
              <div className="mt-4 w-12 h-1 bg-slate-200 group-hover:bg-palestine-red transition-colors rounded-full mx-auto"></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] border border-slate-200 animate-zoom-in duration-500">
           {/* Close Button */}
           <button 
              onClick={() => setSelectedDish(null)}
              className={`absolute top-4 ${lang === 'ar' ? 'left-4 lg:left-6' : 'right-4 lg:right-6'} z-20 p-3 bg-white/80 backdrop-blur-md hover:bg-palestine-red hover:text-white rounded-full transition-all shadow-lg`}
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[600px] space-y-6">
              <Loader2 className="w-16 h-16 lg:w-20 lg:h-20 text-palestine-olive animate-spin" />
              <p className={`text-2xl lg:text-3xl ${lang === 'en' ? 'font-classic' : 'font-serif'} text-palestine-olive font-bold`}>{texts.loading}</p>
            </div>
          ) : recipe ? (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
               {/* Context Side */}
               <div className="bg-palestine-black text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden order-1 md:order-1 min-h-[300px]">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-4 py-2 border border-palestine-gold text-palestine-gold rounded-full text-xs lg:text-sm font-bold tracking-widest mb-4 lg:mb-6">{texts.tagline}</span>
                    <h2 className="text-4xl lg:text-6xl font-display font-black mb-4 leading-tight">{lang === 'en' ? recipe.name : recipe.arabicName}</h2>
                    <h3 className={`text-2xl lg:text-3xl ${lang === 'en' ? 'font-classic' : 'font-serif'} text-palestine-sand mb-8 lg:mb-10 opacity-80`}>{lang === 'en' ? recipe.arabicName : recipe.name}</h3>
                    
                    <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 ${lang === 'ar' ? 'border-r-4' : 'border-l-4'} border-palestine-gold`}>
                        <Utensils className="w-6 h-6 lg:w-8 lg:h-8 mb-4 text-palestine-gold" />
                        <p className={`text-lg lg:text-xl leading-loose ${lang === 'en' ? 'font-classic italic' : 'font-serif'} font-medium`}>"{recipe.culturalSignificance}"</p>
                    </div>
                  </div>
               </div>

               {/* Recipe Side */}
               <div className="p-8 lg:p-16 md:overflow-y-auto h-full bg-slate-50 order-2 md:order-2">
                  <p className={`text-slate-700 text-lg lg:text-xl mb-8 lg:mb-12 font-bold leading-relaxed ${lang === 'en' ? 'font-classic' : ''}`}>{recipe.description}</p>
                  
                  <div className="mb-10 lg:mb-12">
                    <h4 className="flex items-center gap-4 text-xl lg:text-2xl font-black text-palestine-red mb-6 font-display">
                        <div className="w-2 lg:w-3 h-8 lg:h-10 bg-palestine-red rounded-full"></div> {texts.ingredients}
                    </h4>
                    <ul className="grid grid-cols-1 gap-3 lg:gap-4">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className={`flex items-center gap-3 lg:gap-4 text-slate-800 text-base lg:text-lg p-3 bg-white rounded-xl shadow-sm border border-slate-100 ${lang === 'en' ? 'font-classic font-bold' : ''}`}>
                                <span className="w-2 h-2 bg-palestine-green rounded-full flex-shrink-0"></span>
                                {ing}
                            </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-4 text-xl lg:text-2xl font-black text-palestine-red mb-6 font-display">
                        <div className="w-2 lg:w-3 h-8 lg:h-10 bg-palestine-red rounded-full"></div> {texts.steps}
                    </h4>
                    <ol className="space-y-4 lg:space-y-6">
                        {recipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-4 lg:gap-6">
                                <span className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-palestine-black text-white rounded-full flex items-center justify-center font-bold shadow-md text-base lg:text-xl">{i + 1}</span>
                                <p className={`text-slate-700 leading-loose text-base lg:text-lg mt-1 font-medium ${lang === 'en' ? 'font-classic' : ''}`}>{step}</p>
                            </li>
                        ))}
                    </ol>
                  </div>
               </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
