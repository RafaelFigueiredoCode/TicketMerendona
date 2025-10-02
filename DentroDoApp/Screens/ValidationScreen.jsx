import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import CustomButton from '../components/CustomButton';
import { getTicketsByAluno, validateTicket } from '../features/TicketsSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function ValidationScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;
  const alunoName = user?.nome;

  useEffect(() => {
    const loadTickets = async () => {
      if (!alunoId) return;
      const alunoTickets = await getTicketsByAluno(alunoId);
      setTickets(alunoTickets);
      // pega o primeiro ticket ativo para centralizar
      const ativo = alunoTickets.find(t => t.status === "ativo");
      setCurrentTicket(ativo || null);
    };
    loadTickets();
  }, [alunoId]);

  const validateTicketHandler = async () => {
    if (!currentTicket) return;
  
    Alert.alert(
      "Confirmar",
      "Deseja validar este ticket?",
      [
        { text: "Cancelar" },
        { 
          text: "Sim",
          onPress: async () => {
            const updatedTickets = await validateTicket(alunoId, currentTicket.id);
            setTickets(updatedTickets);
            setCurrentTicket(null); // remove ticket da tela
            Alert.alert("Sucesso", "Ticket validado!");
          }
        }
      ]
    );
  };

  return (
    <LinearGradient 
      colors={['#8A2BE2', '#9B30FF', '#DA70D6']} 
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {currentTicket ? (
          <>
            <Text style={styles.ticketText}>Aluno: {alunoName}</Text>
            <Text style={styles.ticketText}>Ticket: {currentTicket.data}</Text>
            <Text
              style={[
                styles.statusText,
                currentTicket.status === 'ativo' ? styles.active : styles.inactive,
              ]}
            >
              Status: {currentTicket.status === 'ativo' ? 'Disponível' : 'Indisponível'}
            </Text>
            <CustomButton
              title="Validar"
              onPress={validateTicketHandler}
              style={styles.validateButton}
            />
          </>
        ) : (
          <Text style={styles.noTicketText}>Nenhum ticket disponível</Text>
        )}
<CustomButton
  title="Ver Intervalo"
  style={[styles.commonButton, { backgroundColor: '#ea4335' }]}
  onPress={() => navigation.navigate("Interval")}
/>
<CustomButton
  title="Ver Localização"
  style={[styles.commonButton, { backgroundColor: '#00008B' }]}
  onPress= {()=> navigation.navigate('Location')}
/>
<CustomButton
  title="Voltar para Tela Inicial"
  style={[styles.commonButton, { backgroundColor: '#000' }]}
  onPress={() => navigation.navigate('Home')}
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
  ticketText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  active: {
    color: '#34a853', // verde para ativo
  },
  inactive: {
    color: '#ea4335', // vermelho para inativo
  },
  noTicketText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginBottom: 80,
  },
  commonButton: {
    width: 350,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  titleScreens: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  validateButton: {
    backgroundColor: '#34a853', // verde botão validar
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: 350
  },
  validationButton: {
    marginBottom: 10,
    backgroundColor:  '#000'
  },
  localizationButton: {
    marginBottom: 10,
    backgroundColor:  '#00008B',
  },
  intervaloButton: {
    marginBottom: 10,
    backgroundColor: '#ea4335',
  },
});