import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';

// Import des hooks de l'API
import { useActivities, useActivityById, Activity } from '../api/activite/activitiesApi';

// Import des styles globaux et des couleurs
import { globalStyles, colors } from '../styles/globalStyles';

const IMAGE_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function ActivitiesScreen() {
    const { data: activities, isLoading: listLoading, isError: listError } = useActivities();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { data: detailData, isLoading: detailLoading, isError: detailError } = useActivityById(selectedId);

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={globalStyles.scrollContent}>
                <View style={globalStyles.actHeader}>
                    <Text style={globalStyles.pageTitle}>Nos Activités</Text>
                </View>

                {listLoading && (
                    <View style={globalStyles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.red} />
                    </View>
                )}

                {listError && (
                    <View style={globalStyles.errorBox}>
                        <Text style={globalStyles.errorText}>Erreur de connexion au serveur</Text>
                    </View>
                )}

                <View style={globalStyles.actListContainer}>
                    {activities?.map((item: Activity) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedId(item.id)}
                        >
                            <View style={globalStyles.card}>
                                <Image
                                    source={{ uri: `${IMAGE_BASE_URL}${item.image_url}` }}
                                    style={globalStyles.cardImage}
                                    resizeMode="cover"
                                />
                                <View style={globalStyles.cardBody}>
                                    <Text style={globalStyles.cardTitle}>{item.nom}</Text>
                                    <Text style={globalStyles.cardDesc} numberOfLines={2}>{item.description}</Text>
                                    <View style={globalStyles.cardRow}>
                                        <Text style={globalStyles.infoTextBlue}>⏱ {item.duree}</Text>
                                        <Text style={globalStyles.priceTextRed}>{item.tarif} €</Text>
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
                <View style={globalStyles.modalOverlay}>
                    <View style={globalStyles.modalContent}>

                        {detailLoading ? (
                            <View style={globalStyles.centerContainer}>
                                <ActivityIndicator size="large" color={colors.red} />
                                <Text style={{ marginTop: 10 }}>Chargement...</Text>
                            </View>
                        ) : detailError ? (
                            <View style={globalStyles.centerContainer}>
                                <Text style={globalStyles.errorText}>Impossible de charger le détail</Text>
                            </View>
                        ) : detailData && (
                            <ScrollView bounces={false}>
                                <Image
                                    source={{ uri: `${IMAGE_BASE_URL}${detailData.image_url}` }}
                                    style={globalStyles.actModalImage}
                                    resizeMode="cover"
                                />
                                <View style={globalStyles.modalBody}>
                                    <Text style={globalStyles.actModalTitle}>{detailData.nom}</Text>

                                    <View style={globalStyles.actModalRow}>
                                        <View style={globalStyles.actBadge}>
                                            <Text style={globalStyles.infoTextBlue}>⏱ {detailData.duree}</Text>
                                        </View>
                                        <View style={globalStyles.actBadge}>
                                            <Text style={globalStyles.priceTextRed}>{detailData.tarif} €</Text>
                                        </View>
                                    </View>

                                    <Text style={globalStyles.label}>Description</Text>
                                    <Text style={globalStyles.actModalDescription}>{detailData.description}</Text>
                                </View>
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={globalStyles.primaryButton}
                            onPress={() => setSelectedId(null)}
                        >
                            <Text style={globalStyles.primaryButtonText}>FERMER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
