import {Text,View,Button} from 'react-native';
import axios from 'axios';

function Home({cb,cb2}){
    return (<View>
        <Text>home works!</Text>
        <Button title="LOGOUT"
        color="red"
        onPress={()=>{axios.get('http://localhost:4000/users/logout'), cb(""),cb2("")}}/>
    </View>)
}
export default Home