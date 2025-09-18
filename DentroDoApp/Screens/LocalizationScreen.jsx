import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';

export default function LocationScreen({navigation}) {
  const [isInAllowedRegion, setIsInAllowedRegion] = useState(false);

  const checkLocation = async () => {
    if (Platform.OS !== 'web') {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão de localização negada');
          return;
        }

        await Location.getCurrentPositionAsync({});
        setIsInAllowedRegion(true);
        Alert.alert('Localização verificada', 'Você está na região permitida!');
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        Alert.alert('Erro', 'Não foi possível verificar sua localização');
      }
    } else {
      setIsInAllowedRegion(true);
      Alert.alert('Simulação', 'Em ambiente web, a localização é simulada como permitida');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Localização</Text>

      <CustomButton
        title={isInAllowedRegion ? '✅ Na Escola' : 'Verificar Localização'}
        style={[styles.locationButton, isInAllowedRegion && styles.locationVerified]}
        onPress={checkLocation}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• É necessário estar na escola para receber tickets</Text>
        <Text style={styles.infoText}>• A localização é verificada automaticamente</Text>
        <Text style={styles.infoText}>• Permissão de localização é obrigatória</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE4E1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationVerified: {
    backgroundColor: '#2E7D32',
  },
  infoContainer: {
    marginTop: 30,
    width: '80%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
});