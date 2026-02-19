import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../../src/constants/colors';
import { VideoResource } from '../../../src/types';
import { sharedStyles } from '../_layout';
import { useAlerts } from '../../../src/hooks/useAlerts';
import { SharedHeader } from '../../../src/components/SharedHeader';
import { getVideos, ApiVideo } from '../../../src/services/api';

const CATEGORIES = ['All', 'Earthquake', 'Fire', 'Flood', 'First Aid'];

function mapApiVideo(v: ApiVideo): VideoResource {
    return {
        id: String(v.id),
        title: v.title,
        description: v.description ?? '',
        thumbnailUrl: v.thumbnail_url ?? '',
        videoUrl: v.video_url ?? '',
        duration: v.duration_seconds ?? 0,
        category: v.category ?? 'General',
        createdAt: v.created_at ?? new Date().toISOString(),
    };
}

const MOCK_VIDEOS: VideoResource[] = [
    {
        id: '1',
        title: 'Earthquake Safety 101: Drop, Cover, Hold',
        description: 'Learn the essential steps to take when an earthquake strikes. Proper technique specifically for high-density areas in San Juan.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&q=80&w=400',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 185,
        category: 'Earthquake',
        createdAt: '2025-10-15',
    },
    {
        id: '2',
        title: 'How to use a Fire Extinguisher (PASS Method)',
        description: 'A quick guide on using fire extinguishers correctly during a fire emergency.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1599708145804-03774619965d?auto=format&fit=crop&q=80&w=400',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 120,
        category: 'Fire',
        createdAt: '2025-11-02',
    },
    {
        id: '3',
        title: 'First Aid: Basic CPR Tutorial',
        description: 'Cardiopulmonary resuscitation basics for bystanders. Hands-only CPR instructions.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 310,
        category: 'First Aid',
        createdAt: '2026-01-10',
    },
    {
        id: '4',
        title: 'Preparing an Emergency Go-Bag',
        description: 'The complete list of items you need in your disaster preparedness kit.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1629470948467-9758d57d193d?auto=format&fit=crop&q=80&w=400',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 450,
        category: 'All',
        createdAt: '2025-12-20',
    }
];

export default function TrainingScreen() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [videos, setVideos] = useState<VideoResource[]>(MOCK_VIDEOS);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { unreadCount } = useAlerts();
    const router = useRouter();

    const fetchVideos = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const apiVideos = await getVideos();
            if (apiVideos.length > 0) {
                setVideos(apiVideos.map(mapApiVideo));
            } else {
                setVideos(MOCK_VIDEOS);
            }
        } catch {
            // Keep fallback mocks visible on network error
            setVideos(MOCK_VIDEOS);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchVideos(); }, [fetchVideos]);

    const filteredVideos = selectedCategory === 'All'
        ? videos
        : videos.filter(v => v.category === selectedCategory);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (

        <View style={sharedStyles.container}>

            {/* Top Gradient Header (Shared UI) */}
            <ScrollView
                style={sharedStyles.mainContent}
                contentContainerStyle={sharedStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchVideos(true)} />
                }
            >
                <SharedHeader />
                <View style={[sharedStyles.whiteContainer]}>
                    <Text style={sharedStyles.greeting}>Hello, Sambajunnie Boi!</Text>
                    <View style={sharedStyles.separator} />

                    <Text style={sharedStyles.sectionTitle}>Training Resources</Text>

                    {/* Category Filter */}
                    <View style={styles.categoryScrollContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === cat && styles.categoryChipActive
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[
                                        styles.categoryChipText,
                                        selectedCategory === cat && styles.categoryChipTextActive
                                    ]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Video List */}
                    <View style={styles.videoList}>
                        {loading && !refreshing ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
                        ) : filteredVideos.length === 0 ? (
                            <Text style={styles.emptyText}>No videos in this category yet.</Text>
                        ) : filteredVideos.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.videoCard}
                                onPress={() => router.push({
                                    pathname: '/(tabs)/training/[videoId]',
                                    params: { videoId: item.id },
                                })}
                            >
                                <View style={styles.thumbnailContainer}>
                                    <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
                                    </View>
                                    <View style={styles.playOverlay}>
                                        <MaterialCommunityIcons name="play-circle" size={48} color="white" opacity={0.8} />
                                    </View>
                                </View>
                                <View style={styles.videoInfo}>
                                    <View style={styles.categoryRow}>
                                        <Text style={styles.videoCategory}>{item.category}</Text>
                                        <Text style={styles.videoDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.videoDesc} numberOfLines={2}>{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryScrollContainer: {
        marginBottom: spacing.md,
    },
    categoryList: {
        gap: 8,
        paddingBottom: 4,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryChipActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    categoryChipTextActive: {
        color: 'white',
    },
    videoList: {
        marginTop: spacing.sm,
    },
    videoCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    thumbnailContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 1,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    videoInfo: {
        padding: spacing.md,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    videoCategory: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
    },
    videoDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 6,
    },
    videoDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 14,
        marginTop: spacing.lg,
    },
});
