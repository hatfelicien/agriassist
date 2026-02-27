import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../lib/timeUtils';
import { useFavorites } from '../hooks/useFavorites';
import AudioButton from './AudioButton';

export default function LivestockAdvisories() {
  const { t, i18n } = useTranslation();
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites('livestock');

  useEffect(() => {
    loadAdvisories();
    
    const channel = supabase
      .channel('livestock-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'livestock' }, () => {
        loadAdvisories();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadAdvisories = async () => {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setAdvisories(data || []);
    } catch (err) {
      console.error('Error loading livestock advisories:', err);
      setAdvisories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;
  if (advisories.length === 0) return <div className="p-6 text-center text-gray-600">{i18n.language === 'rw' ? 'Nta makuru y\'amatungo ahari' : 'No livestock advisories available'}</div>;

  return (
    <div className="space-y-4">
      {advisories.map(advisory => (
        <div key={advisory.id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex-1">
              {advisory.title_rw}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(advisory.id)}
                className="px-3 py-1 rounded-full"
              >
                {isFavorite(advisory.id) ? '⭐' : '☆'}
              </button>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {advisory.category}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">{formatTimeAgo(advisory.timestamp, i18n.language)}</p>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            {advisory.content_rw}
          </p>
          
          <div className="flex gap-2">
            <AudioButton 
              text={`${advisory.title_rw}. ${advisory.content_rw}`}
              className="flex-1"
            />
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: advisory.title_rw,
                    text: advisory.content_rw
                  });
                }
              }}
              className="px-4 py-4 bg-blue-500 text-white rounded-lg"
            >
              🔗
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
