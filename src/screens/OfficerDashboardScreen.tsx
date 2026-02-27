import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function OfficerDashboardScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'weather', label: 'Weather', icon: '☁️' },
    { id: 'pests', label: 'Pests', icon: '🐛' },
    { id: 'market', label: 'Market', icon: '💰' },
    { id: 'chat', label: 'Chat', icon: '💬' },
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
      
      case 'pests':
        return <PestForm />;
      
      case 'market':
        return <MarketForm />;
      
      case 'chat':
        navigation.navigate('Chat');
        return null;
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('officer_dashboard')}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
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
  const [sector, setSector] = useState('');
  const [forecast, setForecast] = useState('');
  const [temp, setTemp] = useState('');
  const [rainfall, setRainfall] = useState('');

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
      setSector('');
      setForecast('');
      setTemp('');
      setRainfall('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View>
      <Text style={styles.formTitle}>Post Weather Update</Text>
      <TextInput style={styles.input} placeholder="Sector" value={sector} onChangeText={setSector} />
      <TextInput style={styles.input} placeholder="Forecast" value={forecast} onChangeText={setForecast} multiline />
      <TextInput style={styles.input} placeholder="Temperature (°C)" value={temp} onChangeText={setTemp} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Rainfall (mm)" value={rainfall} onChangeText={setRainfall} keyboardType="numeric" />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#22c55e', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  logoutBtn: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#22c55e', fontWeight: 'bold', fontSize: 14 },
  tabBar: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#22c55e' },
  tabIcon: { fontSize: 18 },
  tabText: { fontSize: 14, color: '#6b7280' },
  activeTabText: { color: '#22c55e', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  actionCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  actionIcon: { fontSize: 32, marginRight: 16 },
  actionTitle: { fontSize: 16, fontWeight: '600' },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16 },
  submitBtn: { backgroundColor: '#22c55e', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
