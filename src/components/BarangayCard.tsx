import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BarangayCardProps {
    name: string;
    logo?: any;
    onPress?: () => void;
}

export const BarangayCard = ({ name, logo, onPress }: BarangayCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={['#EF4444', '#1B2560']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.4 }}
                style={styles.gradient}
            >
                <Text style={styles.barangayName}>{name.toUpperCase()}</Text>

                <View style={styles.sealContainer}>
                    <Image
                        source={logo || require('../../assets/images/sjlogo1.png')}
                        style={styles.sealImage}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
    },
    barangayName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
        flex: 1,
        marginRight: 10,
    },
    sealContainer: {
        height: '100%',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    sealImage: {
        width: 100,
        height: 100,
        position: 'absolute',
        right: -20,
        opacity: 0.5,
        transform: [{ scale: 1.2 }],
    },
});
