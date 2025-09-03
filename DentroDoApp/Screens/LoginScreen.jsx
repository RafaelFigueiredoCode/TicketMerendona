import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/GlobalSave";
import CustomInput from '../components/CustomInput'
import users from '../Users/users';
import bcrypt from "bcryptjs";


export default function LoginScreen({navigation})  {
    const [matricula, setMatricula] = useState('')
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth)


    const handleLogin = () => {
      const found = users.find((u) => u.matricula === matricula);
    
      if (!found) {
        Alert.alert("Erro", "Matrícula ou senha incorreta");
        return;
      }
    
      const isMatch = bcrypt.compareSync(password, found.senha);
    
      if (!isMatch) {
        Alert.alert("Erro", "Matrícula ou senha incorreta");
        return;
      }
    
      dispatch(
        loginSuccess({
          user: {
            id: found.id,
            name: found.name,
            matricula: found.matricula,
            role: found.role
          },
          token: "123abc"
        })
      );
    
      navigation.replace("Home");
    };

      return(
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        <CustomInput
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