import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export default function Analytics() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalWeather: 0,
    totalPests: 0,
    totalMarket: 0,
    totalLivestock: 0,
    totalMessages: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [farmers, weather, pests, market, livestock, messages] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'farmer'),
        supabase.from('weather').select('id', { count: 'exact', head: true }),
        supabase.from('pests').select('id', { count: 'exact', head: true }),
        supabase.from('market').select('id', { count: 'exact', head: true }),
        supabase.from('livestock').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalFarmers: farmers.count || 0,
        totalWeather: weather.count || 0,
        totalPests: pests.count || 0,
        totalMarket: market.count || 0,
        totalLivestock: livestock.count || 0,
        totalMessages: messages.count || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{t('analytics')}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-primary">{stats.totalFarmers}</div>
          <div className="text-sm text-gray-600">{t('total_farmers')}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-blue-500">{stats.totalMessages}</div>
          <div className="text-sm text-gray-600">{t('total_messages')}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-green-500">{stats.totalWeather}</div>
          <div className="text-sm text-gray-600">{t('weather_posts')}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-yellow-500">{stats.totalPests}</div>
          <div className="text-sm text-gray-600">{t('pest_alerts')}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-purple-500">{stats.totalMarket}</div>
          <div className="text-sm text-gray-600">{t('market_posts')}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-orange-500">{stats.totalLivestock}</div>
          <div className="text-sm text-gray-600">{t('livestock_posts')}</div>
        </div>
      </div>
    </div>
  );
}
