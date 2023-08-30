import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'i import edin
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import HomeHeader from './components/HomeHeader';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { StatusBar } from 'expo-status-bar';
import AddContent from './screens/AddContent';
import { ContentProvider } from './context/ContentContext';
import Content from './screens/Content';
import User from './screens/User';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './screens/Profile';
import Share from './screens/Share';
import Settings from './screens/Settings';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()

const App = () => {
  
  const [userFullName, setUserFullName] = useState(null);

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem('@FullName');
        setUserFullName(storedFullName);
      } catch (error) {
        console.log('Error fetching fullName:', error);
      }
    };

    fetchFullName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ContentProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Home'
              component={Home}
              options={({ navigation }) => ({
                header: () => <HomeHeader userFullName={userFullName} setUserFullName={setUserFullName} navigation={navigation} />,
                headerShown: true,
              })}
            />
            <Stack.Screen name='Login'  options={{ headerShown: false }} >
              {props => <Login {...props} setUserFullName={setUserFullName} />}
            </Stack.Screen>
            <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <Stack.Group
              screenOptions={{
                gestureEnabled: true,
                ...(TransitionPresets.ModalPresentationIOS)}}
              >
              <Stack.Screen name="AddContent" component={AddContent} options={{title: "Add Content"}}/>
              <Stack.Screen name="Content" component={Content} options={{ headerShown: false }}/>
              <Stack.Screen name="User" component={User} options={{ headerShown: false }}/>
          </Stack.Group>
          <Stack.Screen name='ProfileLayout' options={{title: userFullName || '',
            headerTitleStyle: {
              color: 'gray',
            },
          } }>
            {({ navigation }) => (
              <Tab.Navigator
                screenOptions={{ headerShown: false }} // Tab.Navigator içerisindeki tüm header'ları gizle
              >
                <Tab.Screen 
                  name='Profile'
                  options={({ route }) => ({
                    tabBarIcon: ({focused, color, size}) => (
                      <Ionicons name='person' size={size} color={color}/>
                    ),
                  })}
                >
                  {() => (
                    <Profile setUserFullName={setUserFullName} />
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Share"
                  component={Share}
                  options={{
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons name="share" size={size} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={Settings}
                  options={{
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons name="settings" size={size} color={color} />
                    ),
                  }}
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>

          </Stack.Navigator>
        </NavigationContainer>
      </ContentProvider>
      <Toast/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});

export default App;
