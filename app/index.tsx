import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://45.153.189.82:8003/auth', 
        {
          login: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        await AsyncStorage.setItem('user_id', response.data.user_id.toString());
        router.push('/(tabs)/');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  // Function to handle registration link
  const handleRegisterLink = () => {
    router.push('/register'); // Navigate to the register screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Калькулятор расчета пиломатериала</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} color="#4CAF50" />

      {/* Link to the Register Screen */}
      <TouchableOpacity onPress={handleRegisterLink}>
        <Text style={styles.linkText}>Нет еще аккаунта? Зарегистрируйся.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: '#4CAF50',
  },
  linkText: {
    marginTop: 16,
    color: '#4CAF50',
    textAlign: 'center',
  },
});
