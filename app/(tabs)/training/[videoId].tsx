import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../../src/constants/colors';
import { VideoResource } from '../../../src/types';
import { getVideos, ApiVideo } from '../../../src/services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

/**
 * Format seconds into mm:ss display string.
 */
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get a category icon name for display.
 */
function getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
        case 'earthquake': return 'earth';
        case 'fire': return 'fire';
        case 'flood': return 'waves';
        case 'first aid': return 'medical-bag';
        default: return 'book-open-variant';
    }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function VideoPlayerScreen() {
    const { videoId } = useLocalSearchParams<{ videoId: string }>();
    const router = useRouter();
    const videoRef = useRef<Video>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [video, setVideo] = useState<VideoResource | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<VideoResource[]>([]);
    const [resolving, setResolving] = useState(true);

    // Resolve the video by fetching from the API.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // Fetch all and filter to efficiently get both current and related.
                const apiVideos = await getVideos();
                if (cancelled) return;

                const resources = apiVideos.map(mapApiVideo);
                const current = resources.find((v) => v.id === videoId);

                if (current) {
                    setVideo(current);
                    setRelatedVideos(resources.filter((v) => v.id !== videoId));
                } else {
                    setVideo(null);
                    setRelatedVideos([]);
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
                if (!cancelled) setVideo(null);
            } finally {
                if (!cancelled) setResolving(false);
            }
        })();
        return () => { cancelled = true; };
    }, [videoId]);

    /** Handle playback status updates from expo-av. */
    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsLoading(false);
            setIsError(false);
        }
    }, []);

    /** Handle load errors. */
    const onError = useCallback((error: string) => {
        console.warn('Video playback error:', error);
        setIsLoading(false);
        setIsError(true);
    }, []);

    if (resolving) {
        return (
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!video) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#94A3B8" />
                <Text style={styles.errorText}>Video not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* ── Video Player ────────────────────────────────── */}
            <View style={styles.playerWrapper}>
                {/* Back button overlay */}
                <TouchableOpacity
                    style={styles.overlayBackButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                {/* Loading indicator */}
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.loadingText}>Loading video...</Text>
                    </View>
                )}

                {/* Error state */}
                {isError && (
                    <View style={styles.loadingOverlay}>
                        <MaterialCommunityIcons name="video-off-outline" size={48} color="#94A3B8" />
                        <Text style={styles.loadingText}>Unable to load video</Text>
                    </View>
                )}

                <Video
                    ref={videoRef}
                    source={{ uri: video.videoUrl }}
                    style={styles.videoPlayer}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    onError={onError}
                    posterSource={{ uri: video.thumbnailUrl }}
                    usePoster
                    posterStyle={styles.poster}
                />
            </View>

            {/* ── Video Details ───────────────────────────────── */}
            <ScrollView
                style={styles.detailsScroll}
                contentContainerStyle={styles.detailsContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>{video.title}</Text>

                {/* Meta row */}
                <View style={styles.metaRow}>
                    <View style={styles.categoryBadge}>
                        <MaterialCommunityIcons
                            name={getCategoryIcon(video.category) as any}
                            size={14}
                            color={colors.primary}
                        />
                        <Text style={styles.categoryText}>{video.category}</Text>
                    </View>

                    <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color="#94A3B8" />
                        <Text style={styles.metaText}>{formatDuration(video.duration)}</Text>
                    </View>

                    <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="calendar-outline" size={14} color="#94A3B8" />
                        <Text style={styles.metaText}>
                            {new Date(video.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Description */}
                <Text style={styles.sectionLabel}>About this video</Text>
                <Text style={styles.description}>{video.description}</Text>

                {/* Related Videos */}
                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>More Training Videos</Text>

                {relatedVideos.map((related) => (
                    <TouchableOpacity
                        key={related.id}
                        style={styles.relatedCard}
                        onPress={() => router.replace({
                            pathname: '/(tabs)/training/[videoId]',
                            params: { videoId: related.id },
                        })}
                    >
                        <View style={styles.relatedThumbnail}>
                            {related.thumbnailUrl ? (
                                <Image source={{ uri: related.thumbnailUrl }} style={styles.relatedImage} />
                            ) : (
                                <MaterialCommunityIcons name="play-circle" size={28} color="white" />
                            )}
                        </View>
                        <View style={styles.relatedInfo}>
                            <Text style={styles.relatedTitle} numberOfLines={2}>
                                {related.title}
                            </Text>
                            <Text style={styles.relatedMeta}>
                                {related.category}  •  {formatDuration(related.duration)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Bottom spacing for safe area */}
                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </View>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },

    // Video player
    playerWrapper: {
        width: SCREEN_WIDTH,
        height: VIDEO_HEIGHT,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    poster: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlayBackButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 16,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 5,
    },
    loadingText: {
        color: 'white',
        fontSize: 13,
        marginTop: 8,
    },

    // Details
    detailsScroll: {
        flex: 1,
    },
    detailsContainer: {
        padding: spacing.lg,
        paddingBottom: 120,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 28,
        marginBottom: spacing.md,
    },

    // Meta
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF1F1',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        textTransform: 'uppercase',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#94A3B8',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: spacing.lg,
    },

    // Description
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
    },

    // Related videos
    relatedCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    relatedThumbnail: {
        width: 90,
        height: 64,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    relatedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    relatedInfo: {
        flex: 1,
        padding: spacing.sm,
        justifyContent: 'center',
    },
    relatedTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2,
    },
    relatedMeta: {
        fontSize: 11,
        color: '#94A3B8',
    },

    // Error state
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: 18,
        color: '#64748B',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    backButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 12,
    },
    backButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});
