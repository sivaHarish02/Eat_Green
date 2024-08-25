import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import config from '../../config';

const EditProfilePage = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        image: '',
        location: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    const response = await axios.get(`${config}/getuser/${parsedData._id}`);
                    setUserData(response.data);
                    setLoading(false);
                } else {
                    Snackbar.show({
                        text: 'No user data found.',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                        action: {
                            text: 'OK',
                            textColor: 'white',
                            onPress: () => Snackbar.dismiss(),
                        },
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Snackbar.show({
                    text: 'Error fetching user data.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    action: {
                        text: 'OK',
                        textColor: 'white',
                        onPress: () => Snackbar.dismiss(),
                    },
                });
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            const parsedData = JSON.parse(storedUserData);
            await axios.put(`${config}/Updateuser/${parsedData._id}`, userData);

            Snackbar.show({
                text: 'Profile updated successfully!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'green',
                action: {
                    text: 'OK',
                    textColor: 'white',
                    onPress: () => Snackbar.dismiss(),
                },
            });
            setIsSaving(false);
            navigation.goBack(); // Navigate back after saving
        } catch (error) {
            setIsSaving(false);
            // console.error('Error updating user data:', error.response?.data || error.message); // Log detailed error

            // Extract error message from the response
            const errorMessage = error.response?.data?.message || 'Failed to update profile.';

            Snackbar.show({
                text: errorMessage,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                action: {
                    text: 'OK',
                    textColor: 'white',
                    onPress: () => Snackbar.dismiss(),
                },
            });
        }
    };



    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#32CD32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: userData.image || 'https://placekitten.com/200/200' }}
                />
                {/* <TouchableOpacity style={styles.changeImageButton}>
                    <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity> */}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={'#000'}
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'#000'}
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={userData.phoneNo}
                onChangeText={(text) => setUserData({ ...userData, phoneNo: text })} // Fixed the property name
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={userData.location}
                onChangeText={(text) => setUserData({ ...userData, location: text })}
            />
            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
            >
                <Text style={styles.saveButtonText}>
                    {isSaving ? 'Saving...' : 'Save'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        width: '100%',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        objectFit: 'contain',
        borderRadius: 50,
    },
    changeImageButton: {
        marginTop: 10,
    },
    changeImageText: {
        color: '#32CD32',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        color: "#000",
        padding: 10,
        fontWeight: '900',
        borderRadius: 5,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#32CD32',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditProfilePage;
