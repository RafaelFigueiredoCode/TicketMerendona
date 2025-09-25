import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

const IntervalScreen = ({ navigation }) => {
  // Horários de exemplo
  const INTERVAL_START = { hour: 9, minute: 20 };
  const INTERVAL_END = { hour: 9, minute: 35 };

  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('inativo'); // "inativo", "ativo", "encerrado"



  useEffect(() => {
    const update = () => {
      const now = new Date();
      const startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        INTERVAL_START.hour,
        INTERVAL_START.minute,
        0,
        0
      );
      const endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        INTERVAL_END.hour,
        INTERVAL_END.minute,
        0,
        0
      );

      if (now >= startTime && now < endTime) {
        // dentro do intervalo
        setStatus('ativo');
        const totalSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${minutes}m ${String(seconds).padStart(2, '0')}s`);
      } else if (now < startTime) {
        // antes de começar
        setStatus('inativo');
        const totalSeconds = Math.max(0, Math.ceil((startTime - now) / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${minutes}m ${String(seconds).padStart(2, '0')}s`);
      } else {
        // já acabou
        setStatus('encerrado');
        setTimeLeft('');
      }
    };

    update(); // executa imediatamente para não esperar 1s
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <Text style={styles.title}>Controle de Intervalo</Text>

        <Text style={styles.status}>
          Status:{' '}
          {status === 'ativo'
            ? 'Intervalo Ativo'
            : status === 'inativo'
            ? 'Intervalo Inativo'
            : 'Intervalo Encerrado'}
        </Text>

        <Text style={styles.time}>
          {status === 'ativo'
            ? `Tempo para terminar: ${timeLeft}`
            : status === 'inativo'
            ? `Tempo para iniciar: ${timeLeft}`
            : 'Intervalo encerrado'}
        </Text>
      </View>

      <View style={styles.separator} />

      <Text style={styles.titleScreens}>Outras Telas</Text>
      <CustomButton
        title="Validar Ticket"
        style={styles.validationButton}
        onPress={() => navigation.navigate('Validation')}
      />
      <CustomButton title="Ver Localização" style={styles.localizationButton} />
      <CustomButton
        title="Voltar para Tela Inicial"
        style={styles.intervaloButton}
        onPress={() => navigation.navigate('Home')}
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
  separator: {
    height: 2,             
    width: '80%',           
    backgroundColor: '#00008B', 
    marginVertical: 16,    
  }
});

export default IntervalScreen;