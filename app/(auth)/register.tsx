import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { sharedStyles } from './_layout';

const BARANGAYS = [
    'Addition Hills', 'Balong-Bato', 'Batis', 'Corazon de Jesus', 'Ermitaño',
    'Greenhills', 'Isabelita', 'Kabayanan', 'Little Baguio', 'Maytunas',
    'Onse', 'Pasadena', 'Pedro Cruz', 'Progreso', 'Rivera', 'St. Joseph', 'Salapan',
    'San Perfecto', 'Sta. Lucia', 'Tibagan', 'West Crame'
];

export default function RegisterScreen() {
    const backgroundImage = require('../../assets/images/LoginReg_BG.png');
    const router = useRouter();
    const { register, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        barangay: '',
        address: '',
        zipCode: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [showBarangayPicker, setShowBarangayPicker] = useState(false);

    const handleRegister = async () => {
        const { fullName, barangay, address, password, confirmPassword } = formData;

        if (!fullName || !barangay || !address || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        try {
            await register({ fullName, barangay, address, password });
            router.replace('/(auth)/OTP');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <LinearGradient colors={['#FF4D4D', '#1B2560']}>
            <ImageBackground source={backgroundImage} style={sharedStyles.backgroundImage}>
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color={'white'} />
                            </TouchableOpacity>

                            <View style={styles.header}>
                                <Text style={sharedStyles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Register as a resident of San Juan City</Text>
                            </View>

                            <View style={styles.form}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Juan Dela Cruz"
                                        value={formData.fullName}
                                        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                                    />
                                </View>

                                <Text style={styles.label}>Barangay</Text>
                                <TouchableOpacity
                                    style={styles.inputContainer}
                                    onPress={() => setShowBarangayPicker(!showBarangayPicker)}
                                >
                                    <MaterialCommunityIcons name="map-marker" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <Text style={[styles.input, !formData.barangay && { color: '#999' }]}>
                                        {formData.barangay || 'Select your barangay'}
                                    </Text>
                                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>

                                {showBarangayPicker && (
                                    <ScrollView style={styles.pickerContainer} nestedScrollEnabled={true}>
                                        {BARANGAYS.map(b => (
                                            <TouchableOpacity
                                                key={b}
                                                style={styles.pickerItem}
                                                onPress={() => {
                                                    setFormData({ ...formData, barangay: b });
                                                    setShowBarangayPicker(false);
                                                }}
                                            >
                                                <Text style={styles.pickerItemText}>{b}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                                <Text style={styles.label}>Address</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="home" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Address"
                                        value={formData.address}
                                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    />
                                </View>

                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                                        secureTextEntry
                                    />
                                </View>

                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="lock-check" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Repeat password"
                                        value={formData.confirmPassword}
                                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                                        secureTextEntry
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={[styles.registerButton, isLoading && styles.disabledButton]}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.registerButtonText}>CONTINUE</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={sharedStyles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.loginLink}>Log In</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
    },
    backButton: {
        marginBottom: spacing.md,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    subtitle: {
        fontSize: 14,
        color: 'white',
        marginTop: 4,
    },
    form: {
        width: '100%',
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'semibold',
        color: 'white',
        justifyContent: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: spacing.md,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.textPrimary,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        maxHeight: 200,
        marginBottom: spacing.md,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pickerItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    pickerItemText: {
        fontSize: 14,
        color: colors.textPrimary,
    },
    errorText: {
        color: colors.critical,
        fontSize: 12,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: '#FF4D4D',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
