import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./Screens/LoginScreen";
import TicketScreen from "./Screens/TicketScreen";
import AdminScreen from './Screens/AdminScreen';
import IntervalScreen from './Screens/IntervalScreen';
import ValidationScreen from './Screens/ValidationScreen';
import AddAlunoScreen from './Screens/AddAlunoScreen'
import LocationScreen from './Screens/LocalizationScreen'

 
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={TicketScreen} />
            <Stack.Screen name="Interval" component={IntervalScreen}/>
            <Stack.Screen name="AdminHome" component={AdminScreen}/>
            <Stack.Screen name="Validation" component={ValidationScreen}/> 
            <Stack.Screen name="AddScreen" component={AddAlunoScreen}/> 
            <Stack.Screen name="Location" component={LocationScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}