import React, { useState, useEffect } from 'react';
import { getContentForTopic } from '../services/geminiService';
import { ContentCardData } from '../types';
import { Clock, Loader2 } from 'lucide-react';

interface Props {
  lang: 'en' | 'ar';
}

export const HistorySection: React.FC<Props> = ({ lang }) => {
  
  const ERAS = [
    { id: 'ancient', title: lang === 'en' ? 'Ancient Canaan' : 'كنعان القديمة', context: lang === 'en' ? 'Bronze Age, Canaanite civilization, early trade.' : 'العصر البرونزي، الحضارة الكنعانية، وبدايات التجارة.' },
    { id: 'roman', title: lang === 'en' ? 'Roman Era' : 'العهد الروماني', context: lang === 'en' ? 'Architecture, mosaics, religious shifts.' : 'العمارة، الفسيفساء، والتحولات الدينية في فلسطين.' },
    { id: 'islamic', title: lang === 'en' ? 'Golden Age' : 'العصر الذهبي', context: lang === 'en' ? 'Umayyad and Abbasid eras, Dome of the Rock.' : 'الفترة الأموية والعباسية، بناء قبة الصخرة.' },
    { id: 'ottoman', title: lang === 'en' ? 'Ottoman Era' : 'العهد العثماني', context: lang === 'en' ? '400 years of rule, cultural fabric.' : '400 عام من الحكم، التحديث، والنسيج الثقافي.' },
    { id: 'modern', title: lang === 'en' ? 'Modern History' : 'التاريخ الحديث', context: lang === 'en' ? '20th Century, Nakba, Resistance.' : 'القرن العشرين، النكبة، والمقاومة المستمرة.' },
  ];

  const [selectedEra, setSelectedEra] = useState(ERAS[0]);
  const [data, setData] = useState<ContentCardData | null>(null);
  const [loading, setLoading] = useState(false);

  // Update selected era object when language changes (to keep correct title)
  useEffect(() => {
    const era = ERAS.find(e => e.id === selectedEra.id) || ERAS[0];
    setSelectedEra(era);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getContentForTopic(selectedEra.title, selectedEra.context, lang);
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedEra, lang]);

  const texts = {
    header: lang === 'en' ? 'Memory of the Land' : 'ذاكرة الأرض',
    subHeader: lang === 'en' ? '"We remain here, as long as thyme and olive trees remain"' : '"هنا باقون، ما بقي الزعتر والزيتون"',
    loading: lang === 'en' ? 'Summoning history...' : 'نستحضر التاريخ...',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-fade-up">
      <div className="text-center relative py-6 lg:py-10">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-palestine-gold/20 rounded-full blur-3xl"></div>
        <h2 className="text-4xl lg:text-7xl font-display font-black text-palestine-black mb-4 drop-shadow-lg">{texts.header}</h2>
        <div className="h-1.5 w-24 lg:w-32 bg-palestine-red mx-auto rounded-full"></div>
        <p className={`mt-4 lg:mt-6 text-slate-600 ${lang === 'en' ? 'font-classic text-xl' : 'font-serif text-lg'} font-bold lg:text-2xl`}>
          {texts.subHeader}
        </p>
      </div>

      {/* Timeline Nav */}
      <div className="relative">
          <div className="flex lg:flex-wrap overflow-x-auto pb-4 lg:pb-10 gap-3 px-2 scrollbar-hide snap-x snap-mandatory lg:justify-center">
            {ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era)}
                className={`flex-shrink-0 snap-center px-5 py-3 lg:px-6 lg:py-3 rounded-xl font-bold text-sm lg:text-lg transition-all duration-300 flex items-center gap-3 transform ${
                  selectedEra.id === era.id
                    ? 'bg-palestine-black text-palestine-gold shadow-xl scale-105 border-2 border-palestine-gold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-palestine-sand hover:text-black'
                }`}
              >
                {selectedEra.id === era.id && <Clock className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />}
                {era.title}
              </button>
            ))}
          </div>
      </div>

      {/* Content Area - THE "OLD PAPER" LOOK */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 text-palestine-olive">
            <div className="relative">
                 <div className="absolute inset-0 bg-palestine-green rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 animate-spin relative z-10" />
            </div>
            <p className={`text-xl lg:text-2xl mt-6 font-bold ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>{texts.loading}</p>
          </div>
        ) : data ? (
          <div className="old-paper rounded-[0.5rem] lg:rounded-[1rem] shadow-2xl overflow-hidden relative group transform hover:scale-[1.01] transition-transform duration-700 animate-zoom-in border-4 border-double border-palestine-ink/20">
            {/* Ragged edge effect at top/bottom via CSS mask or just visual styling */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_80px_rgba(44,36,27,0.2)] z-20"></div>

            <div className="p-8 lg:p-20 relative z-10">
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8 mb-8 lg:mb-10 border-b-2 border-palestine-ink/20 pb-8 border-dashed">
                <div className="w-full">
                  <h3 className={`text-4xl lg:text-6xl font-black text-palestine-ink mb-4 leading-tight ${lang === 'en' ? 'font-display uppercase tracking-wider' : 'font-display'}`}>
                    {lang === 'en' ? data.title || data.arabicTitle : data.arabicTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {data.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 lg:px-4 lg:py-1.5 bg-palestine-ink text-palestine-paper border border-palestine-gold text-xs lg:text-sm font-bold rounded shadow-sm tracking-wide">
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-palestine-ink/5 p-6 rounded-lg border border-palestine-ink/10 w-full lg:max-w-sm rotate-1 shadow-sm">
                    <p className={`${lang === 'en' ? 'font-classic text-xl italic' : 'font-serif text-lg'} text-palestine-ink/80 font-bold text-justify leading-relaxed`}>
                        {data.description}
                    </p>
                </div>
              </div>

              <div className={`prose prose-lg lg:prose-2xl max-w-none text-palestine-ink leading-loose ${lang === 'en' ? 'font-classic' : 'font-serif'}`}>
                <div className="whitespace-pre-line columns-1 lg:columns-2 gap-12 lg:gap-24 text-justify first-letter:text-5xl first-letter:font-black first-letter:text-palestine-red first-letter:mr-2 first-letter:float-left">
                    {data.details}
                </div>
              </div>

              {/* Signature/Seal area */}
              <div className="mt-12 flex justify-end opacity-60">
                 <div className="w-24 h-24 border-4 border-palestine-red/30 rounded-full flex items-center justify-center rotate-[-15deg] mix-blend-multiply">
                    <span className="text-palestine-red/40 font-black text-xs uppercase text-center leading-none">Palestine<br/>Eternal<br/>Archive</span>
                 </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
