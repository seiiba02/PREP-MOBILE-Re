import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

interface SOSButtonProps {
    onPress: () => void;
}

export const SOSButton = ({ onPress }: SOSButtonProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.text}>SOS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF4D4D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF4D4D',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
