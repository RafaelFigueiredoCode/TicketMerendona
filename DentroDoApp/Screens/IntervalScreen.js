import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';

const IntervalScreen = ({ navigation }) => {
  // Horários de exemplo
  const INTERVAL_START = { hour: 11, minute: 30 };
  const INTERVAL_END = { hour: 11, minute: 45 };

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
    <LinearGradient
    colors={['#4c669f', '#3b5998', '#192f6a']}
    style={styles.gradientBackground}
    >
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

      <CustomButton
        title="Validar Ticket"
        style={styles.validationButton}
        onPress={() => navigation.navigate('Validation')}
      />
      <CustomButton title="Ver Localização" 
      style={styles.localizationButton} 
      onPress= {()=> navigation.navigate('Location')}
      
      />
      <CustomButton
        title="Voltar para Tela Inicial"
        style={styles.intervaloButton}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  containerText: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  time: {
    fontSize: 18,
    color: '#fff',
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  titleScreens: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
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

export default IntervalScreen;