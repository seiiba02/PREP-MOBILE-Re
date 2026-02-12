import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { sharedStyles } from '../_layout';
import { SharedHeader } from '../../../src/components/SharedHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { SOSButton } from '../../../src/components/SOSButton';
import { SOSModal } from '../../../src/components/SOSModal';

const { width } = Dimensions.get('window');

export default function ContactDirectoryScreen() {
    const router = useRouter();
    const [sosModalVisible, setSosModalVisible] = useState(false);

    const DistrictCard = ({ title, imageSource, onPress }: { title: string, imageSource: any, onPress: () => void }) => (
        <TouchableOpacity style={styles.districtCard} onPress={onPress}>
            <ImageBackground
                source={imageSource}
                style={styles.cardBg}
                imageStyle={{ borderRadius: 20 }}
            >
                <LinearGradient
                    colors={['#F54B4E', '#1B2560']}
                    style={styles.cardGradient}
                >
                </LinearGradient>
            </ImageBackground>
            <Text style={styles.districtTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={sharedStyles.container}>
            <SharedHeader />

            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}

            >
                <SharedHeader />

                <View style={sharedStyles.whiteContainer} pointerEvents='box-none'>

                    <Text style={sharedStyles.greeting}>Hello, {'Sambajunnie Boi'}!</Text>
                    <View style={sharedStyles.separator} />

                    <Text style={sharedStyles.sectionTitle}>Contact Directory</Text>

                    <DistrictCard
                        title="San Juan District 1"
                        imageSource={require('../../../assets/images/district/Dist1.jpg')}
                        onPress={() => router.push('/contacts/district-1' as any)}
                    />

                    <DistrictCard
                        title="San Juan District 2"
                        imageSource={require('../../../assets/images/district/Dist2.jpg')}
                        onPress={() => router.push('/contacts/district-2' as any)}
                    />

                    {/* SOS Button */}
                    <SOSButton onPress={() => setSosModalVisible(true)} />
                </View>
            </ScrollView>

            {/* SOS Modal */}
            <SOSModal
                visible={sosModalVisible}
                onClose={() => setSosModalVisible(false)}
            />
        </View>
    );
}



const styles = StyleSheet.create({
    districtCard: {
        height: 160,
        width: '100%',
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,

    },
    cardBg: {
        width: '100%',
        height: '100%',

    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'flex-end',
        opacity: 0.6,
    },
    districtTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
});
