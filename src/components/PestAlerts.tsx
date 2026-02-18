import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../lib/timeUtils';
import AudioButton from './AudioButton';

export default function PestAlerts() {
  const { t, i18n } = useTranslation();
  const [pests, setPests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPests();
    
    const channel = supabase
      .channel('pests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pests' }, () => {
        loadPests();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadPests = async () => {
    try {
      const { data, error } = await supabase
        .from('pests')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setPests(data || []);
    } catch (err) {
      console.error('Error loading pests:', err);
      setPests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPests = pests.filter(pest =>
    pest.name_rw?.toLowerCase().includes(search.toLowerCase()) ||
    pest.name_en?.toLowerCase().includes(search.toLowerCase()) ||
    pest.crops_affected?.some((crop: string) => crop.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <input
        type="text"
        placeholder={i18n.language === 'rw' ? 'Shakisha ibyonnyi cyangwa ibihingwa...' : 'Search pests or crops...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
      />
      
      {filteredPests.length === 0 ? (
        <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
          {i18n.language === 'rw' ? 'Nta makuru y\'ibyonnyi ahari' : 'No pest alerts available'}
        </div>
      ) : (
        filteredPests.map(pest => (
        <div key={pest.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          {pest.image_url && (
            <img 
              src={pest.image_url} 
              alt={pest.name_rw}
              className="w-full h-40 sm:h-48 object-cover"
              loading="lazy"
            />
          )}
          
          <div className="p-3 sm:p-6">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
              {i18n.language === 'rw' ? pest.name_rw : pest.name_en}
            </h3>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">{formatTimeAgo(pest.timestamp, i18n.language)}</p>
            
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                {i18n.language === 'rw' ? 'Ibimera byibasiwe:' : 'Affected crops:'}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {pest.crops_affected.map((crop: string) => (
                  <span key={crop} className="px-2 py-1 sm:px-3 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                {i18n.language === 'rw' ? 'Ibisobanuro:' : 'Description:'}
              </p>
              <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">
                {pest.description_rw}
              </p>
            </div>
            
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                {i18n.language === 'rw' ? 'Umuti:' : 'Treatment:'}
              </p>
              <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">
                {pest.treatment_rw}
              </p>
            </div>
            
            <AudioButton 
              text={`${pest.name_rw}. ${pest.description_rw}. ${pest.treatment_rw}`}
              className="w-full"
            />
          </div>
        </div>
      )))
      }
    </div>
  );
}
