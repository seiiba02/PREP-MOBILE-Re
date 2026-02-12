import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { sharedStyles } from './_layout';

export default function residentQ() {
    const router = useRouter();
    const backgroundImage = require('../../assets/images/LoginReg_BG.png');
    return (
        <LinearGradient colors={['#FF4D4D', '#1B2560']} style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={sharedStyles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/images/sjlogo3.png')} style={styles.logo} />
                    </View>
                    <Text style={sharedStyles.title}>PREP</Text>
                    <Text style={sharedStyles.subtitle}>San Juan Emergency Response & Preparedness</Text>
                </View>
                <Text style={styles.questionText}>Are you a resident of San Juan City?</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1B2560',
        width: 295,
        height: 56,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        margin: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'semibold',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: spacing.md,
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    logo: {
        width: 100,
        height: 100,
    },
})