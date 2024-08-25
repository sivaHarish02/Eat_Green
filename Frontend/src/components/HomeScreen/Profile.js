import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Snackbar from 'react-native-snackbar'; // Import Snackbar
import config from '../../config';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
                try {
                    const storedUserData = await AsyncStorage.getItem('userData');
                    if (storedUserData) {
                        const parsedData = JSON.parse(storedUserData);
                        const response = await axios.get(`${config}/getuser/${parsedData._id}`);
                        setUserData(response.data); // Directly use response.data
                        setLoading(false); // Make sure to set loading to false when data is fetched
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
                        setLoading(false); // Ensure loading is set to false even if no user data is found
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
                    setLoading(false); // Ensure loading is set to false in case of an error
                }
            };

            fetchUserData();
        }, []) // Empty dependency array ensures this runs only on focus
    );

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            Snackbar.show({
                text: 'Logout successful!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'green',
                action: {
                    text: 'OK',
                    textColor: 'white',
                    onPress: () => Snackbar.dismiss(),
                },
            });
            // Navigate to the Login screen after showing the success message
            setTimeout(() => {
                navigation.navigate('Login', { replace: true });
            }, 500); // Slight delay to allow Snackbar to show
        } catch (error) {
            console.error('Error logging out:', error);
            Snackbar.show({
                text: 'Failed to log out. Please try again.',
                duration: Snackbar.LENGTH_SHORT,
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

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load user data.</Text>
            </View>
        );
    }
    const handlePress = () => {
        // Passing default value when navigating back
        navigation.navigate('Home', { updatedata: 'updated' });
    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>

                <TouchableOpacity onPress={handlePress}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerTitle}>

                    <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.settingsText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <Icon name="settings" size={24} color="black" />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.profileSection}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: userData.image || 'https://w7.pngwing.com/pngs/215/270/png-transparent-minion-character-illustration-bob-the-minion-stuart-the-minion-kevin-the-minion-minions-heroes-material-film-thumbnail.png' }}
                />
                <Text style={styles.username}>{userData.name || 'Angel Christinal'}</Text>
                <Text style={styles.location}>{userData.location || 'Peelamedu'}</Text>
            </View>

            <View style={styles.infoSection}>
                <TouchableOpacity style={styles.infoItem}>
                    <Icon name="email" size={24} color="#32CD32" />
                    <Text style={styles.infoText}>{userData.email || 'angel@example.com'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoItem}>
                    <Icon name="phone" size={24} color="#32CD32" />
                    <Text style={styles.infoText}>{userData.phoneNo || '+91 1234567890'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoItem}>
                    <Icon name="home" size={24} color="#32CD32" />
                    <Text style={styles.infoText}>{userData.location || '123, Main Street, Peelamedu'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Myorders')}>
                    <Text style={styles.actionText}>Order History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Favorite')}>
                    <Text style={styles.actionText}>Wishlist</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>

                {/* <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('ChangePassword')}>
                    <Text style={styles.settingsText}>Change Password</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('NotificationSettings')}>
                    <Text style={styles.settingsText}>Notification Settings</Text>
                </TouchableOpacity> */}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        objectFit: "contain",
        borderRadius: 50,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginVertical: 10,
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    infoSection: {
        marginVertical: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 10,
    },
    actionSection: {
        marginVertical: 20,
    },
    actionItem: {
        backgroundColor: '#32CD32',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    settingsSection: {
        marginVertical: 20,
    },
    settingsItem: {
        marginHorizontal: 10, // Add spacing around the text
    },
    settingsText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333333',
        textAlign: 'center', // Center the text within its container
    },

    footer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logoutButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default ProfilePage;
