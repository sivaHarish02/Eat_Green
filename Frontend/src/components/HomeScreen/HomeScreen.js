import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserProfile from './UserInfo';
import SearchBar from './SearchBar';
import BannersCarousel from './BannerCarousel';
import Categories from './CategoryList';
import TrendingDeals from './TrendingDeals';
import BottomIconsView from './BottomIconsView';

const HomeScreen = () => {
    const [userData, setUserData] = useState({ name: '', location: '', image: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Sample categories data
    const categories = [
        { name: 'Vegetables', image: require('../../assets/vegetables.jpg') },
        { name: 'Spinach', image: require('../../assets/spinach.webp') },
        { name: 'Grains', image: require('../../assets/grains.jpg') },
        { name: 'Masala', image: require('../../assets/masala.jpg') },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    setUserData(parsedData);
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array

    useEffect(() => {
        // Filter categories based on searchQuery
        setFilteredCategories(
            categories.filter(category =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <UserProfile />
                <SearchBar onSearch={(query) => setSearchQuery(query)} />
                <BannersCarousel />
                <Categories categories={filteredCategories} />
                <TrendingDeals />
            </ScrollView>
            <BottomIconsView />
        </View>
    );
};

export default HomeScreen;
