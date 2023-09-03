import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ThreadsScreen from "./screens/ThreadsScreen";
import { Ionicons } from "@expo/vector-icons";
import ActivityScreen from "./screens/ActivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileUserScreen from "./screens/ProfileUserScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();


  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          setUserIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />



         <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Activity",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="heart" size={24} color="black" />
              ) : (
                <AntDesign name="hearto" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="black" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />

      </Tab.Navigator>
    );
  }


  return (
    <NavigationContainer>
      <Stack.Navigator>


      {/* {userIsAuthenticated ? (
          <>
            <Stack.Screen
               name="Main"
               component={BottomTabs}
               options={{ headerShown: false }}
             />
          </>
        ) : (
          <>
       
         <Stack.Screen
             name="Login"
             component={LoginScreen}
             options={{ headerShown: false }}
         />
         <Stack.Screen
             name="Register"
             component={RegisterScreen}
             options={{ headerShown: false }}
          />
          
          </>  
       )} */}


        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

       <Stack.Screen
          name="Thread"
          component={ThreadsScreen}
          options={{ headerShown: false }}
        />


      <Stack.Screen
          name="ProfileUserScreen"
          component={ProfileUserScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
