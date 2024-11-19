import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Mock data for calculation history
const mockHistoryData = [
  {
    id: '1',
    name: 'Transaction 1',
    date: '2023-10-01',
    operation: 'Deposit',
    amount: '$100',
  },
  {
    id: '2',
    name: 'Transaction 2',
    date: '2023-10-02',
    operation: 'Withdrawal',
    amount: '$50',
  },
];

export default function HistoryScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        router.push('/'); // Redirect to the main page
      }
    };

    checkUserId(); // Call the function to check user ID
  }, [router]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyDetails}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyOperation}>{item.operation}</Text>
        <Text style={styles.historyAmount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История расчетов</Text>
      <FlatList
        data={mockHistoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  historyDetails: {
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 14,
    color: '#777',
  },
  historyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyOperation: {
    fontSize: 14,
    color: '#555',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});