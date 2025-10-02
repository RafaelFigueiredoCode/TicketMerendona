import { useDispatch, useSelector } from "react-redux";
import { clearAll, clearTickets } from "../features/AlunosSlice";
import { useState } from "react";
import { View, Text, StyleSheet, Alert} from "react-native";
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { LinearGradient } from "expo-linear-gradient";




export default function AdminScreen({navigation}) {
  const [matriculaFind, setMatriculaFind] = useState("");
  const [resultado, setResultado] = useState(null);
  const alunos = useSelector((state) => state.alunos.alunos);


  
  const handlePesquisar = () => {
    const aluno = alunos.find((a) => a.matricula === matriculaFind);
    setResultado(aluno || null);
  };

  return (
    <LinearGradient
      colors={["#FFF5E1", "#FFE4B5", "#FFFFFF"]} 
      style={styles.gradient}
    >
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Aluno encontrado:
            </Text>
            <Text style={{ fontSize: 16}}>Nome: {resultado.nome}</Text>
            <Text style={{ fontSize: 16}}>Matrícula: {resultado.matricula}</Text>
            <Text style={{ fontSize: 16, marginBottom: 20}}>CPF: {resultado.cpf}</Text>
          </View>
        ) : (
          matriculaFind !== "" && (
            <Text style={{ marginTop: 20, color: "red", marginBottom: 20 }}>
              Nenhum aluno encontrado
            </Text>
          )
        )}
  
        <CustomButton 
          title="Deletar Tickets" 
          onPress={clearTickets} 
          style={styles.matriculeButton}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
gradient: {
  flex: 1,
},
container: {
  flex: 1,
  padding: 20,
  justifyContent: "center",
},
titleScreens: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 10,
  marginTop: 20,
  color: "#000", // contraste no fundo laranja
  textAlign: "center",
},
matriculeInput: {
  backgroundColor: "#fff",
  borderRadius: 8,
  padding: 10,
  marginVertical: 10,
  borderColor: '#5F9EA0',
  borderWidth: 2
},
matriculeButton: {
  marginVertical: 10,
  backgroundColor: '#1E90FF'
},
locationButton: {
  marginVertical: 10,
  backgroundColor: '#008B8B'
},
});
