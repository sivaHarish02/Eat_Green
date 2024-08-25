import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';

const Myorders = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
    }, [orders]);

    useEffect(() => {
        if (userEmail) {
            const fetchOrders = async () => {
                try {
                    const response = await axios.get(`${config}/getmyOrders?email=${userEmail}`);
                    setOrders(response.data);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                    Snackbar.show({
                        text: 'Failed to fetch orders.',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: '#d9534f',
                        textColor: '#fff',
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    }, [userEmail]);

    const handleDeleteOrder = async () => {
        if (selectedOrder) {
            try {
                await axios.delete(`${config}/deleteOrder/${selectedOrder}`);
                setOrders(orders.filter(order => order._id !== selectedOrder));
                Snackbar.show({
                    text: 'Order deleted successfully.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#0fa140',
                    textColor: '#fff',
                });
            } catch (error) {
                console.error('Failed to delete order:', error);
                Snackbar.show({
                    text: 'Failed to delete the order.',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#d9534f',
                    textColor: '#fff',
                });
            } finally {
                setIsModalVisible(false);
                setSelectedOrder(null);
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(8, 154, 64)" />
                <Text style={styles.loadingText}>Loading your orders...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MY Orders</Text>
            </View>

            <ScrollView contentContainerStyle={styles.itemsContainer}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <View key={order._id} style={styles.orderContainer}>
                            <View>
                                <Text style={styles.orderDetails}>Total: Rs {order.total}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        setSelectedOrder(order._id);
                                        setIsModalVisible(true);
                                    }}
                                >
                                    <Ionicons name="trash" size={28} color="red" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.itemsGrid}>
                                {order.items.map((item) => (
                                    <View key={item.itemId._id} style={styles.itemContainer}>
                                        <Image
                                            source={{ uri: item.itemId.image }}
                                            style={styles.itemImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemName}>{item.itemId.name}</Text>
                                            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                                            <Text style={styles.itemPrice}>Price: Rs {item.itemId.price}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noOrdersText}>No orders available.</Text>
                )}
            </ScrollView>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Confirm Deletion</Text>
                    <Text style={styles.modalText}>Are you sure you want to delete this order?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleDeleteOrder}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginRight: 20,
        position: 'relative',
    },
    backButton: {
        left: 0,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
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
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#777',
    },
    itemsContainer: {
        flexDirection: 'column',
    },
    orderContainer: {
        marginBottom: 24,
        padding: 16,
        borderWidth: 2,
        borderColor: "rgb(8, 154, 64)",
        backgroundColor: '#FFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
        position: 'relative',
    },
    deleteButton: {
        position: "absolute",
        marginTop: 0,
        right: 5,
    },
    orderDetails: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: '700',
        color: 'rgb(8, 154, 64)',
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
        padding: 10,
    },
    itemImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    itemDetails: {
        marginTop: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#ff6347',
        marginTop: 4,
    },
    noOrdersText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        color:"#000",
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color:"#000",
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 16,
        marginVertical: 10,
        color:"#000",
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: 'rgb(8, 154, 64)',
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Myorders;
