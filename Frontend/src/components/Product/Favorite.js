import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState({});
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const email = parsedData.email;
                    setUserEmail(email);
                    fetchFavoriteItems(email);
                } else {
                    console.error('No email found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching email from AsyncStorage:', error);
            }
        };

        const fetchFavoriteItems = async (email) => {
            try {
                const response = await fetch(`${config}/favorites/getFavorites?email=${email}`);
                const data = await response.json();
                setFavorites(data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching favorite items:', error);
                setLoading(false); // Set loading to false even if there is an error
            }
        };

        getUserEmail();
    }, []);

    useEffect(() => {
        // Filter favorites based on the search query
        const filtered = Object.values(favorites).filter(item =>
            item.productDetails && item.productDetails.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFavorites(filtered);
    }, [searchQuery, favorites]);

    const handleIncrement = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] = (newQuantities[index] || 1) + 1;
        setQuantities(newQuantities);
    };

    const handleDecrement = (index) => {
        const newQuantities = [...quantities];
        if (newQuantities[index] > 1) {
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            const response = await axios.post(`${config}/addcart`, {
                productId,
                quantity,
                email: userEmail,
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Product added to cart!');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Alert.alert('Info', 'Product is already in the cart.');
            } else {
                console.error('Failed to add product to cart:', error);
                Alert.alert('Error', 'Failed to add product to cart.');
            }
        }
    };

    const handleToggleFavorite = async (productId) => {
        const isFavorite = favorites[productId];
        const newFavorites = { ...favorites, [productId]: !isFavorite };

        try {
            const response = await axios.post(`${config}/favorites/addFavorites`, {
                productId,
                email: userEmail,
                isFavorite,
            });

            if (response.status === 200) {
                const message = response.data.message;

                // Update favorites state only if the product was successfully added or removed
                setFavorites(newFavorites);

                // Show appropriate alert based on the server response
                if (message === 'Added to favorites') {
                    Alert.alert('Success', 'Added to favorites');
                } else if (message === 'Removed from favorites') {
                    Alert.alert('Success', 'Removed from favorites');
                } else if (message === 'Product is already in favorites') {
                    Alert.alert('Info', 'Product is already in favorites');
                } else {
                    Alert.alert('Error', 'Failed to update favorites.');
                }
            } else {
                Alert.alert('Error', 'Failed to update favorites.');
            }
        } catch (error) {
            console.error('Failed to update favorites:', error);
            Alert.alert('Error', 'Failed to update favorites.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
                <Text style={styles.title}>MY Favorites</Text>
                <TouchableOpacity onPress={() => navigation.navigate("cartlist")}>
                    <Ionicons name="cart" size={24} color='rgb(8, 154, 64)' />
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgb(8, 154, 64)" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.productsGrid}>
                    {filteredFavorites.length > 0 ? (
                        filteredFavorites.map((item, index) => (
                            <View key={`${item.productDetails._id}-${index}`} style={styles.productCard}>
                                {item.productDetails && item.productDetails.image ? (
                                    <Image
                                        source={{ uri: item.productDetails.image }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.noImage}>
                                        <Text style={styles.noImageText}>No Image</Text>
                                    </View>
                                )}
                                <View style={styles.productDetail}>
                                    <Text style={styles.productName}>{item.productDetails ? item.productDetails.name : 'Product Name'}</Text>
                                    <Text style={styles.productPrice}>Rs {item.productDetails ? item.productDetails.price : '0'}</Text>
                                </View>

                                <View style={styles.productDetails}>
                                    <Text style={styles.productWeight}>{item.productDetails ? item.productDetails.weight : '0g'}</Text>
                                    <Text style={styles.productRating}>⭐ {item.productDetails ? item.productDetails.rating : '0'}</Text>
                                </View>

                                {/* Quantity Control */}
                                <View style={styles.quantityControl}>
                                    <Text style={styles.quantityText}>Quantity</Text>
                                    <View style={styles.quantityIcon}>
                                        <TouchableOpacity onPress={() => handleIncrement(index)}>
                                            <Ionicons name="chevron-up" size={17} color="rgb(8, 154, 64)" />
                                        </TouchableOpacity>
                                        <Ionicons name="remove-outline" size={14} color="rgb(8, 154, 64)" />
                                        <TouchableOpacity onPress={() => handleDecrement(index)}>
                                            <Ionicons name="chevron-down" size={17} color="rgb(8, 154, 64)" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.quantityText}>{quantities[index] || 1}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.cartButton}
                                    onPress={() => handleAddToCart(item.productDetails._id, quantities[index] || 1)}
                                >
                                    <Ionicons name="cart" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.wishlistButton}
                                    onPress={() => handleToggleFavorite(item.productDetails._id)}
                                >
                                    <Ionicons name={favorites[item.productDetails._id] ? "heart" : "heart-outline"} size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noFavoritesText}>No favorites available.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: "rgb(8, 154, 64)",
        borderRadius: 25,
        padding: 0,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginRight: 8,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        height: 280,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 130,
        resizeMode: 'contain',
        objectFit: "contain",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgb(8, 154, 64)",
        borderRadius: 20,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
        marginBottom: 0,
    },
    productWeight: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    productDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productDetails: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: "rgb(8, 154, 64)",
    },
    productRating: {
        fontSize: 14,
        marginLeft: 10,
        color: '#000',
    },
    quantityControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginEnd: 10,
        marginVertical: 2,
    },
    quantityIcon: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    quantityText: {
        marginHorizontal: 2,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cartButton: {
        position: 'absolute',
        bottom: 20,
        right: 16,
        backgroundColor: '#28a745',
        borderRadius: 50,
        padding: 6,
    },
    wishlistButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
    },
    noFavoritesText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        marginTop: 20,
    },
});

export default FavoritesScreen;
