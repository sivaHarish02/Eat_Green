import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Categories = ({ categories }) => {
    const navigation = useNavigation();

    const handleCategoryPress = (categoryName) => {
        navigation.navigate('ProductList', { categoryName });
    };

    return (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: 'black' }}>
                Explore By Categories
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ alignItems: 'center', marginBottom: 16 }}
                        onPress={() => handleCategoryPress(category.name)}
                    >
                        <Image
                            source={category.image}
                            style={{ width: 80, height: 80, borderRadius: 8 }}
                        />
                        <Text style={{ marginTop: 4, color: 'black' }}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default Categories;
