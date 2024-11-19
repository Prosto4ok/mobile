import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post(
        'http://45.153.189.82:8003/register',
        {
          email: email,
          login: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Registration successful! Please log in.');
        router.push('/'); // Redirect to login screen
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error(error.response?.data || error.message);
    }
  };

  const handleLoginLink = () => {
    router.push('/'); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация аккунта</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Почта"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Подтверждение пароля"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <Button title="Регистрация" onPress={handleRegister} color="#4CAF50" />

      {/* Link to the Login Screen */}
      <TouchableOpacity onPress={handleLoginLink}>
        <Text style={styles.linkText}>Есть аккаунт? Войти</Text>
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
