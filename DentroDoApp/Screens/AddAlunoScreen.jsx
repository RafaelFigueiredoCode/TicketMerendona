import { useDispatch, useSelector } from "react-redux";
import { adicionarAluno, saveAlunos, clearAll } from "../features/AlunosSlice";
import { loginSuccess } from "../features/GlobalSave"; // ajuste o caminho correto
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

export default function AddAlunoScreen({ navigation }) {
  const dispatch = useDispatch();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const alunos = useSelector((state) => state.alunos.alunos);

  const handleAdicionar = async () => {
    if (!nome || !matricula || !senha || !cpf) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    const novoAluno = {
      id: Date.now(),
      nome: nome.trim(),
      matricula: matricula.trim(),
      cpf: cpf.trim(),
      senha: senha.trim(),
      role: "aluno",
    };

    dispatch(adicionarAluno(novoAluno));

    const updatedAlunos = [...(alunos || []), novoAluno];
    await dispatch(saveAlunos(updatedAlunos));

    // limpa os campos
    setNome("");
    setMatricula("");
    setCpf("");
    setSenha("");

    dispatch(
      loginSuccess({
        user: {
          id: novoAluno.id,
          nome: novoAluno.nome,
          matricula: novoAluno.matricula,
          role: novoAluno.role,
        },
        token: null,
      })
    );

    Alert.alert("Sucesso", "Aluno adicionado!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleScreens}>Vai Cadastrar Aluno?</Text>

      <CustomInput
        placeholder="Nome do aluno"
        value={nome}
        onChangeText={setNome}
        style={styles.alunoInput}
      />
      <CustomInput
        placeholder="Matrícula do Aluno"
        value={matricula}
        onChangeText={setMatricula}
        style={styles.alunoInput}
      />
      <CustomInput
        placeholder="CPF do Aluno"
        value={cpf}
        onChangeText={setCpf}
        style={styles.alunoInput}
      />
      <CustomInput
        placeholder="Senha do Aluno"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.alunoInput}
      />

      <CustomButton
        title="Adicionar"
        onPress={handleAdicionar}
        style={styles.locationButton}
      />
        <CustomButton
        title="Voltar"
        onPress={() => navigation.navigate("AdminHome")}
        style={styles.validationButton}
      />

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 	'#FFE4E1',
    },
    titleScreens: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 20,
      },
      alunoInput: {
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 10,
        width: '90%',
      },
      locationButton: {
        backgroundColor: '#D02090',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
      },
      validationButton: {
        backgroundColor: '#000',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
        marginTop: 30,
      },
})