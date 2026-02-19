import { Platform } from 'react-native';

// Safe lazy accessors — these modules crash in Expo Go
function getNotifications() {
    try {
        return require('expo-notifications') as typeof import('expo-notifications');
    } catch {
        return null;
    }
}

function getDevice() {
    try {
        return require('expo-device') as typeof import('expo-device');
    } catch {
        return null;
    }
}

function getConstants() {
    try {
        return require('expo-constants').default;
    } catch {
        return null;
    }
}

export async function registerForPushNotificationsAsync() {
    const Notifications = getNotifications();
    const Device = getDevice();
    const Constants = getConstants();

    if (!Notifications || !Device) {
        console.log('Notifications not available in this environment');
        return undefined;
    }

    let token: string | undefined;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (e) {
            console.warn('Error getting push token', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function sendLocalNotification(title: string, body: string, data = {}) {
    const Notifications = getNotifications();
    if (!Notifications) {
        console.log('Cannot send notification — module not available');
        return;
    }
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
        },
        trigger: null, // immediate
    });
}
