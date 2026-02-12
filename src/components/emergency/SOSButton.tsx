import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

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
        marginVertical: 16,
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    text: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
