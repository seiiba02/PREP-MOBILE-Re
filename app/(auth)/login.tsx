import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { sharedStyles } from './_layout';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const backgroundImage = require('../../assets/images/LoginReg_BG.png');

    const handleLogin = async () => {
        if (!contactNumber || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        try {
            await login(contactNumber, password);
            router.replace('/(tabs)');
        } catch (err) {
            setError('Invalid contact number or password');
        }
    };

    return (
        <LinearGradient colors={['#FF4D4D', '#1B2560']} style={styles.container}>
            <ImageBackground source={backgroundImage} style={sharedStyles.backgroundImage}>
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={sharedStyles.header}>
                                <View style={sharedStyles.logoContainer}>
                                    <Image source={require('../../assets/images/sjlogo3.png')} style={sharedStyles.logo} />
                                </View>
                                <Text style={sharedStyles.title}>PREP</Text>
                                <Text style={sharedStyles.subtitle}>San Juan Emergency Response & Preparedness</Text>
                            </View>

                            <View style={sharedStyles.form}>
                                <Text style={sharedStyles.label}>Contact Number</Text>
                                <View style={sharedStyles.inputContainer}>
                                    <MaterialCommunityIcons name="phone" size={20} color={colors.textSecondary} style={sharedStyles.inputIcon} />
                                    <TextInput
                                        style={sharedStyles.input}
                                        placeholder="09XXXXXXXXX"
                                        value={contactNumber}
                                        onChangeText={setContactNumber}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <Text style={sharedStyles.label}>Password</Text>
                                <View style={sharedStyles.inputContainer}>
                                    <MaterialCommunityIcons name="lock" size={20} color={colors.textSecondary} style={sharedStyles.inputIcon} />
                                    <TextInput
                                        style={sharedStyles.input}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <MaterialCommunityIcons
                                            name={showPassword ? "eye" : "eye-off"}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.loginButton, isLoading && sharedStyles.disabledButton]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>LOG IN</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={sharedStyles.footer}>
                                    <Text style={sharedStyles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                        <Text style={styles.registerLink}>Register Now</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.lineDivider}>
                                    <View style={styles.line} />
                                    <Text style={styles.lineText}>OR</Text>
                                    <View style={styles.line} />
                                </View>

                                <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/(tabs)')}>
                                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
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
    },
    scrollContent: {
        padding: spacing.xl,
    },
    errorText: {
        color: colors.critical,
        fontSize: 12,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    forgotPassword: {
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: colors.secondary,
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
        margin: 'auto'
    },
    guestButton: {
        backgroundColor: '#FF4D4D',
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
        margin: 'auto'
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    guestButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    registerLink: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    emergencyNote: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing.xxl,
        fontStyle: 'italic',
    },
    lineDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    lineText: {
        color: 'white',
        marginHorizontal: spacing.sm,
    },
});
