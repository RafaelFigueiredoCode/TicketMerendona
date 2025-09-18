import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import CustomButton from '../components/CustomButton';
import { getTicketsByAluno, validateTicket } from '../features/TicketsSlice';

export default function ValidationScreen({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const alunoId = user?.id;

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
    <View style={styles.container}>
      {currentTicket ? (
        <>
        <Text style= {}></Text>
          <Text style={styles.ticketText}>Ticket: {currentTicket.data}</Text>
          <Text style={[styles.statusText, currentTicket.status === "ativo" ? styles.active : styles.inactive]}>
            Status: {currentTicket.status === "ativo" ? "Disponível" : "Indisponível"}
          </Text>
          <CustomButton title="Validar" onPress={validateTicketHandler} style={styles.validateButton}/>
        </>
      ) : (
        <Text style={styles.noTicketText}>Nenhum ticket disponível</Text>
      )}
      <View style={styles.separator} />
      <Text style={styles.titleScreens}>Outras Telas</Text>   
      <CustomButton 
        title = 'Ver Intervalo'
        style= {styles.intervaloButton}
        onPress={() => navigation.navigate("Interval")}
      />
      <CustomButton 
        title = 'Ver Localização'
        style= {styles.localizationButton}
      />
      <CustomButton 
        title="Voltar para Tela Inicial"
        onPress={() => navigation.navigate("Home")}
        style= {styles.validationButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 16,
    backgroundColor: "#fff"
  },
  ticketText: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 8 
},
  statusText: { 
    fontSize: 18, 
    marginBottom: 16 
},
  active: { 
    color: "green" 
},
  inactive: { 
    color: "red" 
},
  validateButton: { 
    width: 200, marginBottom: 20 
},
  backButton: { 
    width: 200, marginTop: 40
},
  noTicketText: { 
    fontSize: 18, 
    color: "gray", 
    marginBottom: 20 
},
titleScreens: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
localizationButton: {
    backgroundColor: '#00008B',
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
  validationButton: {
    backgroundColor: '#000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
separator: {
    height: 1,             
    width: '80%',           
    backgroundColor: '#ccc', 
    marginVertical: 16,    
  }
});