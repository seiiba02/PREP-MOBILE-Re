import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { sharedStyles } from './_layout';
import { SharedHeader } from '../../src/components/SharedHeader';
import { router } from 'expo-router';
import { colors } from '../../src/constants/colors';
import { MapWrapper, isDevBuild } from '../../src/components/map/MapWrapper';


const MapPreviewCard = isDevBuild
    ? require('../../src/components/map/MapPreviewCard').MapPreviewCard
    : () => null;

export default function HomeScreen() {
    return (

        <View style={sharedStyles.container}>
            <SharedHeader />

            {/* Main Content Area */}
            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <SharedHeader />
                <View style={[sharedStyles.whiteContainer]}><Text style={sharedStyles.sectionTitle}>Dashboard</Text>
                    <Text style={sharedStyles.greeting}>Hello, SambajunnieBoi!</Text>
                    <View style={sharedStyles.separator} />
                    <Text style={sharedStyles.sectionTitle}>Dashboard</Text>

                    {/* Nearest Evacuation Area Card */}
                    <View style={styles.evacuationCard}>
                        <View style={styles.evacIconBg}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#818CF8" />
                        </View>
                        <View style={styles.evacInfo}>
                            <View>
                                <Text style={styles.evacLabel}>Nearest</Text>
                                <Text style={styles.evacTitle}>Evacuation Area</Text>
                            </View>
                            <View style={styles.evacDetails}>
                                <Text style={styles.evacLabel}>Distance</Text>
                                <Text style={styles.evacAddress}>Address Name</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.navigationBtn}>
                            <Ionicons name="send" size={20} color="#FF4D4D" />
                        </TouchableOpacity>
                    </View>


                    {/* Map Preview Card — live MapLibre map or placeholder */}
                    <View style={styles.mapCard}>
                        <MapWrapper
                            fallbackTitle="San Juan City Map"
                            fallbackHeight={220}
                            onPlaceholderPress={() => router.push('/map' as any)}
                        >
                            <MapPreviewCard
                                onPress={() => router.push('/map' as any)}
                            />
                        </MapWrapper>
                    </View>

                    {/* Weather Card */}
                    <View style={styles.weatherCardWrapper}>
                        <ImageBackground
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Pinaglabanan_Shrine_%28San_Juan%3B_2010-08-30%29_01.jpg' }}
                            style={styles.weatherBg}
                            imageStyle={{ borderRadius: 20 }}
                        >
                            <LinearGradient
                                colors={['rgba(255, 77, 77, 0.7)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0.6, y: 0 }}
                                style={styles.weatherGradient}
                            >
                                <View style={styles.weatherTop}>
                                    <Text style={styles.weatherLabel}>Temperature</Text>
                                    <Text style={styles.tempText}>32°C</Text>
                                </View>

                                <View style={styles.weatherMetrics}>
                                    <View style={styles.metricItem}>
                                        <Ionicons name="water" size={14} color="white" />
                                        <Text style={styles.metricText}>43%</Text>
                                    </View>
                                    <View style={styles.metricItem}>
                                        <MaterialCommunityIcons name="weather-windy" size={14} color="white" />
                                        <Text style={styles.metricText}>0.6 km/h NW</Text>
                                    </View>
                                    <View style={styles.metricItem}>
                                        <Ionicons name="eye" size={14} color="white" />
                                        <Text style={styles.metricText}>1.2 km</Text>
                                    </View>
                                </View>

                                <View style={styles.weatherBottom}>
                                    <Text style={styles.locationName}>Pinagsama</Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    evacuationCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    evacIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    evacInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    evacLabel: {
        fontSize: 10,
        color: '#64748B',
    },
    evacTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    evacDetails: {
        alignItems: 'flex-start',
    },
    evacAddress: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    navigationBtn: {
        padding: 8,
    },
    mapCard: {
        width: '100%',
        marginBottom: 24,
    },
    weatherCardWrapper: {
        height: 180,
        width: '100%',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    weatherBg: {
        width: '100%',
        height: '100%',
    },
    weatherGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
    },
    weatherTop: {

    },
    weatherLabel: {
        color: 'white',
        fontSize: 12,
        opacity: 0.9,
    },
    tempText: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        marginTop: -4,
    },
    weatherMetrics: {
        gap: 4,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '500',
    },
    weatherBottom: {
        alignItems: 'flex-end',
    },
    locationName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
