import {Text} from 'react-native';


function Home({cb}){
    return (<View>
        <Text>home works!</Text>
        <Button title="LOGOUT"
        color="red"
        onPress={()=>{cb.settoken("")}}/>
    </View>)
}
export default Home