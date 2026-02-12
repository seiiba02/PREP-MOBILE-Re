import { Stack } from 'expo-router';

export default function ContactsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="district-1" />
            <Stack.Screen name="district-2" />
            <Stack.Screen name="[id]" options={{ presentation: 'card' }} />
        </Stack>
    );
}
