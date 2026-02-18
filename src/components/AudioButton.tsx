import { useTranslation } from 'react-i18next';
import { useAudio } from '../hooks/useAudio';

interface AudioButtonProps {
  text: string;
  className?: string;
}

export default function AudioButton({ text, className = '' }: AudioButtonProps) {
  const { t, i18n } = useTranslation();
  const { speak, stop, isPlaying } = useAudio();

  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(text, i18n.language === 'rw' ? 'rw-RW' : 'en-US');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center p-4 bg-primary text-white rounded-lg shadow-lg active:scale-95 transition-transform ${className}`}
      aria-label={isPlaying ? t('stop') : t('listen')}
    >
      {isPlaying ? (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      )}
      <span className="ml-2 text-lg font-semibold">{isPlaying ? t('stop') : t('listen')}</span>
    </button>
  );
}
