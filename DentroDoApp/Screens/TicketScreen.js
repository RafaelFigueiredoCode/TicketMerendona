import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';

export default function TicketScreen () {
  const [ticketReceived, setTicketReceived] = useState(false);
  const [isInAllowedRegion, setIsInAllowedRegion] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastReceivedDate, setLastReceivedDate] = useState(null);

  // Atualiza o horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Verifica se está no horário permitido (5 minutos antes do intervalo)
  const isWithinAllowedTime = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Supondo que o intervalo seja às 12:00
    return hours === 10 && minutes >= 44;
  };

  // Simula a verificação de localização
  const checkLocation = async () => {
    if (Platform.OS !== 'web') {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão de localização negada');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        // Simulação: verificar se está dentro da região da escola
        // Aqui você implementaria a lógica real de verificação de geolocalização
        setIsInAllowedRegion(true);
        Alert.alert('Localização verificada', 'Você está na região permitida!');
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        Alert.alert('Erro', 'Não foi possível verificar sua localização');
      }
    } else {
      // Para ambiente de desenvolvimento/web, simula a permissão
      setIsInAllowedRegion(true);
      Alert.alert('Simulação', 'Em ambiente web, a localização é simulada como permitida');
    }
  };

  // Função para receber o ticket
  const receiveTicket = () => {
    const today = new Date().toDateString();
    
    // Verifica se já recebeu ticket hoje
    if (lastReceivedDate === today) {
      Alert.alert('Aviso', 'Você já recebeu seu ticket hoje!');
      return;
    }

    // Verifica se está no horário permitido
    if (!isWithinAllowedTime()) {
      Alert.alert('Fora do horário', 'Os tickets só estão disponíveis 5 minutos antes do intervalo');
      return;
    }

    // Verifica se está na região permitida
    if (!isInAllowedRegion) {
      Alert.alert('Localização', 'Você precisa estar na escola para receber o ticket');
      return;
    }

    setTicketReceived(true);
    setLastReceivedDate(today);
    Alert.alert('Sucesso', 'Ticket recebido com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Tickets de Refeição</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status do Ticket:</Text>
        <Text style={[styles.statusValue, ticketReceived ? styles.available : styles.unavailable]}>
          {ticketReceived ? 'Ticket Disponível' : 'Ticket Indisponível'}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          Horário atual: {currentTime.toLocaleTimeString()}
        </Text>
        <Text style={styles.timeInfo}>
          {isWithinAllowedTime() 
            ? '✅ No horário de recebimento' 
            : '❌ Fora do horário de recebimento'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.locationButton, isInAllowedRegion && styles.locationVerified]}
        onPress={checkLocation}
      >
        <Text style={styles.buttonText}>
          {isInAllowedRegion ? '✅ Na Escola' : 'Verificar Localização'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.receiveButton, 
          (!isWithinAllowedTime() || ticketReceived || !isInAllowedRegion) && styles.buttonDisabled
        ]}
        onPress={receiveTicket}
        disabled={!isWithinAllowedTime() || ticketReceived || !isInAllowedRegion}
      >
        <Text style={styles.buttonText}>Receber Ticket</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Apenas 1 ticket por dia por aluno
        </Text>
        <Text style={styles.infoText}>
          • Disponível apenas 5 minutos antes do intervalo
        </Text>
        <Text style={styles.infoText}>
          • É necessário estar na escola
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#555',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  available: {
    color: 'green',
  },
  unavailable: {
    color: 'red',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  timeInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  locationVerified: {
    backgroundColor: '#2E7D32',
  },
  receiveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    width: '80%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
});

