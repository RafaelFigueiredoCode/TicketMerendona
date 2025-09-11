import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton'
import { saveTicket, getTicketsByAluno} from "../features/TicketsSlice";

export default function TicketScreen ({ navigation }) {
  const [ticketReceived, setTicketReceived] = useState(false);
  const [isInAllowedRegion, setIsInAllowedRegion] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastReceivedDate, setLastReceivedDate] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTickets = async () => {
      if (!alunoId) return;
      
      const tickets = await getTicketsByAluno(alunoId); 
      
      if (tickets.length > 0) {
        const ultimoTicket = tickets[tickets.length - 1];
        setLastReceivedDate(ultimoTicket.data);
  
       
        if (ultimoTicket.data === new Date().toDateString()) {
          setTicketReceived(true);
        } else {
          setTicketReceived(false);
        }
      } else {
        setTicketReceived(false);
        setLastReceivedDate(null);
      }
    };
  
    loadTickets();
  }, [alunoId]);

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

  const receiveTicket = async () => {
    const today = new Date().toDateString();

    if (lastReceivedDate === today) {
      Alert.alert('Aviso', 'Você já recebeu seu ticket hoje!');
      return;
    }

    if (!isInAllowedRegion) {
      Alert.alert('Localização', 'Você precisa estar na escola para receber o ticket');
      return;
    }

    const ticket = {
      id: Date.now(),
      data: today,
      status: "ativo",
    };

    await saveTicket(alunoId, ticket);

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
      </View>

      <CustomButton
        title={isInAllowedRegion ? '✅ Na Escola' : 'Verificar Localização'}
        style={[styles.locationButton, isInAllowedRegion && styles.locationVerified]}
        onPress={checkLocation}
      />

      <CustomButton
        title='Receber Ticket'
        style={[
          styles.receiveButton, 
          (ticketReceived || !isInAllowedRegion) && styles.buttonDisabled
        ]}
        onPress={receiveTicket}
        disabled={ticketReceived || !isInAllowedRegion}
      />
            <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• Apenas 1 ticket por dia por aluno</Text>
        <Text style={styles.infoText}>• Disponível apenas 5 minutos antes do intervalo</Text>
        <Text style={styles.infoText}>• É necessário estar na escola</Text>
      </View>
      <View style={styles.separator} /> 
      <Text style={styles.titleScreens}>Outras Telas</Text>
      <CustomButton 
        title='Validar Ticket'
        style={styles.validationButton}
        onPress={() => navigation.navigate("Validation")}
      />
      <CustomButton 
        title='Ver Intervalo'
        style={styles.intervaloButton}
        onPress={() => navigation.navigate("Interval")}
      />
      <CustomButton 
        title='Ver Localização'
        style={styles.localizationButton}
        onPress={checkLocation}
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
  titleScreens: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  infoContainer: {
    marginBottom: 30,
    marginTop: 20,
    width: '80%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  validationButton: {
    backgroundColor: '#000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  intervaloButton: {
    backgroundColor: '#800000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  localizationButton: {
    backgroundColor: '#00008B',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  separator: {
    height: 2,             
    width: '80%',           
    backgroundColor: '#00008B', 
    marginVertical: 16,    
  }
});

