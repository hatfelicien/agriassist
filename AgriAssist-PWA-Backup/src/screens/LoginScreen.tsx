import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (isLogin) {
      const success = await login(phone, password);
      if (success) navigation.replace('Home');
    } else {
      const success = await register(phone, password, name);
      if (success) navigation.replace('Home');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('app_name')}</Text>
        <Text style={styles.subtitle}>{t('welcome')}</Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder={t('name')}
            value={name}
            onChangeText={setName}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder={t('phone')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? t('login') : t('register')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.link}>
            {isLogin ? t('need_account') : t('have_account')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22c55e' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#fbbf24', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#1f2937', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  link: { color: 'white', textAlign: 'center', marginTop: 20, fontSize: 16 }
});
