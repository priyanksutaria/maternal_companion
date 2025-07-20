import React, { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NewsTicker() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(true);
  const newsItems = [
    t('newsTicker.item1'),
    t('newsTicker.item2'),
    t('newsTicker.item3'),
    t('newsTicker.item4'),
    t('newsTicker.item5'),
    t('newsTicker.item6')
  ];

  return (
    <div className="bg-orange-600 text-white py-2 border-b border-orange-700 overflow-hidden sticky top-14 z-40 m-0 px-4">
      <style>{`
        .animate-scroll-slow {
          animation: scroll 60s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <div className="w-full flex items-center relative m-0 px-4">
        <span className="bg-orange-700 px-3 py-1 text-xs font-bold flex-shrink-0 uppercase tracking-wider z-10" style={{ minWidth: 140 }}>
          {t('newsTicker.label')}
        </span>
        <div className="relative flex-1 overflow-hidden h-6 m-0">
          <div
            className="absolute left-0 top-0 flex animate-scroll-slow whitespace-nowrap text-sm"
            style={{ animationPlayState: playing ? 'running' : 'paused', height: '1.5rem' }}
          >
            <div className="flex space-x-8">
              {newsItems.map((item, index) => (
                <span key={index} className="flex-shrink-0">
                  {item} •
                </span>
              ))}
              {newsItems.map((item, index) => (
                <span key={`repeat-${index}`} className="flex-shrink-0">
                  {item} •
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          aria-label={playing ? t('newsTicker.pause') : t('newsTicker.play')}
          onClick={() => setPlaying((p) => !p)}
          className="ml-4 bg-orange-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow border-2 border-white hover:bg-orange-800 transition-colors absolute right-2 top-1/2 -translate-y-1/2 z-10"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  );
}