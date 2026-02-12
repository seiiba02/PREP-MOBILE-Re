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
    const [formData, setFormData] = useState({
        contactNumber: '',
        otp: '',
    });
    return (
        <LinearGradient colors={['#FF4D4D', '#1B2560']} style={styles.container}>
            <SafeAreaView >
                <View style={sharedStyles.header}>
                    <View style={sharedStyles.logoContainer}>
                        <Image source={require('../../assets/images/sjlogo3.png')} style={sharedStyles.logo} />
                    </View>
                    <Text style={sharedStyles.title}>PREP</Text>
                    <Text style={sharedStyles.subtitle}>San Juan Emergency Response & Preparedness</Text>
                </View>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="phone" size={20} color={colors.textSecondary} style={sharedStyles.inputIcon} />
                    <TextInput
                        style={sharedStyles.input}
                        placeholder="09XXXXXXXXX"
                        value={formData.contactNumber}
                        onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="numeric" size={20} color={colors.textSecondary} style={sharedStyles.inputIcon} />
                    <TextInput
                        style={sharedStyles.input}
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChangeText={(text) => setFormData({ ...formData, otp: text })}
                        keyboardType="numeric"
                        maxLength={6}

                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: spacing.md,
        width: 295,
        height: 56,
        borderWidth: 1,
        borderColor: colors.border,
        margin: 'auto'
    },
    button: {
        backgroundColor: colors.primary,
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