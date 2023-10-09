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
        <View>
            <Text>Registration</Text>
            <View>
                <TextInput 
                placeHolder='username...'
                onChangeText={text=>setCredentials({...credentials,username:text})}/>
            </View>
            <View>
                <TextInput
                placeholder='Email...'
                onChangeText={text=>setCredentials({...credentials,useremail:text})}/>
            </View>
            <View>
                <TextInput
                secureTextEntry
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
            <TouchableOpacity onPress={
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
                <Text>SIGNUP</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Register