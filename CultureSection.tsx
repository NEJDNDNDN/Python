import React, { useState } from 'react';
import { getContentForTopic } from '../services/geminiService';
import { ContentCardData } from '../types';
import { Loader2, Shirt, PenTool, Music, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

interface Props {
  lang: 'en' | 'ar';
}

export const CultureSection: React.FC<Props> = ({ lang }) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [data, setData] = useState<ContentCardData | null>(null);
  const [loading, setLoading] = useState(false);

  const TOPICS = [
    { 
        id: 'tatreez', 
        title: lang === 'en' ? 'Embroidery (Tatreez)' : 'فن التطريز', 
        icon: <Shirt className="w-6 h-6" />, 
        prompt: lang === 'en' ? 'Explain Palestinian Tatreez, symbols, colors, regional differences, and its role in women identity.' : 'اشرح التطريز الفلسطيني، رموزه، ألوانه، واختلافاته بين المناطق (رام الله وغزة)، ودوره في هوية المرأة وصمودها.' 
    },
    { 
        id: 'keffiyeh', 
        title: lang === 'en' ? 'The Keffiyeh' : 'الكوفية والرمزية', 
        icon: <Shirt className="w-6 h-6" />, 
        prompt: lang === 'en' ? 'History of Keffiyeh, symbolism of fishnet and olive leaf patterns, and how it became a global symbol.' : 'تاريخ الكوفية، معنى نقوش شبكة الصيد، وورقة الزيتون، والخطوط العريضة، وكيف أصبحت رمزاً عالمياً للحرية.' 
    },
    { 
        id: 'poetry', 
        title: lang === 'en' ? 'Literature & Poetry' : 'الأدب والشعر', 
        icon: <PenTool className="w-6 h-6" />, 
        prompt: lang === 'en' ? 'Mahmoud Darwish, Ghassan Kanafani, and the role of poetry in preserving identity.' : 'محمود درويش، غسان كنفاني، ودور الشعر والأدب في حفظ الهوية وتخليد الرواية الفلسطينية.' 
    },
    { 
        id: 'dabke', 
        title: lang === 'en' ? 'Dabke Dance' : 'الدبكة الشعبية', 
        icon: <Music className="w-6 h-6" />, 
        prompt: lang === 'en' ? 'Origins of Dabke, musical instruments, and its role in weddings and connection to land.' : 'أصول الدبكة، الآلات الموسيقية (المجوز، اليرغول)، ودورها في الأعراس والاحتفالات كشكل من أشكال التمسك بالأرض.' 
    },
  ];

  const handleTopicSelect = async (topicId: string) => {
    setActiveTopic(topicId);
    setLoading(true);
    if (window.innerWidth < 1024) {
        setTimeout(() => {
            document.getElementById('culture-content')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    const topic = TOPICS.find(t => t.id === topicId)!;
    try {
      const result = await getContentForTopic(topic.title, topic.prompt, lang);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const texts = {
    title: lang === 'en' ? 'Living Identity' : 'الهوية الحية',
    subtitle: lang === 'en' ? '"From the threads of a dress to the rhythm of the land."' : '"من خيوط الثوب إلى إيقاع الأرض."',
    empty: lang === 'en' ? 'Choose a thread to weave the story' : 'اختر خيطاً من خيوط الحكاية',
    loading: lang === 'en' ? 'Weaving the story...' : 'ننسج الحكاية...',
    heritage: lang === 'en' ? 'Heritage' : 'تراث',
    keywords: lang === 'en' ? 'Keywords' : 'كلمات مفتاحية'
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-up">
      <div className="text-center mb-10 lg:mb-16">
        <h2 className="text-4xl lg:text-7xl font-display font-black text-palestine-black mb-4">{texts.title}</h2>
        <p className={`mt-4 text-slate-600 ${lang === 'en' ? 'font-classic text-xl italic' : 'font-serif text-lg'} lg:text-2xl`}>{texts.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Menu Side */}
        <div className="lg:col-span-4 space-y-3 lg:space-y-4">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic.id)}
              className={`w-full p-4 lg:p-6 rounded-2xl ${lang === 'ar' ? 'text-right border-r-4 lg:border-r-8' : 'text-left border-l-4 lg:border-l-8'} transition-all duration-300 group shadow-sm hover:shadow-md ${
                activeTopic === topic.id
                  ? 'bg-palestine-red text-white border-palestine-black transform lg:-translate-x-2'
                  : 'bg-white text-slate-800 border-transparent hover:bg-slate-50 hover:border-palestine-red/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className={`p-2 lg:p-3 rounded-xl ${activeTopic === topic.id ? 'bg-white/20' : 'bg-palestine-sand/30 text-palestine-olive'}`}>
                    {topic.icon}
                  </div>
                  <span className="font-display font-bold text-lg lg:text-xl">{topic.title}</span>
                </div>
                <div className="hidden lg:block">
                   {lang === 'ar' ? 
                     <ArrowLeft className={`w-6 h-6 transition-transform ${activeTopic === topic.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} /> :
                     <ArrowRight className={`w-6 h-6 transition-transform ${activeTopic === topic.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                   }
                </div>
                <div className="lg:hidden">
                    <ArrowDown className={`w-5 h-5 transition-transform ${activeTopic === topic.id ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Side */}
        <div id="culture-content" className="lg:col-span-8 min-h-[400px]">
          {!activeTopic ? (
            <div className="h-full min-h-[300px] lg:min-h-[500px] bg-white rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 lg:p-12 text-center group hover:border-palestine-olive/30 transition-colors">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-palestine-sand/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shirt className="w-8 h-8 lg:w-12 lg:h-12 text-palestine-olive/50" />
              </div>
              <p className={`text-lg lg:text-2xl font-bold ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{texts.empty}</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] lg:min-h-[500px] bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-palestine-red">
              <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin mb-6" />
              <p className={`text-xl lg:text-2xl font-bold ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{texts.loading}</p>
            </div>
          ) : data ? (
            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden animate-slide-in-right duration-700 border border-slate-100">
              {/* Decorative Header */}
              <div className="bg-palestine-black text-white p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="relative z-10 flex flex-col items-start gap-3 lg:gap-4">
                  <span className="bg-palestine-gold text-palestine-black px-3 py-1 lg:px-4 lg:py-1 rounded-full text-xs lg:text-sm font-black tracking-widest uppercase">{texts.heritage}</span>
                  <h3 className="text-3xl lg:text-5xl font-display font-black leading-tight">{lang === 'en' ? data.title || data.arabicTitle : data.arabicTitle}</h3>
                </div>
              </div>
              
              <div className="p-8 lg:p-16">
                <p className={`text-xl lg:text-2xl ${lang === 'en' ? 'font-classic italic' : 'font-serif'} text-palestine-olive mb-8 lg:mb-10 font-bold ${lang === 'ar' ? 'border-r-4 pr-6' : 'border-l-4 pl-6'} border-palestine-olive leading-relaxed`}>
                    {data.description}
                </p>
                <div className="prose prose-lg lg:prose-xl max-w-none">
                  <p className={`leading-loose text-slate-700 whitespace-pre-line text-justify font-medium ${lang === 'en' ? 'font-classic text-lg' : ''}`}>{data.details}</p>
                </div>
                
                <div className="mt-10 lg:mt-12 pt-8 lg:pt-10 border-t border-slate-100">
                    <h4 className="text-sm lg:text-base font-black text-slate-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span> {texts.keywords}
                    </h4>
                    <div className="flex flex-wrap gap-2 lg:gap-3">
                        {data.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 lg:px-4 lg:py-2 border border-slate-200 text-slate-600 rounded-xl text-sm lg:text-base font-bold bg-slate-50 hover:bg-slate-100 transition-colors">{tag}</span>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
