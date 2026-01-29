import React, { useState } from 'react';
import { getCityDetails } from '../services/geminiService';
import { CityData } from '../types';
import { Loader2, Landmark, Users, BookOpen, MapPin } from 'lucide-react';

interface Props {
  lang: 'en' | 'ar';
}

export const CityExplorer: React.FC<Props> = ({ lang }) => {
    const CITIES = lang === 'en' 
      ? ['Jerusalem', 'Gaza', 'Nablus', 'Hebron', 'Bethlehem', 'Ramallah', 'Haifa', 'Jaffa', 'Acre', 'Jericho']
      : ['القدس', 'غزة', 'نابلس', 'الخليل', 'بيت لحم', 'رام الله', 'حيفا', 'يافا', 'عكا', 'أريحا'];

    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [cityData, setCityData] = useState<CityData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelect = async (city: string) => {
        setSelectedCity(city);
        setCityData(null);
        setLoading(true);
        try {
            const data = await getCityDetails(city, lang);
            setCityData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const texts = {
      title: lang === 'en' ? 'Cities of the Story' : 'مدن الحكاية',
      subtitle: lang === 'en' ? '"Stones that speak history, and walls that embrace the sky."' : '"حجارة تنطق بالتاريخ، وأسوار تعانق السماء."',
      population: lang === 'en' ? 'Population' : 'السكان',
      significance: lang === 'en' ? 'Significance' : 'الأهمية',
      landmarks: lang === 'en' ? 'Prominent Landmarks' : 'أبرز المعالم الشامخة',
      cityLabel: lang === 'en' ? 'Palestinian City' : 'مدينة فلسطينية',
      landmarkSub: lang === 'en' ? 'Iconic Landmark' : 'رمز من رموز المدينة',
      loading: lang === 'en' ? `Exploring alleys of ${selectedCity}...` : `نتجول في أزقة ${selectedCity}...`,
      empty: lang === 'en' ? 'Select a city to explore' : 'اختر مدينة لتبدأ الاستكشاف'
    };

    return (
        <div className="max-w-7xl mx-auto min-h-[700px] animate-fade-up">
             <div className="text-center mb-10 lg:mb-16 relative">
                <h2 className="text-4xl lg:text-7xl font-display font-black text-palestine-black mb-4">{texts.title}</h2>
                <p className={`mt-4 text-slate-600 ${lang === 'en' ? 'font-classic text-xl italic' : 'font-serif text-lg'} lg:text-2xl`}>{texts.subtitle}</p>
            </div>

            {/* City Selector */}
            <div className="relative mb-10 lg:mb-16">
                <div className="flex lg:flex-wrap overflow-x-auto gap-3 lg:gap-4 pb-4 px-2 scrollbar-hide lg:justify-center">
                    {CITIES.map(city => (
                        <button
                            key={city}
                            onClick={() => handleSelect(city)}
                            className={`flex-shrink-0 group relative px-6 py-3 lg:px-8 lg:py-4 rounded-2xl font-display font-bold text-base lg:text-lg transition-all duration-300 overflow-hidden ${
                                selectedCity === city 
                                ? 'bg-palestine-red text-white shadow-xl scale-105 ring-4 ring-palestine-red/20' 
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-palestine-green hover:shadow-lg'
                            }`}
                        >
                            <span className="relative z-10">{city}</span>
                            {selectedCity !== city && <div className="absolute inset-0 bg-palestine-green/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 lg:py-32 bg-white/50 rounded-3xl backdrop-blur-sm border border-slate-100 shadow-xl">
                    <Loader2 className="w-16 h-16 lg:w-20 lg:h-20 text-palestine-olive animate-spin mx-auto mb-6" />
                    <p className={`font-serif text-xl lg:text-2xl text-slate-800 font-bold animate-pulse ${lang === 'en' ? 'font-classic' : ''}`}>{texts.loading}</p>
                </div>
            ) : cityData ? (
                <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row animate-zoom-in duration-700">
                    
                    {/* Visual Side */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-palestine-green to-teal-900 p-8 lg:p-12 text-white relative overflow-hidden group min-h-[300px]">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                        <div className="absolute top-0 right-0 p-40 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md mb-6 border border-white/20">
                                    <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-palestine-gold" />
                                    <span className="font-bold text-sm lg:text-base">{texts.cityLabel}</span>
                                </div>
                                <h2 className="text-5xl lg:text-7xl font-display font-black mb-4 leading-none">{lang === 'en' ? cityData.name : cityData.arabicName}</h2>
                                <h3 className="text-xl lg:text-2xl font-serif text-palestine-sand opacity-80">{lang === 'en' ? cityData.arabicName : cityData.name}</h3>
                            </div>
                            
                            <div className="space-y-4 lg:space-y-6 mt-8 lg:mt-12">
                                <div className="bg-black/20 p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors">
                                    <div className="flex items-center gap-3 text-palestine-gold font-bold mb-2 text-base lg:text-lg">
                                        <Users className="w-5 h-5 lg:w-6 lg:h-6" /> {texts.population}
                                    </div>
                                    <p className={`text-base lg:text-lg leading-relaxed ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{cityData.population}</p>
                                </div>
                                <div className="bg-black/20 p-4 lg:p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors">
                                    <div className="flex items-center gap-3 text-palestine-gold font-bold mb-2 text-base lg:text-lg">
                                        <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" /> {texts.significance}
                                    </div>
                                    <p className={`text-base lg:text-lg leading-relaxed ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{cityData.significance}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-3/5 p-8 lg:p-16 bg-slate-50 relative">
                        <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-full h-2 bg-gradient-to-r from-palestine-red via-transparent to-transparent`}></div>
                        
                        <h4 className="text-2xl lg:text-3xl font-black text-slate-800 mb-6 lg:mb-8 font-display flex items-center gap-4">
                            <span className="w-10 lg:w-12 h-1 bg-palestine-black rounded-full"></span>
                            {texts.landmarks}
                        </h4>
                        
                        <div className="grid gap-4 lg:gap-6">
                            {cityData.landmarks.map((lm, i) => (
                                <div key={i} className={`group flex gap-4 lg:gap-6 items-start p-4 lg:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-palestine-olive transition-all duration-300 transform ${lang === 'ar' ? 'hover:-translate-x-2' : 'hover:translate-x-2'}`}>
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-palestine-olive/10 flex items-center justify-center text-palestine-olive flex-shrink-0 group-hover:bg-palestine-olive group-hover:text-white transition-all duration-300">
                                        <Landmark className="w-6 h-6 lg:w-8 lg:h-8" />
                                    </div>
                                    <div>
                                        <h5 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-palestine-green transition-colors mb-1 lg:mb-2">{lm}</h5>
                                        <p className="text-slate-500 text-xs lg:text-sm">{texts.landmarkSub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-400 py-16 lg:py-24 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <MapPin className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 opacity-10" />
                    <p className={`text-xl lg:text-2xl font-bold ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{texts.empty}</p>
                </div>
            )}
        </div>
    );
};
