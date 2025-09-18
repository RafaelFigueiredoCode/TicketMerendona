import { useDispatch, useSelector } from "react-redux";
import { adicionarAluno, saveAlunos, clearAll } from "../features/AlunosSlice";
import { useState } from "react";
import { View, Text, StyleSheet, Alert} from "react-native";
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';



export default function AdminScreen({navigation}) {
  const [matriculaFind, setMatriculaFind] = useState("");
  const [resultado, setResultado] = useState(null);
  const alunos = useSelector((state) => state.alunos.alunos);


  
  const handlePesquisar = () => {
    const aluno = alunos.find((a) => a.matricula === matriculaFind);
    setResultado(aluno || null);
  };

  return (
     <View style={styles.container}>
      <Text style={styles.titleScreens}>Vai adicionar um Aluno?</Text>
      <CustomButton
      title="Tela de Adicionar"
      style={styles.locationButton}
      onPress={() => navigation.navigate("AddScreen")}
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
      <CustomButton 
      title="Deletar Tudo" 
      onPress={clearAll} 
      style={styles.matriculeButton}
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
