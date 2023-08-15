import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeHeader = ({ userFullName, setUserFullName, navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropDownPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileLayout')
    setDropdownVisible(false);
  };

  const handleSignOutPress = async() => {
    setDropdownVisible(false);
    setUserFullName('')
    await AsyncStorage.removeItem('@FullName')
  };

  return (
    <SafeAreaView style={styles.header}>
      <Text style={{ color: 'blue', fontSize: 20, fontWeight: 'bold' }}>KCKFORUM</Text>
      {
        userFullName ? 
        <>
            <TouchableOpacity onPress={handleDropDownPress}>
                <Text style={{ color: 'gray' }}>{userFullName}</Text>
            </TouchableOpacity>
            {dropdownVisible && (
                <View style={styles.dropdown}>
                {userFullName && (
                    <TouchableOpacity style={styles.dropdownItem} onPress={handleProfilePress}>
                    <Text>Profile</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.dropdownItem} onPress={handleSignOutPress}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
                </View>
            )}
        </>
        :
        <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: 'gray' }}>Sign In</Text>
        </TouchableOpacity>
      }
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  dropdown: {
    position: 'absolute',
    top: 60, 
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default HomeHeader;
