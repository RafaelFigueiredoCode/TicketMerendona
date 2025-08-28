import { StyleSheet, View, Text, FlatList, ActivityIndicator, TextInput, Alert} from 'react-native';
import { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import { increment, decrement, reset } from '../features/counterSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function TicketScreen({navigation}){
    const counter = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return(
        <View>
        <CustomButton
        title="Incrementar"
        onPress={() => dispatch(increment())}
        color="#007bff"
      />
      <CustomButton
        title="Decrementar"
        onPress= {() => navigation.navigate("Login")}
        color="#007bff"
      />
      <CustomButton
        title="Resetar Contador"
        onPress={() => dispatch(reset())}
        color="#007bff"
      />
      </View>
    )
}