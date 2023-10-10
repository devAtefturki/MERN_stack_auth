import {Text,StyleSheet,View,TextInput,TouchableOpacity,Alert} from 'react-native';
import axios from 'axios';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';


const Login= ({callback})=>{
const [credentials, setCredentials]=useState({useremail:'',userpass:''});
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
        <View style={styles.container}>
            <Text style={styles.logo}>Login</Text>
            <View style={styles.inputView}>
                <TextInput 
                style={styles.inputText} placeholder='Email...'
                onChangeText={text=>setCredentials({...credentials,useremail:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                style={styles.inputText}
                secureTextEntry
                placeholder='Password...'
                onChangeText={text=>setCredentials({...credentials,userpass:text})}
                />
            </View>
            <TouchableOpacity onPress={()=>{navigation.navigate('Verification')}}>
                <Text style={styles.loginText}>Verify your account ?</Text>
            </TouchableOpacity>
            <TouchableOpacity >
                <Text style={styles.forgot}>Forgot Password? (coming soon)</Text>
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
             style={styles.loginBtn}> 
            <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{navigation.navigate('Register')}}>
                <Text style={styles.loginText}>dont have an account? Register</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f7f7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontWeight: "bold",
      fontSize: 50,
      color: "#61DBFB",
      marginBottom: 40
    },
    inputView: {
      width: "80%",
      backgroundColor: "#fff",
      borderBottomWidth:1,
      borderRadius: 25,
      height: 50,
      marginBottom: 20,
      justifyContent: "center",
      padding: 20
    },
    inputText: {
      height: 50,
      color: "black"
    },
    forgot: {
      color: "white",
      fontSize: 11
    },
    loginBtn: {
      width: "80%",
      backgroundColor: "#61DBFB",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      marginBottom: 10
    },
    loginText: {
      color: "black"
    }
  });
export default Login