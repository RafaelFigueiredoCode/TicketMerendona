import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IntervalScreen = () => {
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
      <Text style={styles.title}>Controle de Intervalo</Text>
      
      <Text style={styles.status}>
        Status: {isActive ? 'Intervalo Ativo' : 'Intervalo Inativo'}
      </Text>

      <Text style={styles.time}>
        {isActive ? 'Tempo para terminar: ' : 'Tempo para iniciar: '}
        {timeLeft}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
  },
});

export default IntervalScreen;