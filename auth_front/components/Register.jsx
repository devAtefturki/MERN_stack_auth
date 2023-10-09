import React, {useState} from 'react';
import {StyleSheet,Text,View,TextInput,TouchableOpacity,Alert} from 'react-native';
import axios from 'axios';
import{useNavigation} from '@react-navigation/native';
import PassMeter from './Pass'




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
                placeholder='Username...'
                placeholderTextColor="#003F5C"
                onChangeText={text=>setCredentials({...credentials,username:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                placeholder='Email...'
                placeholderTextColor="#003F5C"
                onChangeText={text=>setCredentials({...credentials,useremail:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                secureTextEntry
                maxLength={15}
                style={styles.inputText}
                placeholderTextColor="#003F5C"
                placeholder="Password..."
                onChangeText={text=>setCredentials({...credentials,password:text})}/>
            </View>
            
            <PassMeter
       showLabels
       password={credentials.password}
       maxLength={MAX_LENGTH}
       minLength={MIN_LENGTH}
       labels={PASS_LABELS}
      /> 
      
            <View style={styles.inputView}>
                <TextInput 
                style={styles.inputText}
                secureTextEntry
                placeholderTextColor="#003F5C"
                placeholder="Retype Password To Confirm..."
                onChangeText={text=>setCheck(text)}/>
            </View>
        <TouchableOpacity 
        style={styles.loginBtn} onPress={
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
      color: "white"
    }
  });
export default Register;