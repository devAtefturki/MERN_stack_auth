import React, {useState} from 'react';
import {StyleSheet,Text,View,TextInput,TouchableOpacity,Alert} from 'react-native';
import axios from 'axios';
import{useNavigation} from '@react-navigation/native';

const Register=({callback})=>{
const [credentials,setCredentials]=useState({username:'',useremail:'',password:''});
const [check,setCheck]=useState("")

const navigation = useNavigation();

const MAX_LENGTH=15,
MIN_LENGTH=8,
PASS_LABELS=["Too Short","Weak", "Normal","Strong","Secure"];
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Registration</Text>
            <View style={styles.inputView}>
                <TextInput 
                style={styles.inputText}
                placeHolder='username...'
                onChangeText={text=>setCredentials({...credentials,username:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                placeholder='Email...'
                onChangeText={text=>setCredentials({...credentials,useremail:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                secureTextEntry
                style={styles.inputView}
                placeholder="Password..."
                onChangeText={text=>setCredentials({...credentials,password:text})}/>
            </View>
        {/* <!-- pass judgement --> */}
            <View>
                <TextInput 
                secureTextEntry
                placeholder="Retype Password To Confirm..."
                onChangeText={text=>setCheck(text)}/>
            </View>
        #<TouchableOpacity onPress={
                ()=>{
                    if (check!==credentials.password){
                        return Alert.alert("password does not match")
                    }
                    check===credentials.password?
                    axios
                    .post('http://localhost:4000/users/register',credentials)
                    .then((resp)=>{
                        callback(credentials.email)
                        navigation.navigate('Verification')
                    })
                    .catch(error=>{Alert.alert("Incorrect Credentials","user already exists")})
                    :null
                }

            }
            >
                <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontWeight: "bold",
      fontSize: 50,
      color: "#3CB371",
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
      backgroundColor: "#3CB371",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      marginBottom: 10
    },
    loginText: {
      color: "white"
    }
  });
export default Register