import { useDispatch, useSelector } from "react-redux";
import { adicionarAluno } from "../features/AlunosSlice";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import bcrypt from "bcryptjs";
import { saveAlunos } from "../features/AlunosSlice";

export default function AdminScreen() {
  const dispatch = useDispatch();
  const [nome, setNome] = useState("");
  const [matriculaFind, setMatriculaFind] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("aluno");
  const [resultado, setResultado] = useState(null);
  const alunos = useSelector((state) => state.alunos.alunos);

  const handleAdicionar = async () => {
    if (!nome || !matricula || !senha || !cpf) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
  
    const salt = bcrypt.genSaltSync(10);
    const senhaCriptografada = bcrypt.hashSync(senha, salt);
  
    const novoAluno = {
      id: Date.now(),
      nome,
      matricula,
      cpf,
      senha: senhaCriptografada,
      role: "aluno",
    };
  
    dispatch(adicionarAluno(novoAluno));
  
    // Pega o estado atualizado após dispatch
    const updatedAlunos = [...alunos, novoAluno];
    await dispatch(saveAlunos(updatedAlunos));
  
    setNome("");
    setMatricula("");
    setCpf("");
    setSenha("");
  };
  
  const handlePesquisar = () => {
    const aluno = alunos.find((a) => a.matricula === matriculaFind);
    setResultado(aluno || null);
  };

  return (
    <View style= {styles.container}>
        <Text style={styles.titleScreens}>Vai Cadastrar Aluno?</Text>
      <CustomInput
        placeholder="Nome do aluno"
        value={nome}
        onChangeText={setNome}
        style={styles.alunoInput}
      />
        <CustomInput
        placeholder="Matricula do Aluno"
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
      style= {styles.locationButton}
      />
      <Text style={styles.titleScreens}>Quer Visualizar Aluno?</Text>
      <CustomInput
        placeholder="Digite a matrícula"
        value={matriculaFind}
        onChangeText={setMatriculaFind}
        style={styles.matriculeInput}
      />
      <CustomButton 
      title="Pesquisar" 
      onPress={handlePesquisar} 
      style={styles.matriculeButton}
      />

      {resultado ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Aluno encontrado:
          </Text>
          <Text>Nome: {resultado.nome}</Text>
          <Text>Matrícula: {resultado.matricula}</Text>
          <Text>CPF: {resultado.cpf}</Text>
        </View>
      ) : (
        matriculaFind !== "" && (
          <Text style={{ marginTop: 20, color: "red" }}>
            Nenhum aluno encontrado
          </Text>
        )
      )}
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
    locationButton: {
        backgroundColor: '#D02090',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
      },
      list: {
        flex: 1,
      },
      containerText: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 	'#E9967A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 50,
      },
      matriculeButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
      },
      matriculeInput: {
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 10,
        width: '90%',
      },
      alunoInput: {
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 10,
        width: '90%',
      },
      titleScreens: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 20,
      },
})
