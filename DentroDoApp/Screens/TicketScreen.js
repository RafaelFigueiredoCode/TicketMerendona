import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { saveTicket, getTicketsByAluno } from "../features/TicketsSlice";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TicketScreen({ navigation }) {
  const [ticketReceived, setTicketReceived] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTicket, setCurrentTicket] = useState(null);
  const [hasVerifiedLocation, setHasVerifiedLocation] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const user = useSelector(state => state.auth.user);
  const alunoId = user?.id;

  const INTERVAL_START = { hour: 11, minute: 26 };
  const INTERVAL_END = { hour: 11, minute: 41 };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!alunoId) return;
        const tickets = await getTicketsByAluno(alunoId);
        const today = new Date().toDateString();
        const ticketHoje = tickets.find(t => t.data === today);
        setCurrentTicket(ticketHoje || null);
        setTicketReceived(!!ticketHoje);

        const loc = await AsyncStorage.getItem(`hasVerifiedLocation_${alunoId}`);
        setHasVerifiedLocation(loc === "true");
      };
      loadData();
    }, [alunoId])
  );

  // Atualiza o horário e o contador a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const start = new Date();
      start.setHours(INTERVAL_START.hour, INTERVAL_START.minute, 0, 0);

      const end = new Date();
      end.setHours(INTERVAL_END.hour, INTERVAL_END.minute, 0, 0);

      if (now < start) {
        // antes do intervalo
        const diff = start - now;
        setTimeLeft(`Começa em ${formatTime(diff)}`);
      } else if (now >= start && now <= end) {
        // dentro do intervalo
        const diff = end - now;
        setTimeLeft(`Termina em ${formatTime(diff)}`);
      } else {
        // já passou
        setTimeLeft("Intervalo encerrado");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const isWithinInterval = () => {
    const now = new Date();
    const start = new Date();
    start.setHours(INTERVAL_START.hour, INTERVAL_START.minute, 0, 0);
    const end = new Date();
    end.setHours(INTERVAL_END.hour, INTERVAL_END.minute, 0, 0);
    const release = new Date(start);
    release.setMinutes(start.getMinutes() - 5);

    return now >= release && now <= end;
  };

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
    if (!isWithinInterval()) {
      Alert.alert("Aviso", "O ticket só pode ser retirado 5 minutos antes e durante o intervalo.");
      return;
    }

    const ticket = { id: Date.now(), data: today, status: "ativo" };
    await saveTicket(alunoId, ticket);

    setCurrentTicket(ticket);
    setTicketReceived(true);
    Alert.alert("Sucesso", "Ticket recebido com sucesso!");
  };

  return (
    <LinearGradient 
    colors={['#FF6347', '#FFE4E1', '#FA8072']} 
    style={{ flex: 1 }}
    >
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
        <Text style={styles.timeText}>{timeLeft}</Text>
      </View>

      <CustomButton
        title='Receber Ticket'
        style={[
          styles.receiveButton,
          ticketReceived || !hasVerifiedLocation || !isWithinInterval()
            ? styles.buttonDisabled
            : styles.receiveButton
        ]}
        onPress={receiveTicket}
        disabled={ticketReceived || !hasVerifiedLocation || !isWithinInterval()}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• Apenas 1 ticket por dia por aluno</Text>
        <Text style={styles.infoText}>• Disponível apenas 5 minutos antes do intervalo</Text>
        <Text style={styles.infoText}>• É necessário estar na escola</Text>
      </View>
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
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#ea4335',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  localizationButton: {
    backgroundColor:  '#00008B',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
});

