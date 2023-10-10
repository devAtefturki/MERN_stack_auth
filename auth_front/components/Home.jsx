import {Text,View,Button, TouchableOpacity,StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


//onload use cookie to display name id and email

//const onscreenload=async ()=>{
  //  const val= await AsyncStorage.getItem('tokenCookie');
   // if (val!==null){return cb(val)}
   
 // }
 // useEffect (()=>{onscreenload()},[])



function Home({cb,cb2}){
    return (<View style={styles.container}>
        <Text style={styles.logo}>Welcome! {axios({
            method:'get',
            headers: token //you have yet to declare it above
        })}</Text>  {/*get the name using the stored token*/}
        <Text style={styles.logo}>your user id is {axios}</Text> {/*get the id*/}
        <Text style={styles.logo}>your email is {}</Text>    {/*get the email, dont forget to add functionaliy for changing the password maybe even deleting the account*/}
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