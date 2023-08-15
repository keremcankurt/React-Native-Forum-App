import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { 
    View, 
    Text, 
    FlatList, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
} from 'react-native'
import { login } from '../services/auth';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress';

export default function Login({setUserFullName}) {
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation()

    const handleSignIn = async() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
      if(!password) {
        alert('Please enter a valid password');
        return;
      }
      const userData = {
        email,
        password
      }
      setIsLoading(true)
      login(userData).then(async(res) => {
        await AsyncStorage.setItem('@FullName', (res.fullName))
        Toast.show({
          type: 'success',
          text1: 'Sign in',
          text2: 'Signed in successfully',
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
        setIsLoading(false)
        setUserFullName(res.fullName)
        navigation.navigate('Home')
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: err.message,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
        setIsLoading(false)
      })
    };
    
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.login}>
          <View style={styles.inputs}>
            <Text style={styles.title}>KCKFORUM</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#00000030"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#00000030"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.forgotpassword} disabled={isLoading} >
              <Text style={{ color: 'blue' }}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.signIn} disabled={isLoading} onPress={handleSignIn}>
            {isLoading 
              ?  
              <Bar color='white' margin={7}  indeterminate={isLoading} /> 
              :
              <Text style={{ color: 'white' }}>Sign In</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUp} disabled={isLoading} onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'blue' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    login: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '80%',
        borderWidth: 1,
        padding: 10,
        paddingVertical: 30,
        borderColor: '#afaeae',
        borderRadius: 10,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000',
        shadowOffset: {
        width: 2,
        height: 4
        },
        shadowOpacity: .9,
        shadowRadius: 10,
        elevation: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgb(69, 155, 240)',
        marginBottom: 20,
    },
    inputs: {
        gap: 15,
        width: '100%',
    },
    textInput: {
        textAlign: 'left',
        paddingLeft: 10,
        paddingVertical: 5,
        backgroundColor: '#ebebeb',
        borderWidth: 1,
        color: '#696868',
        borderColor: 'gray',
    },
    forgotpassword: {
        alignSelf: 'flex-end', 
    },
    buttons: {
        width: '80%',
        gap: 15,
        marginTop: 20,
    },
    signIn: {
        alignItems: 'center',
        borderWidth: 1,
        padding: 5,
        borderColor: 'green',
        backgroundColor: '#04d104',
        borderRadius: 5,
    },
    signUp: {
        alignItems: 'center',
        borderWidth: 1,
        padding: 5,
        borderColor: 'blue',
        borderRadius: 5,
    }
    
  });
