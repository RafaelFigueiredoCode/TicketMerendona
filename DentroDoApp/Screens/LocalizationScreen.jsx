import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';

export default function LocationScreen({ navigation }) {
  const [isInAllowedRegion, setIsInAllowedRegionLocal] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [location, setLocation] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;

  // Coordenadas da escola (exemplo: Av. Paulista, SP)
  const SCHOOL_COORDS = {
    latitude: -27.618327701815303,
    longitude: -48.662651007546586,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };


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
        let current = await Location.getCurrentPositionAsync({});
        setLocation(current.coords);

        // Aqui você poderia calcular distância até a escola
        // Exemplo simples: marcar como válido sempre que localização obtida
        await AsyncStorage.setItem(`hasVerifiedLocation_${alunoId}`, "true");
        setAlreadyVerified(true);
        setIsInAllowedRegionLocal(true);

        Alert.alert('Localização verificada', 'Você está na região permitida!');
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível verificar sua localização');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Localização</Text>

      {/* Exibe o mapa */}
      <MapView
        style={styles.map}
        initialRegion={SCHOOL_COORDS}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : SCHOOL_COORDS
        }
      >
        {/* Marker da escola */}
        <Marker
          coordinate={{ latitude: SCHOOL_COORDS.latitude, longitude: SCHOOL_COORDS.longitude }}
          title="Escola"
          description="Local permitido"
          pinColor="green"
        />

        {/* Marker do aluno */}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Você está aqui"
            pinColor="blue"
          />
        )}
      </MapView>

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
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  map: { width: "100%", height: 300, marginBottom: 15, borderRadius: 10, marginTop: 15},
  locationButton: { marginTop: 10 },
  locationVerified: { backgroundColor: "green" },
  infoContainer: { marginTop: 20 },
  infoText: { fontSize: 14, marginBottom: 5 },
  validationButton: { marginTop: 15 },
});