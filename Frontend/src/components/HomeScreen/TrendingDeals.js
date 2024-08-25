import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import config from '../../config'; // Ensure you have this dependency

const TrendingDeals = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config}/products?category=TrendingDeals`);
                const productsData = response.data;

                setProducts(productsData);
                setQuantities(productsData.map(() => 1));
                setFavorites(productsData.reduce((acc, product) => {
                    acc[product._id] = false;
                    return acc;
                }, {}));
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();

        // Get the user email from AsyncStorage
        const fetchUserEmail = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setUserEmail(parsedData.email);
                }
            } catch (error) {
                console.error('Failed to load user email:', error);
            }
        };

        fetchUserEmail();
    }, []);

    useEffect(() => {
        // Filter products based on the search query
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const showSnackbar = (message, type = 'info') => {
        let backgroundColor;

        switch (type) {
            case 'success':
                backgroundColor = 'green';
                break;
            case 'error':
                backgroundColor = 'red';
                break;
            case 'info':
            default:
                backgroundColor = '#fffe03';
                textColor = '#000';
                break;
        }

        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor,
            textColor
        });
    };

    const handleIncrement = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
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
                showSnackbar('Product added to cart!', 'success');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showSnackbar('Product is already in the cart.', 'info');
            } else {
                console.error('Failed to add product to cart:', error);
                showSnackbar('Failed to add product to cart.', 'error');
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
                setFavorites(newFavorites);
                showSnackbar(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
            } else {
                showSnackbar('Failed to update favorites.', 'error');
            }
        } catch (error) {
            console.error('Failed to update favorites:', error);
            showSnackbar('Failed to update favorites.', 'error');
        }
    };

    const handleNavigateToAllTrendingDeals = () => {
        navigation.navigate('ProductList', { categoryName: 'TrendingDeals' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Trending Deals</Text>
                <TouchableOpacity onPress={handleNavigateToAllTrendingDeals}>
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.productsGrid}>
                {filteredProducts.map((product, index) => (
                    <View key={product._id} style={styles.productCard}>
                        {product.image ? (
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={{
                                width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{ color: '#fff', fontSize: 16, }}>No Image</Text>
                            </View>
                        )}
                        <View style={styles.productDetail}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>Rs {product.price}</Text>
                        </View>

                        <View style={styles.productDetails}>
                            <Text style={styles.productWeight}>{product.weight}</Text>
                            <Text style={styles.productRating}>⭐ {product.rating}</Text>
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
                            <Text style={styles.quantityText}>{quantities[index]}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => handleAddToCart(product._id, quantities[index])}
                        >
                            <Ionicons name="cart" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.wishlistButton}
                            onPress={() => handleToggleFavorite(product._id)}
                        >
                            <Ionicons name={favorites[product._id] ? "heart" : "heart-outline"} size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
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
        color: '#000'
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
});

export default TrendingDeals;
