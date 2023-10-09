import {Text,StyleSheet,View,TextInput,TouchableOpacity,Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';


const Login= ({callback})=>{
const [credentials, setCredentials]=useState({email:'',password:''});
const navigation= useNavigation();

const storeData=async (value)=>{
    try{
await AsyncStorage.setItem('token',value)
    } catch(e){
        //save error
    }
}
console.log(credentials);


    return(
        <View>
            <Text>Login</Text>
            <View>
                <TextInput placeholder='Email...'
                onChangeText={text=>setCredentials({...credentials,email:text})}/>
            </View>
            <View>
                <TextInput
                secureTextEntry
                placeholder='Password...'
                onChangeText={text=>setCredentials({...credentials,password:text})}
                />
            </View>
            <TouchableOpacity onPress={()=>{navigation.navigate('Verification')}}>
                <Text>Verify your account ?</Text>
            </TouchableOpacity>
            <TouchableOpacity >
                <Text>Forgot Password? (coming soon)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={
                axios
                .post('http://localhost:4000/users/login',credentials)
                .then((resp)=>{storeData(resp.data);callback('logged in')})
                .catch(error=>{
                    Alert.alert(
                        'incorrect credentials',
                        'please check your email or password'
                    )
                })
            }
            > 
            <Text>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{navigation.navigate('Register')}}>
                <Text>dont have an account? Register</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Login