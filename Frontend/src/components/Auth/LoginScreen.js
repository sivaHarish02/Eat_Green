import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import config from '../../config';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post(`${config}/login`, values);
            const userData = response.data; // Assuming the response contains user data

            // Store user data in AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userData));

            console.log('Login successful:', userData);

            Snackbar.show({
                text: 'Login successful!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#0fa140',
                textColor: '#fff',
            });

            // Navigate to the Home screen
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);

            Snackbar.show({
                text: error.response?.data?.message || 'Login failed. Please try again.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#d9534f',
                textColor: '#fff',
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground
                    source={require('../../assets/vegetableslogo.jpg')}
                    style={styles.headerImage}
                    imageStyle={styles.backgroundImageStyle}
                >
                    <View style={styles.overlay}>
                        <Image
                            source={require('../../assets/logo.jpg')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logotext}>EatGreen</Text>
                    </View>
                </ImageBackground>
            </View>
            <ScrollView>
                <View>
                    <Text style={styles.loginTitle}>Log In</Text>
                </View>
                <View style={styles.formContainer}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string().email('Invalid email address').required('Required'),
                            password: Yup.string().required('Required'),
                        })}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {touched.email && errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                                {touched.password && errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

                                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>Log In</Text>
                                    )}
                                </TouchableOpacity>

                                <Text style={styles.forgotPassword}>Forget password?</Text>
                                <View>
                                    <Text style={styles.orText}>Or</Text>
                                </View>

                                <View style={styles.socialLoginContainer}>
                                    <TouchableOpacity style={styles.socialLoginButton}>
                                        <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
                                        <Text style={styles.socialLoginText}>Log in with Google</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialLoginButton}>
                                        <Image source={require('../../assets/facebook.png')} style={styles.socialIcon} />
                                        <Text style={styles.socialLoginText}>Log in with Facebook</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.signupText} onPress={() => navigation.navigate('Register')}>
                                    Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                                </Text>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: width,
        height: 250,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    backgroundImageStyle: {
        opacity: 0.4,
    },
    overlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(8, 154, 64, 0.612345)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    logotext: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold"
    },
    loginTitle: {
        fontSize: 24,
        color: "black",
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f6fffa',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        fontWeight: '900',
        color: "#000",
        paddingLeft: 20,
        marginBottom: 12,
        opacity: 0.8,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#0fa140',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "700"
    },
    forgotPassword: {
        marginTop: 20,
        textAlign: 'center',
        color: "#000"
    },
    orText: {
        marginVertical: 10,
        fontSize: 24,
        color: "black",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    socialLoginContainer: {
        width: '100%',
        marginTop: 30,
    },
    socialLoginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: '#0fa140',
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 25,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    socialLoginText: {
        color: 'black',
        fontSize: 16,
        fontWeight: "900"
    },
    signupText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color: "#000"
    },
    signupLink: {
        color: '#0fa140',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
