import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import config from '../../config'; // Ensure you have the correct path for your config
import { useRoute } from '@react-navigation/native';
const UserProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { updatedata } = route.params || {};
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handlenavigation = () => {
        navigation.navigate('Profile');
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    const response = await axios.get(`${config}/getuser/${parsedData._id}`);
                    setUserData(response.data);
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [updatedata]); // Empty dependency array

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(8, 154, 64)" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const { name, location, image } = userData || {};

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.locationContainer}>
                        <Image
                            source={require('../../assets/location.png')}
                            style={styles.locationIcon}
                        />
                        <Text style={styles.location}>{location}</Text>
                    </View>
                </View>

                {/* Notification Icon */}
                <TouchableOpacity style={styles.notificationButton}>
                    <Image
                        source={require('../../assets/notification.png')}
                        style={styles.notificationIcon}
                    />
                </TouchableOpacity>

                {image ? (
                    <TouchableOpacity onPress={handlenavigation}>
                        <Image
                            source={{ uri: image }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>No Image</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: "black",
        marginLeft: 4,
        marginBottom: 5,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 24,
        height: 24,
    },
    location: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    notificationButton: {
        marginLeft: 'auto',
    },
    notificationIcon: {
        width: 24,
        height: 24,
    },
    profileImage: {
        width: 50,
        height: 50,
        objectFit: "contain",
        borderRadius: 25,
        marginLeft: 16,
    },
    noImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noImageText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UserProfile;
