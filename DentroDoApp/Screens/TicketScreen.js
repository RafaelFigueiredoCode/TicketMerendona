import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { saveTicket, getTicketsByAluno } from "../features/TicketsSlice";
import { useFocusEffect } from '@react-navigation/native';

export default function TicketScreen({ navigation }) {
  const [ticketReceived, setTicketReceived] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTicket, setCurrentTicket] = useState(null);
  const [hasVerifiedLocation, setHasVerifiedLocation] = useState(false);

  const user = useSelector(state => state.auth.user);
  const alunoId = user?.id;

  // Atualiza tickets e verificação sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!alunoId) return;

        // Carrega tickets do aluno
        const tickets = await getTicketsByAluno(alunoId);
        const today = new Date().toDateString();
        const ticketHoje = tickets.find(t => t.data === today);
        setCurrentTicket(ticketHoje || null);
        setTicketReceived(!!ticketHoje);

        // Carrega verificação de localização do AsyncStorage
        const loc = await AsyncStorage.getItem(`hasVerifiedLocation_${alunoId}`);
        setHasVerifiedLocation(loc === "true");
      };
      loadData();
    }, [alunoId])
  );

  // Atualiza o horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const receiveTicket = async () => {
    const today = new Date().toDateString();

    if (!hasVerifiedLocation) {
      Alert.alert("Aviso", "Você precisa verificar sua localização antes de receber o ticket.");
      return;
    }

    if (ticketReceived) {
      Alert.alert("Aviso", "Você já recebeu seu ticket hoje!");
      return;
    }

    const ticket = { id: Date.now(), data: today, status: "ativo" };
    await saveTicket(alunoId, ticket);

    setCurrentTicket(ticket);
    setTicketReceived(true);
    Alert.alert("Sucesso", "Ticket recebido com sucesso!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Tickets de Refeição</Text>

      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusValue,
          currentTicket?.status === "ativo" && hasVerifiedLocation
            ? styles.available
            : styles.unavailable
        ]}>
          {currentTicket
            ? currentTicket.status === "ativo" && hasVerifiedLocation
              ? "Ticket pronto para uso!"
              : "Ticket já validado"
            : "Nenhum ticket disponível"}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          Horário atual: {currentTime.toLocaleTimeString()}
        </Text>
      </View>

      <CustomButton
        title='Receber Ticket'
        style={[
          styles.receiveButton,
          ticketReceived || !hasVerifiedLocation ? styles.buttonDisabled : styles.receiveButton
        ]}
        onPress={receiveTicket}
        disabled={ticketReceived || !hasVerifiedLocation}
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
        onPress={() => navigation.navigate('Location')}
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
    backgroundColor: '#13c40a',
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

