import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, TextInput, Button, Alert, StyleSheet, Text} from "react-native";
import users from "../Users/users";
import { loginSuccess } from "../features/GlobalSave";
import { loadAlunos } from "../features/AlunosSlice";

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alunos = useSelector((state) => state.alunos.alunos); 

  useEffect(() => {
    dispatch(loadAlunos());
  }, [dispatch]);

  const handleLogin = () => {
    
    const todosUsuarios = [...(alunos || []), ...(users || [])];
  
    const found = todosUsuarios.find(
      (u) => u.matricula.trim() === matricula.trim()
    );
  
    if (!found) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }
  
    
    if (password.trim() !== found.senha.trim()) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }
  
    
    dispatch(
      loginSuccess({
        user: {
          id: found.id,
          nome: found.nome || found.name, 
          matricula: found.matricula,
          role: found.role || "aluno",
        },
        token: null, 
      })
    );
  
    if (found.role === "admin") {
      navigation.replace("AdminHome");
    } else {
      navigation.replace("Home");
    }
  };

  return (
    <View style= {styles.container}>
      <Text style={styles.title}> Login </Text>
      <TextInput
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button 
      title="Entrar" 
      onPress={handleLogin} 
      style={styles.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 25, textAlign: "center", fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#B0E0E6',
    fontWeight: 'bold'
  },
});