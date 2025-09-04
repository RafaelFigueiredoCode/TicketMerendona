import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import bcrypt from "bcryptjs";
import users from "../Users/users";
import { loginSuccess } from "../features/GlobalSave";

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alunos = useSelector((state) => state.alunos.alunos); // alunos cadastrados


  const handleLogin = () => {
    // junta os arrays: alunos cadastrados + usuários fixos
    const todosUsuarios = [...alunos, ...users];

    // procura usuário pela matrícula
    const found = todosUsuarios.find((u) => u.matricula === matricula);
    if (!found) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }

    // compara senha com bcrypt
    const isMatch = bcrypt.compareSync(password, found.senha);
    if (!isMatch) {
      Alert.alert("Erro", "Matrícula ou senha incorreta");
      return;
    }

    // autenticação Redux
    dispatch(
      loginSuccess({
        aluno: {
          nome: found.name,
          matricula: found.matricula,
          role: "aluno", 
        },
        token: "123abc",
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