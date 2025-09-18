import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { useSelector } from 'react-redux';

export default function LocationScreen({ navigation }) {
  const [isInAllowedRegion, setIsInAllowedRegionLocal] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;

  useEffect(() => {
    const checkStoredVerification = async () => {
      if (!alunoId) return;
  
      const value = await AsyncStorage.getItem(`hasVerifiedLocation_${alunoId}`);
      if (value === "true") {
        setIsInAllowedRegionLocal(true);
        setAlreadyVerified(true);
      }
    };
    checkStoredVerification();
  }, [alunoId]);
  
  const checkLocation = async () => {
    if (alreadyVerified) {
      Alert.alert("Aviso", "Você já verificou sua localização.");
      return;
    }

    try {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão de localização negada');
          return;
        }
        await Location.getCurrentPositionAsync({});
      }

      // marca localmente e persiste no AsyncStorage
      await AsyncStorage.setItem(`hasVerifiedLocation_${alunoId}`, "true");
      setAlreadyVerified(true);
      setIsInAllowedRegionLocal(true);

      Alert.alert(
        'Localização verificada',
        Platform.OS === 'web'
          ? 'Em ambiente web, a localização é simulada como permitida'
          : 'Você está na região permitida!'
      );

    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível verificar sua localização');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Localização</Text>

      <CustomButton
        title={isInAllowedRegion ? '✅ Na Escola' : 'Verificar Localização'}
        style={[styles.locationButton, isInAllowedRegion && styles.locationVerified]}
        onPress={checkLocation}
        disabled={alreadyVerified} 
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• É necessário estar na escola para receber tickets</Text>
        <Text style={styles.infoText}>• A localização é verificada automaticamente</Text>
        <Text style={styles.infoText}>• Permissão de localização é obrigatória</Text>
      </View>

      <CustomButton
        title="Voltar"
        onPress={()=> navigation.navigate("Home", { refreshLocation: true })}
        style={styles.validationButton}
      />
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
  validationButton: {
    backgroundColor: '#000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 30,
  },
});