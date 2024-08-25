import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';  // Import the Snackbar
import config from '../../config';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const handleRegister = async (values) => {
        try {
            const response = await axios.post(`${config}/register`, values);
            console.log('Registration successful:', response.data);

            // Show success message using Snackbar
            Snackbar.show({
                text: 'Registration successful!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#0fa140', // Custom background color
                textColor: '#fff',          // Custom text color
            });

            // Optionally, navigate to the Login screen or any other screen
            navigation.navigate('Login');
        } catch (error) {
            console.error('Registration error:', error);

            // Show error message using Snackbar
            Snackbar.show({
                text: 'Registration failed. Please try again.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#d9534f', // Custom background color for error
                textColor: '#fff',          // Custom text color for error
            });
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
                            source={require('../../assets/logo.jpg')} // Replace with your logo image
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logotext}>EatGreen</Text>
                    </View>
                </ImageBackground>
            </View>
            <ScrollView>
                <Text style={styles.Title}>Register</Text>
                <View style={styles.formContainer}>
                    <Formik
                        initialValues={{ name: '', email: '', phoneNo: '', location: '', password: '', image: '' }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            email: Yup.string().email('Invalid email address').required('Required'),
                            phoneNo: Yup.string().required('Required'),
                            location: Yup.string().required('Required'),
                            password: Yup.string().required('Required'),
                            image: Yup.string().url('Invalid URL').required('Required'), // Assuming image is a URL
                        })}
                        onSubmit={handleRegister}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                />
                                {touched.name && errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

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
                                    placeholder="Phone Number"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('phoneNo')}
                                    onBlur={handleBlur('phoneNo')}
                                    value={values.phoneNo}
                                    keyboardType="phone-pad" // Fixed the keyboardType
                                />
                                {touched.phoneNo && errors.phoneNo ? <Text style={styles.error}>{errors.phoneNo}</Text> : null}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Location"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('location')}
                                    onBlur={handleBlur('location')}
                                    value={values.location}
                                />
                                {touched.location && errors.location ? <Text style={styles.error}>{errors.location}</Text> : null}

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

                                <TextInput
                                    style={styles.input}
                                    placeholder="Image URL"
                                    placeholderTextColor={"#000"}
                                    onChangeText={handleChange('image')}
                                    onBlur={handleBlur('image')}
                                    value={values.image}
                                />
                                {touched.image && errors.image ? <Text style={styles.error}>{errors.image}</Text> : null}

                                <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                                    <Text style={styles.registerButtonText}>Register</Text>
                                </TouchableOpacity>

                                <Text style={styles.signupText} onPress={() => navigation.navigate('Login')}>
                                    Already have an account? <Text style={styles.signupLink}>Login</Text>
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
        backgroundColor: 'rgba(8, 154, 64, 0.61234)', // Green with 70% opacity
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 80, // Adjust the size of the logo
        height: 80,
        borderRadius: 50
    },
    logotext: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold"
    },
    Title: {
        fontSize: 24,
        color: "black",
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 0,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        color:'#000',
        backgroundColor: '#f6fffa',
        borderWidth: 1,
        fontWeight: '900',
        borderRadius: 20,
        paddingLeft: 20,
        marginBottom: 12,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#0fa140',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: "800"
    },
    signupText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color:'#000'
    },
    signupLink: {
        color: '#0fa140',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
