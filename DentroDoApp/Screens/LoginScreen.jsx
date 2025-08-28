import { StyleSheet, View, Text, FlatList, ActivityIndicator, TextInput, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/GlobalSave";
import CustomInput from '../components/CustomInput'

export default function LoginScreen({navigation})  {
    const [matricula, setMatricula] = useState('')
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth)

    const handleLogin = () => {
        if (matricula === "" || password === "") {
          Alert.alert("Erro", "Preencha todos os campos!");
          return;
        }

    const fakeUser = { id: 1, name: "Rafael", matricula };
    const fakeToken = "123abc";
    
    dispatch(loginSuccess({ user: fakeUser, token: fakeToken }));

    navigation.replace("Home");

    }

      return(
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Matricula"
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="none"
          />
        
  
        <CustomInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
  
        <CustomButton title="Entrar" onPress={handleLogin} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 26, marginBottom: 25, textAlign: "center" },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 12,
      marginBottom: 15,
      borderRadius: 8,
    },
  });