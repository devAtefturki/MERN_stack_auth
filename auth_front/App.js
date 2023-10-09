import {useState} from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Verification from './components/Verification';
import Home from './components/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
function App() {

  const [token,settoken]=useState('');
  const Stack=createNativeStackNavigator();
  const [email,setEmail]=useState('');
  return (
  token.length?
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" children={(cb)=><Home cb={settoken} cb2={setEmail}/>}/>
    </Stack.Navigator>
  </NavigationContainer>
  :<NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" children={(cb)=><Login cb={settoken}/>}/>
      <Stack.Screen name="Verification"  children={(cb)=><Verification cb2={settoken} cb={email}/>}/>
      <Stack.Screen name="Register"  children={(cb)=><Register cb={setEmail}/>}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;