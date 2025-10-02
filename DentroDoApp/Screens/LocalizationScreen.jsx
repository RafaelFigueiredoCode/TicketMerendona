import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import { useSelector } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';

const SCHOOL_COORDS = {
  latitude: -27.61830207733236, // coloque a latitude da sua escola
  longitude: -48.66267179543369, // coloque a longitude da sua escola
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Calcula distância entre duas coordenadas em metros
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export default function LocationScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [isInAllowedRegion, setIsInAllowedRegion] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;

  // Checa se já verificou
  useEffect(() => {
    const checkStoredVerification = async () => {
      if (!alunoId) return;
      const value = await AsyncStorage.getItem(`hasVerifiedLocation_${alunoId}`);
      if (value === "true") {
        setIsInAllowedRegion(true);
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
      let currentCoords;

      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão de localização negada");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        currentCoords = loc.coords;
      } else {
        // Para testes no web ou emulador sem GPS real
        currentCoords = { latitude: -27.618302077332366, longitude: -48.66267179543369 };
      }

      setLocation(currentCoords);

      const distance = getDistanceFromLatLonInMeters(
        currentCoords.latitude,
        currentCoords.longitude,
        SCHOOL_COORDS.latitude,
        SCHOOL_COORDS.longitude
      );

      if (distance <= 100) {
        await AsyncStorage.setItem(`hasVerifiedLocation_${alunoId}`, "true");
        setIsInAllowedRegion(true);
        setAlreadyVerified(true);
        Alert.alert("Localização verificada", "Você está dentro de 100 metros da escola!");
      } else {
        Alert.alert("Fora da escola", "Você precisa estar mais próximo da escola para receber o ticket.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    }
  };

  return (
    <LinearGradient 
      colors={['#2F4F4F', '#B0C4DE']} 
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Verificação de Localização</Text>
        <View
        style={styles.mapContainer}
        >
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
          {/* Pino da escola */}
          <Marker
            coordinate={{ latitude: SCHOOL_COORDS.latitude, longitude: SCHOOL_COORDS.longitude }}
            title="Escola"
            pinColor="green"
          />
  
          {/* Pino do aluno */}
          {location && (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Você está aqui"
              pinColor="blue"
            />
          )}
        </MapView>
        </View>
  
        <CustomButton
          title={isInAllowedRegion ? "✅ Na Escola" : "Verificar Localização"}
          onPress={checkLocation}
          style={[styles.locationButton, isInAllowedRegion && styles.locationVerified]}
          disabled={alreadyVerified}
        />
  
        <CustomButton
          title="Voltar"
          onPress={() => navigation.navigate("Home", { refreshLocation: true })}
          style={styles.validationButton}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  mapContainer: {
    height: 400,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden', 
    justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
  locationButton: {
    marginVertical: 10,
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationVerified: {
    backgroundColor: "#4CAF50",
  },
  validationButton: {
    marginVertical: 10,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});