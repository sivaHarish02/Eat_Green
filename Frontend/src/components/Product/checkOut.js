import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import config from '../../config';

const CheckoutScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhoneNo, setUserPhoneNo] = useState('');
    const [userLocation, setUserLocation] = useState('');

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const email = parsedData.email;
                    const name = parsedData.name;
                    const phoneNo = parsedData.phoneNo;
                    const location = parsedData.location;

                    setUserEmail(email);
                    setUserName(name);
                    setUserPhoneNo(phoneNo);
                    setUserLocation(location);

                    fetchCartItems(email);
                } else {
                    console.error('No user data found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching user data from AsyncStorage:', error);
            }
        };

        const fetchCartItems = async (email) => {
            try {
                const response = await fetch(`${config}/getcart?email=${email}`);
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        getUserDetails();
    }, []);

    const subTotal = cartItems.reduce((total, item) => total + (item.productDetails.price * item.quantity), 0);
    const shippingCost = 30;
    const tax = (subTotal * 0.05).toFixed(2);
    const total = (parseFloat(subTotal) + shippingCost + parseFloat(tax)).toFixed(2);

    const handleProceed = async () => {
        const orderDetails = {
            email: userEmail,
            name: userName,
            phoneNo: userPhoneNo,
            location: userLocation,
            items: cartItems.map(item => ({
                itemId: item.productDetails?._id, // Check if item.productDetails exists and has _id
                quantity: item.quantity,
            })).filter(item => item.itemId), // Filter out items with missing itemId
            shippingCost: shippingCost,
            tax: tax,
            total: total
        };

        try {
            const response = await fetch(`${config}/PlaceOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            const result = await response.json();

            if (response.ok) {
                Snackbar.show({
                    text: 'Your order has been placed successfully!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green',
                    action: {
                        text: 'OK',
                        textColor: 'white',
                        onPress: () => Snackbar.dismiss(),
                    }
                });
                navigation.navigate('OrderSuccessScreen');
            } else {
                Snackbar.show({
                    text: result.message || 'Something went wrong!',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    action: {
                        text: 'OK',
                        textColor: 'white',
                        onPress: () => Snackbar.dismiss(),
                    }
                });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            Snackbar.show({
                text: 'Failed to place order, please try again.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                action: {
                    text: 'OK',
                    textColor: 'white',
                    onPress: () => Snackbar.dismiss(),
                }
            });
        }
    };

    const renderCartItem = ({ item, index }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemIndex}>{index + 1}</Text>
            <Image source={{ uri: item.productDetails.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <View style={styles.itemnameWeight}>
                    <Text style={styles.itemName}>{item.productDetails.name}</Text>
                    <Text style={styles.itemWeight}>{item.productDetails.weight}</Text>
                </View>
                <Text style={styles.itemQuantity}>{item.quantity} × ₹{item.productDetails.price}</Text>
            </View>
            <Text style={styles.itemPrice}>Rs {item.productDetails.price * item.quantity}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    onPress={() => navigation.goBack()}
                    size={24}
                    color='rgb(8, 154, 64)'
                    style={styles.backIcon}
                />
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.cartList}
            />
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Sub Total :</Text>
                    <Text style={styles.summaryText1}>₹ {subTotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Shipping Cost :</Text>
                    <Text style={styles.summaryText1}>₹ {shippingCost}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Estimating Tax :</Text>
                    <Text style={styles.summaryText1}>₹ {tax}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Total :</Text>
                    <Text style={styles.totalText}>₹ {total}</Text>
                </View>
                <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 20,
        paddingHorizontal: 16,
    },
    backIcon: {
        // marginRight: 16,
    },
    headerTitle: {
        flex: 1,
        justifyContent: "flex-start",
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        color: "#000"
    },
    cartList: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: "rgb(246,255,250)",
        borderRadius: 8,
    },
    itemIndex: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 16,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 16,

    },
    itemDetails: {
        flex: 1,
    },
    itemnameWeight: {
        flexDirection: "row",


    },

    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
    },
    itemWeight: {
        marginLeft: 10,
        fontSize: 14,
        color: '#000',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
    },
    summary: {
        backgroundColor: "rgb(246,255,250)",
        padding: 16,
        borderWidth: 2,
        marginTop: 16,
        borderRadius: 30,
        marginHorizontal: 2,
        borderColor: 'rgb(8, 154, 64)',
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,

    },
    summaryText1: {
        fontSize: 16,
        color: 'rgb(8, 154, 64)',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
    },
    proceedButton: {
        backgroundColor: 'rgb(8, 154, 64)',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 16,
        marginHorizontal: 0,
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
export default CheckoutScreen;