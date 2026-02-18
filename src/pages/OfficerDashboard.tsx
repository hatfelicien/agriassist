import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Chat from '../components/Chat';
import Analytics from '../components/Analytics';

type DataType = 'weather' | 'pests' | 'market' | 'chat' | 'analytics';

export default function OfficerDashboard() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<DataType>('weather');
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat' || activeTab === 'analytics') return;
    
    loadData();
    
    const channel = supabase
      .channel(`${activeTab}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: activeTab }, () => {
        loadData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab]);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from(activeTab as string)
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setItems([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, timestamp: Date.now() };
    
    try {
      if (editingId) {
        const { error } = await supabase.from(activeTab as string).update(data).eq('id', editingId);
        if (error) throw error;
        showToast('Updated successfully', 'success');
      } else {
        const { error } = await supabase.from(activeTab as string).insert(data);
        if (error) throw error;
        showToast('Created successfully', 'success');
      }
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('confirm_delete'))) {
      try {
        const { error } = await supabase.from(activeTab as string).delete().eq('id', id);
        if (error) throw error;
        showToast('Deleted successfully', 'success');
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'weather':
        return (
          <>
            <input placeholder="Sector" value={formData.sector || ''} onChange={(e) => setFormData({ ...formData, sector: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input placeholder="Cell" value={formData.cell || ''} onChange={(e) => setFormData({ ...formData, cell: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <textarea placeholder="Forecast (English)" value={formData.forecast || ''} onChange={(e) => setFormData({ ...formData, forecast: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <textarea placeholder="Forecast (Kinyarwanda)" value={formData.forecast_rw || ''} onChange={(e) => setFormData({ ...formData, forecast_rw: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input type="number" placeholder="Temperature (°C)" value={formData.temperature || ''} onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input type="number" placeholder="Rainfall (mm)" value={formData.rainfall || ''} onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })} className="w-full px-4 py-2 border rounded mb-2" required />
          </>
        );
      case 'pests':
        return (
          <>
            <input placeholder="Name (Kinyarwanda)" value={formData.name_rw || ''} onChange={(e) => setFormData({ ...formData, name_rw: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input placeholder="Name (English)" value={formData.name_en || ''} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <textarea placeholder="Description (Kinyarwanda)" value={formData.description_rw || ''} onChange={(e) => setFormData({ ...formData, description_rw: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <textarea placeholder="Treatment (Kinyarwanda)" value={formData.treatment_rw || ''} onChange={(e) => setFormData({ ...formData, treatment_rw: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, image_url: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border rounded mb-2"
            />
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
            )}
            <input placeholder="Affected Crops (comma separated)" value={formData.crops_affected?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, crops_affected: e.target.value.split(',').map(s => s.trim()) })} className="w-full px-4 py-2 border rounded mb-2" required />
          </>
        );
      case 'market':
        return (
          <>
            <input placeholder="Product" value={formData.product || ''} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input type="number" placeholder="Price (RWF)" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input placeholder="Unit (kg, liter)" value={formData.unit || ''} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
            <input placeholder="Market Name" value={formData.market_name || ''} onChange={(e) => setFormData({ ...formData, market_name: e.target.value })} className="w-full px-4 py-2 border rounded mb-2" required />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-3 sm:p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-bold">{t('officer_dashboard')}</h1>
          
          {/* Desktop Logout */}
          <button onClick={logout} className="hidden sm:block px-4 py-2 bg-white text-primary rounded-lg font-semibold">{t('logout')}</button>
          
          {/* Mobile Burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 bg-white text-primary rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 bg-white rounded-lg shadow-lg overflow-hidden">
            {(['weather', 'pests', 'market', 'chat', 'analytics'] as DataType[]).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setShowForm(false); setMenuOpen(false); }} className={`w-full p-3 text-left ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-800 hover:bg-gray-100'} border-b border-gray-200`}>
                {t(tab === 'chat' ? 'chat_with_officers' : tab)}
              </button>
            ))}
            <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full p-3 text-left text-red-600 hover:bg-gray-100 font-semibold">
              {t('logout')}
            </button>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto p-2 sm:p-4">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-2 mb-6">
          {(['weather', 'pests', 'market', 'chat', 'analytics'] as DataType[]).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowForm(false); }} className={`px-6 py-3 rounded-lg font-semibold ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}>{t(tab === 'chat' ? 'chat_with_officers' : tab)}</button>
          ))}
        </div>
        
        {/* Mobile Active Tab Indicator */}
        <div className="sm:hidden mb-4 p-3 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-gray-800">{t(activeTab === 'chat' ? 'chat_with_officers' : activeTab)}</h2>
        </div>

        {activeTab === 'chat' ? (
          <Chat />
        ) : activeTab === 'analytics' ? (
          <Analytics />
        ) : (
          <>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({}); }} className="mb-3 sm:mb-4 px-3 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg font-semibold text-sm sm:text-base">{showForm ? t('cancel') : `+ ${t('add_new')}`}</button>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-6 rounded-xl shadow-md mb-3 sm:mb-6">
                {renderForm()}
                <button type="submit" className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base">{editingId ? t('update') : t('create')}</button>
              </form>
            )}

            <div className="space-y-2 sm:space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-gray-600 py-4 sm:py-8 text-sm sm:text-base">{i18n.language === 'rw' ? 'Nta makuru ahari' : 'No data available'}</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-2">
                      <div className="flex-1 w-full">
                        {activeTab === 'weather' && (<><h3 className="font-bold text-sm sm:text-lg">{item.sector} - {item.cell}</h3><p className="text-gray-700 text-xs sm:text-base">{i18n.language === 'rw' ? item.forecast_rw : item.forecast}</p><p className="text-xs text-gray-600">{item.temperature}°C, {item.rainfall}mm</p></>)}
                        {activeTab === 'pests' && (<><h3 className="font-bold text-sm sm:text-lg">{item.name_rw}</h3><p className="text-gray-700 text-xs sm:text-base">{item.description_rw}</p><p className="text-xs text-gray-600">Crops: {item.crops_affected?.join(', ')}</p></>)}
                        {activeTab === 'market' && (<><h3 className="font-bold text-sm sm:text-lg">{item.product}</h3><p className="text-gray-700 text-xs sm:text-base">{item.price} RWF/{item.unit}</p><p className="text-xs text-gray-600">{item.market_name}</p></>)}
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => handleEdit(item)} className="flex-1 sm:flex-none px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-base">{t('edit')}</button>
                        <button onClick={() => handleDelete(item.id)} className="flex-1 sm:flex-none px-2 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg text-xs sm:text-base">{t('delete')}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
