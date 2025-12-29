import React, { useState, useEffect } from 'react';
import { Section } from './types';
import { HistorySection } from './components/HistorySection';
import { CultureSection } from './components/CultureSection';
import { CuisineSection } from './components/CuisineSection';
import { CityExplorer } from './components/CityExplorer';
import { GuideChat } from './components/GuideChat';
import { IntroAnimation } from './components/IntroAnimation';
import { Scroll, Map, Utensils, Shirt, MessageCircle, Menu, X, Heart, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);
  const [showIntro, setShowIntro] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Update HTML dir attribute based on language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const renderContent = () => {
    switch (currentSection) {
      case Section.HISTORY:
        return <HistorySection lang={lang} />;
      case Section.CULTURE:
        return <CultureSection lang={lang} />;
      case Section.CUISINE:
        return <CuisineSection lang={lang} />;
      case Section.CITIES:
        return <CityExplorer lang={lang} />;
      case Section.GUIDE:
        return <GuideChat lang={lang} />;
      default:
        return <HomeView onNavigate={setCurrentSection} lang={lang} />;
    }
  };

  const t = {
    title: lang === 'en' ? 'Palestine' : 'فلسطين',
    subtitle: lang === 'en' ? 'The Timeless Journey' : 'رحلة الخلود',
    askGuide: lang === 'en' ? 'Ask Hadi' : 'اسأل المرشد',
    developedBy: lang === 'en' ? 'Designed & Developed with Pride' : 'تصميم وتطوير بكل فخر',
    author: lang === 'en' ? 'Ahmed Mahmoud' : 'أحمد محمود',
    quote: lang === 'en' ? '"We have on this land that which makes life worth living"' : '"عَلى هَذِهِ الأَرْضِ مَا يَسْتَحِقُّ الحَيَاةْ"',
  };

  const navItems = [
    { id: Section.HISTORY, label: lang === 'en' ? 'History' : 'التاريخ', icon: <Scroll className="w-4 h-4"/> },
    { id: Section.CITIES, label: lang === 'en' ? 'Cities' : 'المدن', icon: <Map className="w-4 h-4"/> },
    { id: Section.CUISINE, label: lang === 'en' ? 'Cuisine' : 'المطبخ', icon: <Utensils className="w-4 h-4"/> },
    { id: Section.CULTURE, label: lang === 'en' ? 'Culture' : 'الثقافة', icon: <Shirt className="w-4 h-4"/> },
  ];

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      <div className={`min-h-screen bg-[#FDFBF7] font-sans transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-palestine-gold/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
              <div 
                  className="flex items-center gap-3 lg:gap-4 cursor-pointer group select-none" 
                  onClick={() => {
                      setCurrentSection(Section.HOME);
                      setIsMobileMenuOpen(false);
                  }}
              >
                  <div className="relative">
                     <div className="absolute inset-0 bg-palestine-red rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-black to-slate-800 border-2 border-palestine-gold flex items-center justify-center relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-xl lg:text-2xl">🇵🇸</span>
                     </div>
                  </div>
                  <div>
                    <h1 className={`font-display font-black text-xl lg:text-2xl tracking-tight text-slate-900 group-hover:text-palestine-green transition-colors ${lang === 'en' ? 'uppercase' : ''}`}>
                        {t.title}
                    </h1>
                    <p className="text-[10px] lg:text-xs font-serif text-palestine-gold font-bold">{t.subtitle}</p>
                  </div>
              </div>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-3">
                  {navItems.map(item => (
                      <NavButton 
                        key={item.id}
                        active={currentSection === item.id} 
                        onClick={() => setCurrentSection(item.id)} 
                        icon={item.icon} 
                        label={item.label} 
                      />
                  ))}
                  
                  {/* Language Toggle */}
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-palestine-olive hover:text-palestine-olive transition-colors font-bold text-sm mx-2"
                  >
                    <Globe className="w-4 h-4" />
                    {lang === 'en' ? 'العربية' : 'English'}
                  </button>

                  <div className="w-px h-8 bg-slate-200 mx-1"></div>
                  <button 
                      onClick={() => setCurrentSection(Section.GUIDE)}
                      className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 transform hover:scale-105 shadow-md active:scale-95 ${
                          currentSection === Section.GUIDE 
                          ? 'bg-palestine-black text-palestine-gold border border-palestine-gold ring-2 ring-palestine-gold/20' 
                          : 'bg-palestine-olive text-white hover:bg-palestine-green hover:shadow-lg'
                      }`}
                  >
                      <MessageCircle className="w-4 h-4" /> {t.askGuide}
                  </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-2">
                 <button 
                    onClick={toggleLanguage}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <span className="font-bold text-sm">{lang === 'en' ? 'AR' : 'EN'}</span>
                  </button>
                <button 
                  className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-fade-up">
                  <div className="p-4 space-y-2">
                      {navItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                                setCurrentSection(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${
                                currentSection === item.id 
                                ? 'bg-palestine-sand/30 text-palestine-black' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                              {item.icon} {item.label}
                          </button>
                      ))}
                      <div className="h-px bg-slate-100 my-2"></div>
                      <button
                        onClick={() => {
                            setCurrentSection(Section.GUIDE);
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 rounded-xl font-bold bg-palestine-black text-palestine-gold"
                      >
                           <MessageCircle className="w-4 h-4" /> {t.askGuide}
                      </button>
                  </div>
              </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-12 min-h-[calc(100vh-80px)]">
          {renderContent()}
        </main>

        {/* Professional Footer */}
        <footer className="bg-[#111] text-slate-400 py-12 lg:py-16 text-center relative overflow-hidden mt-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-palestine-red via-palestine-white to-palestine-green"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
          
          <div className="relative z-10 container mx-auto px-4">
             <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">{t.title}</h2>
             <p className="font-serif italic text-lg lg:text-xl text-palestine-gold mb-8 leading-loose max-w-2xl mx-auto">
                {t.quote}
             </p>
             
             <div className="w-16 h-1 bg-white/10 mx-auto mb-8 rounded-full"></div>

             <div className="flex flex-col items-center gap-2 text-sm lg:text-base font-medium text-slate-500 hover:text-white transition-colors duration-300">
                <span className="flex items-center gap-2">
                    {t.developedBy} <Heart className="w-4 h-4 text-palestine-red animate-pulse" fill="#CE1126" />
                </span>
                <span className="text-palestine-gold font-bold text-lg tracking-wide border-b border-palestine-gold/30 pb-1">
                    {t.author}
                </span>
             </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl text-base font-bold transition-all flex items-center gap-2 duration-300 ${
            active 
            ? 'text-white bg-palestine-red shadow-lg transform -translate-y-1' 
            : 'text-slate-600 hover:text-palestine-black hover:bg-slate-100 hover:shadow-sm'
        }`}
    >
        {icon} {label}
    </button>
);

const HomeView: React.FC<{ onNavigate: (section: Section) => void; lang: 'en' | 'ar' }> = ({ onNavigate, lang }) => {
    const texts = {
        titleStart: lang === 'en' ? 'Land of' : 'أرض',
        titleHighlight: lang === 'en' ? 'Olives' : 'الزيتون',
        desc: lang === 'en' ? 'A journey through time and place... to discover the greatness of history, the beauty of resilience, and the magic of heritage.' : 'رحلة عبر الزمان والمكان.. لاكتشاف عظمة التاريخ، وجمال الصمود، وسحر التراث.',
        cta: lang === 'en' ? 'Begin Journey' : 'ابدأ الرحلة',
        features: {
            history: { title: lang === 'en' ? 'Ancient History' : 'التاريخ العريق', desc: lang === 'en' ? 'Cradle of Civilizations' : 'مهد الحضارات والأنبياء' },
            cities: { title: lang === 'en' ? 'Eternal Cities' : 'المدن الخالدة', desc: lang === 'en' ? 'From Jerusalem to Gaza' : 'من القدس إلى غزة' },
            cuisine: { title: lang === 'en' ? 'Palestinian Cuisine' : 'المائدة الفلسطينية', desc: lang === 'en' ? 'Flavors telling stories' : 'نكهات تروي قصصاً' },
            culture: { title: lang === 'en' ? 'Heritage & Identity' : 'التراث والهوية', desc: lang === 'en' ? 'Embroidery, Poetry, Art' : 'تطريز، شعر، وفنون' },
        },
        quote: lang === 'en' ? 'Our roots are deep in the earth like Roman olive trees, and our branches embrace the sky.' : 'جذورنا ضاربة في الأرض كشجر الزيتون الروماني، وأغصاننا تعانق السماء.'
    };

    return (
        <div className="space-y-16 lg:space-y-24 animate-reveal">
            {/* Hero */}
            <div className="text-center py-12 lg:py-24 relative isolate">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-tr from-palestine-red/10 via-palestine-green/10 to-palestine-black/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                
                {/* Floating Geometric Elements - Hidden on mobile for cleaner look, visible on desktop */}
                <div className="hidden lg:block absolute top-0 right-10 w-24 h-24 border-4 border-palestine-gold/20 rounded-full animate-float"></div>
                <div className="hidden lg:block absolute bottom-10 left-10 w-32 h-32 border-4 border-palestine-green/20 rotate-45 animate-float" style={{animationDelay: '1s'}}></div>

                <h1 className="text-6xl lg:text-9xl font-display font-black text-slate-900 mb-6 lg:mb-8 tracking-tighter leading-none drop-shadow-xl animate-fade-up">
                    {texts.titleStart} <span className="text-palestine-olive">{texts.titleHighlight}</span>
                </h1>
                <p className={`text-xl lg:text-4xl ${lang === 'en' ? 'font-classic' : 'font-serif'} text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 animate-fade-up`} style={{animationDelay: '0.2s'}}>
                    {texts.desc}
                </p>
                
                <div className="mt-10 lg:mt-12 flex justify-center gap-4 animate-fade-up" style={{animationDelay: '0.4s'}}>
                   <button onClick={() => onNavigate(Section.HISTORY)} className="bg-palestine-black text-white px-8 py-4 lg:px-10 lg:py-5 rounded-full font-bold text-lg lg:text-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 active:scale-95">
                      {texts.cta} <Scroll className="w-5 h-5 lg:w-6 lg:h-6"/>
                   </button>
                </div>
            </div>

            {/* Grid Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-2">
                <FeatureCard 
                    title={texts.features.history.title}
                    desc={texts.features.history.desc}
                    icon={<Scroll className="w-8 h-8 lg:w-10 lg:h-10"/>} 
                    color="from-slate-900 to-black" 
                    accent="bg-palestine-black"
                    onClick={() => onNavigate(Section.HISTORY)}
                    delay="0s"
                    lang={lang}
                />
                <FeatureCard 
                    title={texts.features.cities.title}
                    desc={texts.features.cities.desc}
                    icon={<Map className="w-8 h-8 lg:w-10 lg:h-10"/>} 
                    color="from-green-700 to-palestine-green" 
                    accent="bg-palestine-green"
                    onClick={() => onNavigate(Section.CITIES)}
                    delay="0.1s"
                    lang={lang}
                />
                <FeatureCard 
                    title={texts.features.cuisine.title}
                    desc={texts.features.cuisine.desc}
                    icon={<Utensils className="w-8 h-8 lg:w-10 lg:h-10"/>} 
                    color="from-red-700 to-palestine-red" 
                    accent="bg-palestine-red"
                    onClick={() => onNavigate(Section.CUISINE)}
                    delay="0.2s"
                    lang={lang}
                />
                <FeatureCard 
                    title={texts.features.culture.title}
                    desc={texts.features.culture.desc}
                    icon={<Shirt className="w-8 h-8 lg:w-10 lg:h-10"/>} 
                    color="from-yellow-600 to-palestine-gold" 
                    accent="bg-palestine-gold"
                    onClick={() => onNavigate(Section.CULTURE)}
                    delay="0.3s"
                    lang={lang}
                />
            </div>
            
            {/* Quote Section */}
            <div className="max-w-5xl mx-auto text-center border-y-2 border-palestine-gold/30 py-12 lg:py-16 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm my-12 animate-zoom-in">
                <div className="w-12 h-12 mx-auto bg-palestine-olive rounded-full flex items-center justify-center text-white mb-6">
                    <span className="text-2xl font-serif">❝</span>
                </div>
                <p className={`text-2xl lg:text-5xl ${lang === 'en' ? 'font-classic' : 'font-serif'} text-slate-800 leading-normal font-bold px-4`}>
                    {texts.quote}
                </p>
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; color: string; accent: string; onClick: () => void; delay: string; lang: string }> = ({ title, desc, icon, color, accent, onClick, delay, lang }) => (
    <button 
        onClick={onClick}
        className={`group relative overflow-hidden rounded-[2rem] p-6 lg:p-8 ${lang === 'ar' ? 'text-right' : 'text-left'} bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-fade-up`}
        style={{ animationDelay: delay }}
    >
        {/* Hover Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Icon */}
        <div className={`w-16 h-16 lg:w-20 lg:h-20 ${accent} text-white rounded-2xl flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:bg-white group-hover:text-black transition-colors duration-500 relative z-10 transform group-hover:scale-110`}>
            {icon}
        </div>
        
        <div className="relative z-10">
            <h3 className={`text-2xl lg:text-3xl font-display font-black text-slate-900 mb-2 group-hover:text-white transition-colors`}>{title}</h3>
            <p className={`text-slate-500 ${lang === 'en' ? 'font-classic' : 'font-serif'} text-base lg:text-lg group-hover:text-slate-100 transition-colors`}>{desc}</p>
        </div>

        {/* Decorative pattern on hover */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0 group-hover:animate-pulse"></div>
    </button>
);

export default App;