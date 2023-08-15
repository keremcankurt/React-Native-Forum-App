import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { changePassword } from '../services/user';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { oldPassword, newPassword, confirmPassword } = formData;

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (newPassword !== confirmPassword) {
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2:  'Passwords do not match',
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
            const data = {
                oldPassword,
                newPassword
            };

            changePassword(data)
                .then((result) => {
                  Toast.show({
                    type: 'success',
                    text1: 'Change Password',
                    text2: result.message,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                  });
                })
                .catch((err) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Something went wrong',
                    text2: err.message,
                    position: 'bottom',
                    visibilityTime: 2000,
                    autoHide: true,
                  });
                });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Change Password</Text>
            <View style={styles.inputs}>
                <TextInput
                    name='oldPassword'
                    placeholder='Old Password'
                    value={oldPassword}
                    secureTextEntry={true}
                    onChangeText={(value) => handleChange('oldPassword', value)}
                    style={styles.input}
                />
                <TextInput
                    name='newPassword'
                    placeholder='New Password'
                    value={newPassword}
                    secureTextEntry={true}
                    onChangeText={(value) => handleChange('newPassword', value)}
                    style={styles.input}
                />
                <TextInput
                    name='confirmPassword'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputs: {
        width: '80%',
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
};
