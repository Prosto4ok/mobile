import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(tabs)/');
  };

  const handleRegisterLink = () => {
    router.push('/register'); 
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