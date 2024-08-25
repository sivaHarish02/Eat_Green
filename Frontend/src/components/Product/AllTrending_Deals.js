import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import Snackbar from 'react-native-snackbar';

const AllTrendingDeals = ({ route, navigation }) => {
    const { categoryName } = route.params;
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
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
        const fetchFavorites = async () => {
            if (!userEmail) return; // Ensure userEmail is available

            try {
                const response = await axios.get(`${config}/favorites/getFavorites`, {
                    params: { email: userEmail },
                });

                const newFavorites = {};
                response.data.forEach(fav => {
                    const productId = fav.product_id?.$oid || fav.productId;
                    if (productId) {
                        newFavorites[productId] = true;
                    }
                });

                setFavorites(newFavorites);
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
            }
        };

        if (userEmail) {
            fetchFavorites();
        }
    }, [userEmail]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${config}/products?category=${categoryName}`);
                const productsData = response.data;

                setProducts(productsData);
                setQuantities(productsData.map(() => 1));
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setLoading(false); // Set loading to false even if there is an error
            }
        };

        fetchProducts();
    }, [categoryName]);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const isProductFavorite = (productId) => {
        return favorites[productId] === true;
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
                Snackbar.show({
                    text: 'Product added to cart!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#0fa140',
                    textColor: '#fff',
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Snackbar.show({
                    text: 'Product is already in the cart.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#fffe03',
                    textColor: '#000',
                });
            } else {
                console.error('Failed to add product to cart:', error);
                Snackbar.show({
                    text: 'Failed to add product to cart.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#d9534f',
                    textColor: '#fff',
                });
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

                setFavorites(newFavorites);

                Snackbar.show({
                    text: message,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#0fa140',
                    textColor: '#fff',
                });
            } else {
                Snackbar.show({
                    text: 'Failed to update favorites.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#d9534f',
                    textColor: '#fff',
                });
            }
        } catch (error) {
            console.error('Failed to update favorites:', error);
            Snackbar.show({
                text: 'Failed to update favorites.',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
                <Text style={styles.title}>{categoryName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('cartlist')}>
                    <Ionicons name="cart" size={24} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer1}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products"
                        placeholderTextColor={"#000"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons style={styles.search} name="search" size={20} color="#000" />
                </View>
                <TouchableOpacity style={styles.grid}>
                    <Ionicons name="grid" size={32} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgb(8, 154, 64)" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.productsGrid}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <View key={product._id} style={styles.productCard}>
                                {product.image ? (
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.noImage}>
                                        <Text style={styles.noImageText}>No Image</Text>
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
                                    <Ionicons
                                        name={isProductFavorite(product._id) ? "heart" : "heart-outline"}
                                        size={20}
                                        color={isProductFavorite(product._id) ? "red" : "#000"}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noProductsText}>No products found</Text>
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
        color: "black",
        fontWeight: 'bold',
    },
    searchContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: "rgb(8, 154, 64)",
        borderRadius: 25,
        flex: 1,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color:'#000',
        marginRight: 8,
        paddingHorizontal: 12,
    },
    search: {
        padding: 14,
        backgroundColor: "rgb(8, 154, 64)",
        borderRadius: 15,
        color: "white",
    },
    grid: {
        padding: 8,
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
        color: "rgb(8, 154, 64)",
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

export default AllTrendingDeals;
