import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editProfile, getProfile } from '../services/user';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Bar } from 'react-native-progress';

export default function Profile({setUserFullName}) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    place: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { name, surname, place, email } = formData;

  useEffect(() => {
    getProfile()
      .then(profile => {
        setFormData({
          name: profile.name,
          surname: profile.surname,
          place: profile.place,
          email: profile.email,
        });
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
        navigation.navigate('Home');
      });
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const data = {
      name,
      surname,
      place,
    };
    editProfile(data)
      .then(async result => {
        setIsLoading(false);
        Toast.show({
            type: 'success',
            text1: 'Edit Profile',
            text2: result.message,
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
          await AsyncStorage.setItem('@FullName', (data.name + ' ' + data.surname))
          setUserFullName(data.name + ' ' + data.surname)
      })
      .catch(err => {
        setIsLoading(false);
        Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: err.message,
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
      });
  };

  return (
    <View style={styles.wrapper}>
        <View style={styles.container}>
        <Text style={styles.title}>Profile Informations</Text>
        <View style={styles.fullName}>
            <TextInput
                style={styles.textName}
                placeholder="Name"
                value={name}
                onChangeText={value => handleChange('name', value)}
            />
            <TextInput
                style={styles.textName}
                placeholder="Last Name"
                value={surname}
                onChangeText={value => handleChange('surname', value)}
            />
        </View>
        <TextInput
            style={styles.text}
            placeholder="Place"
            value={place === '' ? 'Unspecified' : place}
            onChangeText={value => handleChange('place', value)}
        />
        <TextInput style={styles.textEmail} placeholder="Email" value={email} editable={false} />
        <TouchableOpacity
            style={styles.submit}
            onPress={handleSubmit}
            disabled={isLoading}
        >
        {isLoading 
            ?  
            <Bar color='white' margin={7}  indeterminate={isLoading} /> 
            :
            <Text style={{ color: 'white', fontSize: 15 }}>Update</Text>
        }
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        borderWidth: 1,
        borderColor: 'rgba(95, 91, 91, 0.597)',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
        width: 2,
        height: 0
        },
        shadowOpacity: .2,
        shadowRadius: 5,
        elevation: 5,
        padding: 24,
        backgroundColor: "white",
        width: '95%',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    fullName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    text: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    textName: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        width: '45%',
    },
    textEmail: {
        backgroundColor: '#c0bebe',
        paddingVertical: 10,
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        marginBottom: 16,
    },
    submit: {
        backgroundColor: '#0084ff',
        paddingVertical: 7,
        alignItems: 'center',
        borderRadius: 5
    }
  });
