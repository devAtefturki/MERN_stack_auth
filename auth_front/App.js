import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/Login';
import Register from './components/Register'
import Verification from './components/Verification'

function App() {

  const [token,settoken]=useState('');
  const Stack=createNativeStackNavigator();
  const [email,setEmail]=useState('');
  return (
  token.length?
  <NavigationContainer>
    <Text>home</Text>
  </NavigationContainer>
  :<NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" children={(cb)=><Login cb={settoken}/>}/>

    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;