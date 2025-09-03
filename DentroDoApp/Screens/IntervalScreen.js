import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

const IntervalScreen = ({navigation}) => {
  // Horários de exemplo (pode ser ajustado ou vindo de um estado global)
  const INTERVAL_START = { hour: 12, minute: 0 }; // 12:00
  const INTERVAL_END = { hour: 13, minute: 0 };   // 13:00

  const [timeLeft, setTimeLeft] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        INTERVAL_START.hour,
        INTERVAL_START.minute
      );
      const endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        INTERVAL_END.hour,
        INTERVAL_END.minute
      );

      // Verifica se está no intervalo
      if (now >= startTime && now < endTime) {
        setIsActive(true);
        // Calcula tempo restante para o término
        const diff = endTime - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else if (now < startTime) {
        // Antes do intervalo
        setIsActive(false);
        const diff = startTime - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        // Após o intervalo
        setIsActive(false);
        setTimeLeft('Intervalo encerrado');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
      <Text style={styles.title}>Controle de Intervalo</Text>
      
      <Text style={styles.status}>
        Status: {isActive ? 'Intervalo Ativo' : 'Intervalo Inativo'}
      </Text>

      <Text style={styles.time}>
        {isActive ? 'Tempo para terminar: ' : 'Tempo para iniciar: '}
        {timeLeft}
      </Text>
      </View>

      <Text style={styles.titleScreens}>---------Outras Telas----------</Text>
      <CustomButton 
      title = 'Validar Ticket'
      style= {styles.validationButton}
      />
      <CustomButton 
      title = 'Ver Intervalo'
      style= {styles.intervaloButton}
      
      />
      <CustomButton 
      title = 'Voltar para Tela Inicial'
      style= {styles.localizationButton}
      onPress={() => navigation.navigate("Home")}
       />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 	'#FFE4E1',
  },
  containerText: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 	'#E9967A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleScreens: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 22,
    marginBottom: 10,
  },
  time: {
    fontSize: 20,
    marginBottom: 20,
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
});

export default IntervalScreen;