// src/navigation/AppNavigator.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/Auth/LoginScreen';
import RegisterScreen from '../components/Auth/RegisterScreen';
import HomeScreen from '../components/HomeScreen/HomeScreen';
import AllTrendingDeals from '../components/Product/AllTrending_Deals';
import CartScreen from '../components/Product/cartlist';
import CheckoutScreen from '../components/Product/checkOut';
import OrderSuccessScreen from '../components/Product/OrderSuccessScreen';
import FavoritePage from '../components/Product/Favorite';
import Myorders from '../components/Product/Myoders';
import ProfileScreen from '../components/HomeScreen/Profile';
import EditProfilePage from '../components/HomeScreen/EditProfilePage';


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
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
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProductList"
                    component={AllTrendingDeals}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="cartlist"
                    component={CartScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Checkout"
                    component={CheckoutScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OrderSuccessScreen"
                    component={OrderSuccessScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Favorite"
                    component={FavoritePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Myorders"
                    component={Myorders}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="EditProfile"
                    component={EditProfilePage}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
