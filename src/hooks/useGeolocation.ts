import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    }
  }, []);

  return { location, error };
}

export function getNearestSector(latitude: number, longitude: number): string {
  const sectors = [
    { name: 'Nyagatare', lat: -1.2981, lng: 30.3228 },
    { name: 'Matimba', lat: -1.3500, lng: 30.4000 },
    { name: 'Karangazi', lat: -1.2800, lng: 30.3500 },
    { name: 'Karama', lat: -1.3200, lng: 30.3800 }
  ];

  let nearest = sectors[0];
  let minDistance = Infinity;

  sectors.forEach(sector => {
    const distance = Math.sqrt(
      Math.pow(latitude - sector.lat, 2) + Math.pow(longitude - sector.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = sector;
    }
  });

  return nearest.name;
}
