import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function OfficerDashboardScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'weather', label: 'Weather', icon: '☁️' },
    { id: 'view-weather', label: 'View Weather', icon: '🌤️' },
    { id: 'pests', label: 'Pests', icon: '🐛' },
    { id: 'market', label: 'Market', icon: '💰' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View>
            <Text style={styles.sectionTitle}>Welcome, Officer!</Text>
            <Text style={styles.sectionText}>Manage agricultural data and communicate with farmers.</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('weather')}>
              <Text style={styles.actionIcon}>☁️</Text>
              <Text style={styles.actionTitle}>Post Weather Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('pests')}>
              <Text style={styles.actionIcon}>🐛</Text>
              <Text style={styles.actionTitle}>Report Pest Alert</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('market')}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionTitle}>Update Market Prices</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionTitle}>Chat with Farmers</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'weather':
        return <WeatherForm />;
      
      case 'view-weather':
        return <ViewWeather />;
      
      case 'pests':
        return <PestForm />;
      
      case 'market':
        return <MarketForm />;
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Officer Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

function WeatherForm() {
  const [sector, setSector] = useState('Nyagatare');
  const [forecast, setForecast] = useState('');
  const [temp, setTemp] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [loading, setLoading] = useState(false);

  const sectors = [
    { name: 'Nyagatare', lat: -1.2964, lon: 30.3314 },
    { name: 'Rwimiyaga', lat: -1.3500, lon: 30.4000 },
    { name: 'Karama', lat: -1.2500, lon: 30.2800 },
    { name: 'Rukomo', lat: -1.2200, lon: 30.3800 },
    { name: 'Matimba', lat: -1.3200, lon: 30.3500 },
    { name: 'Mimuli', lat: -1.2800, lon: 30.4200 },
    { name: 'Musheli', lat: -1.3100, lon: 30.3900 },
    { name: 'Karangazi', lat: -1.2600, lon: 30.3100 }
  ];

  const fetchWeatherData = async (sectorName: string) => {
    setLoading(true);
    try {
      const sectorData = sectors.find(s => s.name === sectorName) || sectors[0];
      const { lat, lon } = sectorData;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&timezone=Africa/Kigali`
      );
      
      const data = await response.json();
      
      if (data.current) {
        setTemp(Math.round(data.current.temperature_2m).toString());
        setRainfall(data.current.precipitation?.toString() || '0');
        setForecast(getWeatherDescription(data.current.weather_code));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      95: 'Thunderstorm'
    };
    return weatherCodes[code] || 'Unknown';
  };

  const handleSectorChange = (sectorName: string) => {
    setSector(sectorName);
    fetchWeatherData(sectorName);
  };

  useEffect(() => {
    fetchWeatherData(sector);
  }, []);

  const handleSubmit = async () => {
    if (!sector || !forecast || !temp) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    try {
      const { error } = await supabase.from('weather').insert({
        sector,
        cell: '',
        forecast,
        forecast_rw: forecast,
        temperature: parseFloat(temp),
        rainfall: parseFloat(rainfall || '0'),
        timestamp: Date.now()
      });

      if (error) throw error;
      Alert.alert('Success', 'Weather update posted!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View>
      <Text style={styles.formTitle}>Post Weather Update</Text>
      <Text style={styles.formSubtitle}>Data auto-filled from weather API. Edit if needed.</Text>
      
      <Text style={styles.inputLabel}>Select Sector</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorSelectScroll}>
        {sectors.map((s) => (
          <TouchableOpacity
            key={s.name}
            style={[
              styles.sectorSelectChip,
              sector === s.name && styles.sectorSelectChipActive
            ]}
            onPress={() => handleSectorChange(s.name)}
          >
            <Text style={[
              styles.sectorSelectText,
              sector === s.name && styles.sectorSelectTextActive
            ]}>
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading ? (
        <ActivityIndicator size="small" color="#22c55e" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Forecast" value={forecast} onChangeText={setForecast} />
          <TextInput style={styles.input} placeholder="Temperature (°C)" value={temp} onChangeText={setTemp} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Rainfall (mm)" value={rainfall} onChangeText={setRainfall} keyboardType="numeric" />
        </>
      )}
      
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>Post Update</Text>
      </TouchableOpacity>
    </View>
  );
}

function PestForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleSubmit = async () => {
    if (!name || !description || !treatment) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const { error } = await supabase.from('pests').insert({
        name_rw: name,
        name_en: name,
        description_rw: description,
        treatment_rw: treatment,
        crops_affected: [],
        timestamp: Date.now()
      });

      if (error) throw error;
      Alert.alert('Success', 'Pest alert posted!');
      setName('');
      setDescription('');
      setTreatment('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View>
      <Text style={styles.formTitle}>Report Pest Alert</Text>
      <TextInput style={styles.input} placeholder="Pest Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Treatment" value={treatment} onChangeText={setTreatment} multiline />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Post Alert</Text>
      </TouchableOpacity>
    </View>
  );
}

function MarketForm() {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [market, setMarket] = useState('');

  const handleSubmit = async () => {
    if (!product || !price || !market) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const { error } = await supabase.from('market').insert({
        product,
        price: parseFloat(price),
        unit,
        market_name: market,
        timestamp: Date.now()
      });

      if (error) throw error;
      Alert.alert('Success', 'Market price posted!');
      setProduct('');
      setPrice('');
      setMarket('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View>
      <Text style={styles.formTitle}>Update Market Prices</Text>
      <TextInput style={styles.input} placeholder="Product" value={product} onChangeText={setProduct} />
      <TextInput style={styles.input} placeholder="Price (RWF)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Unit (kg, liter)" value={unit} onChangeText={setUnit} />
      <TextInput style={styles.input} placeholder="Market Name" value={market} onChangeText={setMarket} />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Post Price</Text>
      </TouchableOpacity>
    </View>
  );
}

function ViewWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('Nyagatare');

  const sectors = [
    { name: 'Nyagatare', lat: -1.2964, lon: 30.3314 },
    { name: 'Rwimiyaga', lat: -1.3500, lon: 30.4000 },
    { name: 'Karama', lat: -1.2500, lon: 30.2800 },
    { name: 'Rukomo', lat: -1.2200, lon: 30.3800 },
    { name: 'Matimba', lat: -1.3200, lon: 30.3500 },
    { name: 'Mimuli', lat: -1.2800, lon: 30.4200 },
    { name: 'Musheli', lat: -1.3100, lon: 30.3900 },
    { name: 'Karangazi', lat: -1.2600, lon: 30.3100 }
  ];

  useEffect(() => {
    fetchRealWeather();
  }, [selectedSector]);

  const fetchRealWeather = async () => {
    setLoading(true);
    try {
      const sector = sectors.find(s => s.name === selectedSector) || sectors[0];
      const { lat, lon } = sector;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=Africa/Kigali&forecast_days=1`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather data:', data);
      
      if (!data.current) {
        throw new Error('Invalid weather data');
      }
      
      // Format current weather
      const currentWeather = {
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m
        },
        weather: [{ description: getWeatherDescription(data.current.weather_code) }],
        wind: { speed: data.current.wind_speed_10m }
      };
      
      // Format hourly forecast
      const hourlyForecast = data.hourly.time.slice(0, 8).map((time: string, index: number) => ({
        dt_txt: time,
        main: { temp: data.hourly.temperature_2m[index] },
        weather: [{ description: getWeatherDescription(data.hourly.weather_code[index]) }]
      }));
      
      setWeather(currentWeather);
      setForecast(hourlyForecast);
    } catch (error: any) {
      console.error('Weather API error:', error.message);
      // Fallback to database
      try {
        const { data } = await supabase.from('weather').select('*').order('created_at', { ascending: false }).limit(5);
        setForecast(data || []);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 40 }} />;
  }

  return (
    <View>
      <Text style={styles.formTitle}>Weather Forecast</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectorScroll}>
        {sectors.map((sector) => (
          <TouchableOpacity
            key={sector.name}
            style={[
              styles.sectorChip,
              selectedSector === sector.name && styles.sectorChipActive
            ]}
            onPress={() => setSelectedSector(sector.name)}
          >
            <Text style={[
              styles.sectorChipText,
              selectedSector === sector.name && styles.sectorChipTextActive
            ]}>
              {sector.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {weather && weather.main && (
        <View style={styles.currentWeatherCard}>
          <Text style={styles.locationText}>📍 {selectedSector}</Text>
          <Text style={styles.currentTemp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.currentDesc}>{weather.weather?.[0]?.description || 'N/A'}</Text>
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Feels Like</Text>
              <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{Math.round(weather.wind?.speed || 0)} m/s</Text>
            </View>
          </View>
        </View>
      )}

      {forecast.length === 0 ? (
        <Text style={styles.emptyText}>No forecast data available</Text>
      ) : (
        <>
          <Text style={styles.forecastTitle}>24-Hour Forecast</Text>
          {forecast.map((item, index) => (
            <View key={index} style={styles.weatherCard}>
              <View style={styles.forecastRow}>
                <Text style={styles.forecastTime}>
                  {item.dt_txt ? new Date(item.dt_txt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.sector || 'N/A'}
                </Text>
                <Text style={styles.forecastTemp}>
                  {item.main ? `${Math.round(item.main.temp)}°C` : `${item.temperature}°C`}
                </Text>
              </View>
              <Text style={styles.forecastDesc}>
                {item.weather?.[0]?.description || item.forecast || 'No description'}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  logoutBtn: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#22c55e', fontWeight: 'bold', fontSize: 14 },
  tabBar: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', maxHeight: 60 },
  tab: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#22c55e' },
  tabIcon: { fontSize: 18 },
  tabText: { fontSize: 14, color: '#6b7280' },
  activeTabText: { color: '#22c55e', fontWeight: 'bold' },
  content: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  actionCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  actionIcon: { fontSize: 32, marginRight: 16 },
  actionTitle: { fontSize: 16, fontWeight: '600' },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  formSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16, fontStyle: 'italic' },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16 },
  submitBtn: { backgroundColor: '#22c55e', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#6b7280' },
  weatherCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  weatherSector: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  weatherForecast: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherTemp: { fontSize: 16, fontWeight: '600' },
  weatherRain: { fontSize: 16, fontWeight: '600', color: '#3b82f6' },
  currentWeatherCard: { backgroundColor: '#22c55e', padding: 24, borderRadius: 16, marginBottom: 20, alignItems: 'center' },
  currentTemp: { fontSize: 64, fontWeight: 'bold', color: 'white' },
  currentDesc: { fontSize: 20, color: 'white', textTransform: 'capitalize', marginBottom: 16 },
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16 },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: 'white', opacity: 0.8 },
  detailValue: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 4 },
  forecastTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  forecastTime: { fontSize: 16, fontWeight: '600' },
  forecastTemp: { fontSize: 16, fontWeight: 'bold', color: '#22c55e' },
  forecastDesc: { fontSize: 14, color: '#6b7280', textTransform: 'capitalize' },
  sectorScroll: { marginBottom: 16 },
  sectorChip: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  sectorChipActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  sectorChipText: { fontSize: 14, color: '#6b7280' },
  sectorChipTextActive: { color: 'white', fontWeight: 'bold' },
  locationText: { fontSize: 16, color: 'white', marginBottom: 8, opacity: 0.9 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
  sectorSelectScroll: { marginBottom: 16 },
  sectorSelectChip: { backgroundColor: '#f3f4f6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  sectorSelectChipActive: { backgroundColor: '#22c55e' },
  sectorSelectText: { fontSize: 13, color: '#6b7280' },
  sectorSelectTextActive: { color: 'white', fontWeight: 'bold' }
});
