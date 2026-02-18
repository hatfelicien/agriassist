import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  console.log('🔑 Login: Component rendered');
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'officer' | 'admin'>('farmer');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔑 Login: Form submitted', { isRegister, email, role });
    setError('');
    try {
      if (isRegister) {
        console.log('🔑 Login: Calling register');
        await register(email, password, role);
        showToast(t('register') + ' ' + t('success'), 'success');
      } else {
        console.log('🔑 Login: Calling login');
        await login(email, password);
        showToast(t('login') + ' ' + t('success'), 'success');
      }
      console.log('🔑 Login: Success');
    } catch (err: any) {
      console.error('🔑 Login: Error:', err);
      setError(err.message || 'An error occurred');
      showToast(err.message || 'An error occurred', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {t('app_name')}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('role')}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'farmer' | 'officer' | 'admin')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="farmer">{t('farmer')}</option>
                <option value="officer">{t('extension_officer')}</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-secondary transition-colors"
          >
            {isRegister ? t('register') : t('login')}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-4 text-primary font-semibold"
        >
          {isRegister ? t('have_account') : t('create_account')}
        </button>
      </div>
    </div>
  );
}
