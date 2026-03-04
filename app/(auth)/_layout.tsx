import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../src/constants/colors';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );

}
export const sharedStyles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    logo: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    form: {
        width: '100%',
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.secondary,
        letterSpacing: 1,
    },

    subtitle: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        marginTop: 4,
    },
    label: {
        fontSize: 14,
        color: 'white',
        marginBottom: 8,
        justifyContent: 'flex-start',
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
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    footerText: {
        color: 'white',
        fontSize: 14,
    },
    errorText: {
        color: colors.critical,
        fontSize: 12,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },

});

