import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native';

// On importe uniquement le hook et le type depuis notre fichier API
import { useActivities, Activity } from '../api/activite/activitiesApi';

const IMAGE_BASE_URL = 'http://webngo.sio.bts:8002';

export default function ActivitiesScreen() {
    const { data: activities, isLoading, isError, error } = useActivities();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <Text style={styles.pageTitle}>Nos Activités</Text>
            </View>

            {isLoading && (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#e51a2e" />
                    <Text style={styles.loadingText}>Chargement des activités...</Text>
                </View>
            )}

            {isError && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>
                        Erreur : {error instanceof Error ? error.message : 'Impossible de joindre le serveur'}
                    </Text>
                </View>
            )}

            <View style={styles.listContainer}>
                {activities?.map((item: Activity) => (
                    <TouchableOpacity key={item.id} activeOpacity={0.8}>
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.image_url ? `${IMAGE_BASE_URL}${item.image_url}` : 'https://via.placeholder.com/150' }}
                                style={styles.cardImage}
                            />
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{item.nom}</Text>
                                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                <View style={styles.cardRow}>
                                    <Text style={styles.cardInfoText}>⏱ {item.duree}</Text>
                                    <Text style={styles.priceText}>{item.tarif} €</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    header: { marginBottom: 20, marginTop: 10 },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    centerContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
    loadingText: { marginTop: 10, color: '#555' },
    errorBox: { backgroundColor: '#fff0f0', padding: 16, borderRadius: 12, marginBottom: 20 },
    errorText: { color: '#e51a2e', fontWeight: 'bold', textAlign: 'center' },
    listContainer: { gap: 16 },
    card: { backgroundColor: '#f5f7ff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardImage: { width: '100%', height: 180 },
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 6 },
    cardDesc: { fontSize: 14, color: '#555', marginBottom: 12 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardInfoText: { fontSize: 14, fontWeight: '600', color: '#4472c4' },
    priceText: { fontSize: 18, fontWeight: 'bold', color: '#e51a2e' }
});