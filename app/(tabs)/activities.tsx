import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';

// Import des hooks de l'API
import { useActivities, useActivityById, Activity } from '../api/activite/activitiesApi';

// On s'assure que l'URL se termine par un slash pour coller au code de ta page réservation
const IMAGE_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function ActivitiesScreen() {
    const { data: activities, isLoading: listLoading, isError: listError } = useActivities();

    // ID de l'activité sélectionnée pour la Modal
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Chargement du détail via l'endpoint spécifique
    const { data: detailData, isLoading: detailLoading, isError: detailError } = useActivityById(selectedId);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Nos Activités</Text>
                </View>

                {listLoading && (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#e51a2e" />
                    </View>
                )}

                {listError && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>Erreur de connexion au serveur</Text>
                    </View>
                )}

                <View style={styles.listContainer}>
                    {activities?.map((item: Activity) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedId(item.id)}
                        >
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: `${IMAGE_BASE_URL}${item.image_url}` }}
                                    style={styles.cardImage}
                                    resizeMode="cover"
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
            <Modal
                visible={selectedId !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedId(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        {detailLoading ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color="#e51a2e" />
                                <Text style={{ marginTop: 10 }}>Chargement...</Text>
                            </View>
                        ) : detailError ? (
                            <View style={styles.centerContainer}>
                                <Text style={styles.errorText}>Impossible de charger le détail</Text>
                            </View>
                        ) : detailData && (
                            <ScrollView bounces={false}>
                                <Image
                                    source={{ uri: `${IMAGE_BASE_URL}${detailData.image_url}` }}
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalTitle}>{detailData.nom}</Text>

                                    <View style={styles.modalRow}>
                                        <View style={styles.badge}>
                                            <Text style={styles.modalInfoText}>⏱ {detailData.duree}</Text>
                                        </View>
                                        <View style={styles.badge}>
                                            <Text style={styles.modalPriceText}>{detailData.tarif} €</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.modalLabel}>Description</Text>
                                    <Text style={styles.modalDescription}>{detailData.description}</Text>
                                </View>
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedId(null)}
                        >
                            <Text style={styles.closeButtonText}>FERMER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    header: { marginBottom: 20, marginTop: 10 },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    errorBox: { backgroundColor: '#fff0f0', padding: 15, borderRadius: 10, marginBottom: 20 },
    errorText: { color: '#e51a2e', textAlign: 'center', fontWeight: 'bold' },
    listContainer: { gap: 16 },
    card: { backgroundColor: '#f5f7ff', borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardImage: { width: '100%', height: 180 },
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    cardDesc: { fontSize: 14, color: '#555', marginVertical: 8 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardInfoText: { fontSize: 14, fontWeight: '600', color: '#4472c4' },
    priceText: { fontSize: 18, fontWeight: 'bold', color: '#e51a2e' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '85%', overflow: 'hidden' },
    modalImage: { width: '100%', height: 250 },
    modalBody: { padding: 24 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 15 },
    modalRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    badge: { backgroundColor: '#f0f4ff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    modalInfoText: { color: '#4472c4', fontWeight: 'bold' },
    modalPriceText: { color: '#e51a2e', fontWeight: 'bold' },
    modalLabel: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10 },
    modalDescription: { fontSize: 15, color: '#444', lineHeight: 22 },
    closeButton: { backgroundColor: '#e51a2e', padding: 18, alignItems: 'center', margin: 20, borderRadius: 12 },
    closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});