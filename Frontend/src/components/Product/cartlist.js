import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                setLoading(true);
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    const email = parsedData.email;
                    setUserEmail(email);
                    fetchCartItems(email);
                } else {
                    console.error('No email found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching email from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCartItems = async (email) => {
            try {
                const response = await fetch(`${config}/getcart?email=${email}`);
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        getUserEmail();
    }, []);

    const updateQuantityInDatabase = async (id, quantity) => {
        try {
            setLoading(true);
            const response = await fetch(`${config}/updatecart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id, quantity }),
            });
            if (!response.ok) {
                throw new Error('Failed to update quantity in the database');
            }
        } catch (error) {
            console.error('Error updating quantity in database:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteItemFromDatabase = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`${config}/deletecart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: id }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete item from the database');
            }
        } catch (error) {
            console.error('Error deleting item from database:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity += 1;
        setCartItems(updatedCartItems);
        updateQuantityInDatabase(updatedCartItems[index]._id, updatedCartItems[index].quantity);
    };

    const handleDecrement = (index) => {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[index].quantity > 1) {
            updatedCartItems[index].quantity -= 1;
            setCartItems(updatedCartItems);
            updateQuantityInDatabase(updatedCartItems[index]._id, updatedCartItems[index].quantity);
        }
    };

    const handleSelect = (index) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(item => item !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleDelete = () => {
        if (selectedItems.length > 0) {
            setIsModalVisible(true);
        } else {
            Snackbar.show({
                text: 'No items selected. Please click on items to select them for deletion.',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#fffe03',
                textColor: '#000',
            });
        }
    };

    const confirmDelete = () => {
        const updatedCartItems = [...cartItems];
        const itemsToDelete = selectedItems.map(index => updatedCartItems[index]._id);

        const remainingItems = updatedCartItems.filter((_, index) => !selectedItems.includes(index));
        setCartItems(remainingItems);

        itemsToDelete.forEach(id => deleteItemFromDatabase(id));

        setSelectedItems([]);
        setIsModalVisible(false);

        Snackbar.show({
            text: 'Items deleted successfully',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#0fa140',
            textColor: '#fff',
        });
    };

    const renderCartItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => handleSelect(index)}
            style={[
                styles.cartItem,
                selectedItems.includes(index) && styles.selectedItem
            ]}
        >
            <Text style={styles.itemIndex}>{index + 1}</Text>
            <Image source={{ uri: item.productDetails.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.productDetails.name}</Text>
                <Text style={styles.itemWeight}>{item.productDetails.weight}</Text>
                <Text style={styles.viewDetails}>view product details</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => handleDecrement(index)}>
                        <Ionicons name="remove-outline" size={20} color="rgb(8, 154, 64)" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => handleIncrement(index)}>
                        <Ionicons name="add-outline" size={20} color="rgb(8, 154, 64)" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.itemPrice}>Rs {item.productDetails.price * item.quantity}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={24} color="rgb(8, 154, 64)" />
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="rgb(8, 154, 64)" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="rgb(8, 154, 64)" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={styles.cartList}
                />
            )}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText1}>Continue Shopping</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate('Checkout')}
                >
                    <Text style={styles.buttonText}>Checkout</Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={isModalVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={350}
                animationOutTiming={400}
                backdropTransitionInTiming={350}
                backdropTransitionOutTiming={400}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                onBackdropPress={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to delete the selected items?</Text>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                            <Text style={styles.modalButtonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000",
    },
    cartList: {
        paddingBottom: 20,
    },

    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
        elevation: 5,
    },
    selectedItem: {
        borderColor: 'rgb(8, 154, 64)',
        borderWidth: 2,
    },
    itemIndex: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: "#000",
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,

    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#000",
    },
    itemWeight: {
        fontSize: 14,
        color: '#555',
        color: "#000",
    },
    viewDetails: {
        fontSize: 12,
        color: 'rgb(8, 154, 64)',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'rgb(8, 154, 64)',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(8, 154, 64)',
    },
    footer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    continueButton: {
        marginRight: 5,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgb(8, 154, 64)',
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    checkoutButton: {
        paddingVertical: 12,
        backgroundColor: 'rgb(8, 154, 64)',
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText1: {
        color: 'rgb(8, 154, 64)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgb(8, 154, 64)',
        width: '48%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;
