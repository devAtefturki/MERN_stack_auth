import {Animated, Image, SafeAreaView, Text, View,StyleSheet, Platform,TouchableOpacity,TextInput} from 'react-native';
import React, {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {useNavigation} from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import axios from 'axios';


 const CELL_SIZE = 70;
 const CELL_BORDER_RADIUS = 8;
 const DEFAULT_CELL_BG_COLOR = '#fff';
 const NOT_EMPTY_CELL_BG_COLOR = '#3CB371';
 const ACTIVE_CELL_BG_COLOR = '#f7fafe';

const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 7;


const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const Verification = ({cb,cb2}) => {
 // const navigation= useNavigation()
  const [dummyState,SetDummyState]=useState("")
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [em,setEm]=useState(cb)
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('tokenCookie', value)
    } catch (e) {
      // saving error
    }
  }

  const onscreenload=async ()=>{
    const val= await AsyncStorage.getItem('tokenCookie');
    if (val!==null){return cb2(val)}
   
  }
  useEffect (()=>{onscreenload()},[])


  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };
    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Verification</Text>
      <Image style={styles.icon} source={require("../assets/4.png")} />
      <Text style={styles.subTitle}>
        {cb.length? `Please enter the verification code from your inbox`:`Please enter your email and verification code`}
      </Text>
           {cb.length ? null :<View style={styles.inputView} >
       <TextInput
        style={styles.inputText}
        placeholder="Email..."
        placeholderTextColor="#003f5c"
        onChangeText={(text) =>{ setEm(text),console.log(em,value)}} />
         </View> }
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={(text)=>{setValue(text),console.log(em,value)}}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <TouchableOpacity style={styles.nextButton} onPress={()=>{
        axios
        .post('http://localhost:4000/users/verify',{ValidatorCode:value,useremail:em})
        .then(resp=>{storeData(resp.data),console.log(resp),SetDummyState("wham!"),onscreenload()/*,navigation.navigate('Home')*/ /*,cb2(AsyncStorage.getItem('tokenCookie'))*/})
        .catch(erre => {Alert.alert("Incorrect credentials","user already exists")})
      }}>
        
        <Text style={styles.nextButtonText}>Verify</Text>
      </TouchableOpacity>
      <View><Text style={{fontSize:3,color:"#ffffff"}}>{dummyState}</Text></View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  codeFieldRoot: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    ...Platform.select({web: {lineHeight: 65}}),
    fontSize: 30,
    textAlign: 'center',
    borderRadius: CELL_BORDER_RADIUS,
    color: '#3759b8',
    backgroundColor: '#f7f7f7',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },
  inputView: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomWidth:1,
    borderRadius: 25,
    height: 50,
    marginBottom: 2,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  // =======================

  root: {
    minHeight: '100%',
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#61DBFB",
    marginBottom: 40,
    textAlign:'center'
  },
  icon: {
    width: 217 / 2.4,
    height: 158 / 2,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subTitle: {
    paddingTop: 30,
    paddingBottom:30,
    color: '#61DBFB',
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: '#61DBFB',
    justifyContent: 'center',
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
});
export default Verification;