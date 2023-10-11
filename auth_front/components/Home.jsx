import {Text,View, TouchableOpacity,StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState,useEffect} from 'react';






function Home({cb,cb2}){
    
    const [creds,setCreds]=useState({username:"",useremail:"",iduser:""});
    const onloadUserCredentials=async ()=>{
        await axios({
            method:'get',
            headers: {Authorization:"bearer "+await AsyncStorage.getItem('tokenCookie')},
            url:'http://localhost:4000/users/getUser'
        }).then((response)=>{
            console.log(response)
            setCreds({...creds,username:response.data.username,useremail:response.data.useremail,iduser:response.data.iduser})
        });
    
       
     }
    
     useEffect (()=>{onloadUserCredentials()},[])
    




    return (<View style={styles.container}>
        <Text style={styles.logo}>Welcome! {creds.username}</Text>  
        <Text style={styles.logo}>your user id is {creds.iduser}</Text>
        <Text style={styles.logo}>your email is {creds.useremail}</Text>  
        <TouchableOpacity style={styles.logoutBtn}
        onPress={()=>{axios.get('http://localhost:4000/users/logout'), cb(""),cb2(""),AsyncStorage.removeItem('tokenCookie')}}>
            <Text>LOGOUT</Text>
        </TouchableOpacity>
    </View>)
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f7f7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutBtn: {
        width: "80%",
        backgroundColor: "#61DBFB",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
      },
      logo: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#61DBFB",
        marginBottom: 40
      }
    
})
export default Home