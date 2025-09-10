import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import users from "../Users/users";
import { loginSuccess } from "../features/GlobalSave";
import { loadAlunos } from "../features/AlunosSlice";

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alunos = useSelector((state) => state.alunos.alunos); // alunos cadastrados

  useEffect(() => {
    dispatch(loadAlunos());
  }, [dispatch]);


  const handleLogin = () => {
    // junta os arrays com segurança
    const todosUsuarios = [...(alunos || []), ...(users || [])];
  
    // procura usuário pela matrícula (ignora espaços/maiúsculas/minúsculas)
    const found = todosUsuarios.find(
      (u) => u.matricula.trim() === matricula.trim()
    );
  
    if (!found) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }
  
    // compara senha em texto simples
    if (password.trim() !== found.senha.trim()) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }
  
    // autenticação Redux (ajustado para o authSlice)
    dispatch(
      loginSuccess({
        user: {
          id: found.id,
          nome: found.nome || found.name, // aluno criado ou usuário fixo
          matricula: found.matricula,
          role: found.role || "aluno",
        },
        token: null, // você pode gerar um token JWT ou usar null
      })
    );
  
    // redirecionamento
    if (found.role === "admin") {
      navigation.replace("AdminHome");
    } else {
      navigation.replace("Home");
    }
  };

  return (
    <View style= {styles.container}>
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
  title: { fontSize: 26, marginBottom: 25, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});