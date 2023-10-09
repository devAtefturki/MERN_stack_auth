import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'




const Stack = createStackNavigator();


function MainNavigator(){

    return(
        <Text>nav works!</Text>
    )
}

function DrawerStack(){
    return (
        <Text>drawer works</Text>
    )
}


export default function AppContainer(){
    return (<View>
        <MainNavigator/>
        <DrawerStack/>
        </View>
    )
}