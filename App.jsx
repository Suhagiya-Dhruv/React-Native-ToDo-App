import LandingPage from './src/screen/landing'
import Details from './src/screen/inputDetails'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='ToDoPage'
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="ToDoPage" component={LandingPage}/>
        <Stack.Screen name="NewAdd" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


