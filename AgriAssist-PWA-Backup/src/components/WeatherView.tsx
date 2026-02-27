import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../lib/timeUtils';
// import { useGeolocation, getNearestSector } from '../hooks/useGeolocation';
import AudioButton from './AudioButton';

export default function WeatherView() {
  console.log('☁️ WeatherView: Component rendered');
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Disabled geolocation auto-fill to prevent filtering issues
  // const { location } = useGeolocation();

  console.log('☁️ WeatherView: State', { weatherCount: weather.length, loading, search });

  // Disabled geolocation auto-fill
  // useEffect(() => {
  //   if (location) {
  //     console.log('☁️ WeatherView: Location detected:', location);
  //     const sector = getNearestSector(location.latitude, location.longitude);
  //     console.log('☁️ WeatherView: Nearest sector:', sector);
  //     if (sector && sector.trim()) {
  //       setSearch(sector);
  //     }
  //   }
  // }, [location]);

  useEffect(() => {
    console.log('☁️ WeatherView: Loading weather data');
    loadWeather();
    
    console.log('☁️ WeatherView: Setting up realtime subscription');
    const channel = supabase
      .channel('weather-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weather' }, () => {
        console.log('☁️ WeatherView: Weather data changed, reloading');
        loadWeather();
      })
      .subscribe();

    return () => {
      console.log('☁️ WeatherView: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const loadWeather = async () => {
    console.log('☁️ loadWeather: Starting');
    try {
      const { data, error } = await supabase
        .from('weather')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('☁️ loadWeather: Error:', error);
        throw error;
      }
      
      console.log('☁️ loadWeather: Loaded', data?.length, 'items');
      setWeather(data || []);
    } catch (err) {
      console.error('☁️ loadWeather: Catch error:', err);
      setWeather([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWeather = search.trim() 
    ? weather.filter(item =>
        item.sector?.toLowerCase().includes(search.toLowerCase()) ||
        item.cell?.toLowerCase().includes(search.toLowerCase())
      )
    : weather;

  console.log('☁️ WeatherView: Filtered', filteredWeather.length, 'items');

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <input
        type="text"
        placeholder={i18n.language === 'rw' ? 'Shakisha akarere...' : 'Search sector...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
      />
      
      {filteredWeather.length === 0 ? (
        <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
          {i18n.language === 'rw' ? 'Nta makuru y\'ibihe ahari' : 'No weather forecasts available'}
        </div>
      ) : (
        filteredWeather.map(item => (
        <div key={item.id} className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-xl font-bold text-gray-900">{item.sector}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.cell}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp, i18n.language)}</p>
            </div>
            <div className="text-right ml-2">
              <div className="text-xl sm:text-3xl font-bold text-primary">{item.temperature}°C</div>
              <div className="text-xs sm:text-sm text-gray-600">{item.rainfall}mm</div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-lg leading-relaxed">
            {i18n.language === 'rw' ? item.forecast_rw : item.forecast}
          </p>
          
          <AudioButton 
            text={i18n.language === 'rw' ? item.forecast_rw : item.forecast} 
            className="w-full"
          />
        </div>
      )))
      }
    </div>
  );
}
