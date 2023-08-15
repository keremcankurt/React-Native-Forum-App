import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
} from 'react-native'
import {  register } from '../services/auth';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bar } from 'react-native-progress';

export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [place, setPlace] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation()

    const handleSignUp = async() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
      if(!password) {
        alert('Please enter a valid password');
        return;
      }
      if (password!== confirmPassword) {
        alert("Passwords don't match")
        return;
      }
      const userData = {
        name,
        surname,
        place,
        email,
        password,
      };
      setIsLoading(true)
      register(userData).then(async(res) => {
        Toast.show({
          type: 'success',
          text1: 'Sign Up',
          text2: res.message,
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
        });
        setIsLoading(false)
        navigation.navigate('Login')
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: err.message,
          position: 'bottom',
          visibilityTime: 4000,
          autoHide: true,
        });
        setIsLoading(false)
      })
    };
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.register}>
          <View style={styles.inputs}>
            <Text style={styles.title}>KCKFORUM</Text>
            <View style={styles.fullName}>
              <TextInput
                style={[styles.textInput, {width: '48%'}]}
                placeholder="Name"
                placeholderTextColor="#00000030"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[styles.textInput, {width: '49%'}]}
                placeholder="Last Name"
                placeholderTextColor="#00000030"
                value={surname}
                onChangeText={setSurname}
              />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Place"
              placeholderTextColor="#00000030"
              value={place}
              onChangeText={setPlace}
            />
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
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#00000030"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.signUp} disabled={isLoading} onPress={handleSignUp}>
            {isLoading 
              ?  
              <Bar color='white' margin={7}  indeterminate={isLoading} /> 
              :
              <Text style={{ color: 'white' }}>Sign Up</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.signIn} disabled={isLoading} onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: 'blue' }}>Sign In</Text>
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
    register: {
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
    fullName: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
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
        borderColor: 'blue',
        borderRadius: 5,
    },
    signUp: {
        alignItems: 'center',
        borderWidth: 1,
        padding: 5,
        borderColor: 'green',
        backgroundColor: '#04d104',
        borderRadius: 5,
    }
    
  });
