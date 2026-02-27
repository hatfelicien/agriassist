import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../lib/timeUtils';
import PriceTrend from './PriceTrend';

export default function MarketPrices() {
  const { t, i18n } = useTranslation();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    loadPrices();
    
    const channel = supabase
      .channel('market-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market' }, () => {
        loadPrices();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('market')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setPrices(data || []);
    } catch (err) {
      console.error('Error loading market prices:', err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = prices.filter(item =>
    item.product?.toLowerCase().includes(search.toLowerCase()) ||
    item.market_name?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByProduct = filteredPrices.reduce((acc: any, item) => {
    if (!acc[item.product]) acc[item.product] = [];
    acc[item.product].push(item);
    return acc;
  }, {});

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-primary text-white p-3 sm:p-4 rounded-xl">
        <h2 className="text-base sm:text-xl font-bold">
          {i18n.language === 'rw' ? 'Ibiciro by\'isoko' : 'Market Prices'}
        </h2>
        <p className="text-xs sm:text-sm opacity-90">
          {i18n.language === 'rw' ? 'Nyagatare District' : 'Nyagatare District'}
        </p>
      </div>
      
      <input
        type="text"
        placeholder={i18n.language === 'rw' ? 'Shakisha ibicuruzwa...' : 'Search products...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm sm:text-base"
      />
      
      <button
        onClick={() => setShowTrends(!showTrends)}
        className="w-full px-3 py-2 sm:px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm sm:text-base"
      >
        {showTrends ? (i18n.language === 'rw' ? 'Hisha ibiciro' : 'Hide Trends') : (i18n.language === 'rw' ? 'Erekana ibiciro' : 'Show Trends')}
      </button>
      
      {showTrends && (
        <div className="space-y-2">
          {Object.entries(groupedByProduct).map(([product, items]: [string, any]) => (
            <PriceTrend key={product} data={items} product={product} />
          ))}
        </div>
      )}

      {filteredPrices.length === 0 ? (
        <div className="p-4 sm:p-6 text-center text-gray-600 text-sm sm:text-base">
          {i18n.language === 'rw' ? 'Nta makuru y\'ibiciro ahari' : 'No market prices available'}
        </div>
      ) : (
        filteredPrices.map(item => (
        <div key={item.id} className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-base sm:text-xl font-bold text-gray-900">{item.product}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{item.market_name}</p>
            </div>
            <div className="text-right ml-2">
              <div className="text-lg sm:text-2xl font-bold text-primary whitespace-nowrap">{item.price} RWF</div>
              <div className="text-xs sm:text-sm text-gray-600">/{item.unit}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp, i18n.language)}</p>
        </div>
      )))
      }
    </div>
  );
}
