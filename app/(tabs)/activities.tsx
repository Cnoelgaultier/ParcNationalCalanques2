import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import des hooks de l'API
import { useActivities, useActivityById, Activity } from '../api/activite/activitiesApi';

// Import des styles globaux et des couleurs
import { globalStyles, colors } from '../styles/globalStyles';

const IMAGE_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function ActivitiesScreen() {
    const { data: activities, isLoading: listLoading, isError: listError } = useActivities();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { data: detailData, isLoading: detailLoading, isError: detailError } = useActivityById(selectedId);

    // --- ÉTATS POUR LES FILTRES ---
    const [showFilters, setShowFilters] = useState(false);
    const [maxTarif, setMaxTarif] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [maxDuree, setMaxDuree] = useState<string>('');
    const [minDuree, setMinDuree] = useState<string>('');


    // Extraction dynamique des types d'activités disponibles dans la base
    const uniqueTypes = Array.from(new Set(activities?.map(item => item.type_id) || []));

    // --- LOGIQUE DE FILTRAGE ---
    const filteredActivities = activities?.filter(item => {
        let isValid = true;

        // Filtre par Type
        if (selectedType !== null && item.type_id !== selectedType) {
            isValid = false;
        }

        // Filtre par Tarif Max
        if (maxTarif.trim() !== '' && item.tarif > parseFloat(maxTarif)) {
            isValid = false;
        }

        // Filtre par Durée Max
        if (maxDuree.length === 8 && item.duree > maxDuree) {
            isValid = false;
        }

        // Filtre par Durée Min
        if (minDuree.length === 8 && item.duree < minDuree) {
            isValid = false;
        }

        return isValid;
    });

    // --- Format Masque durée ---
    const formatTimeMask = (value: string) => {
        const numbers = value.replace(/\D/g, '');

        let formatted = numbers;
        if (numbers.length > 2) {
            formatted = `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
        }
        if (numbers.length > 4) {
            formatted = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(4, 6)}`;
        }

        return formatted;
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={globalStyles.scrollContent}>
                <View style={globalStyles.actHeader}>
                    <Text style={globalStyles.pageTitle}>Nos Activités</Text>
                </View>

                {/* --- BOUTON POUR AFFICHER/MASQUER LES FILTRES --- */}
                <TouchableOpacity
                    style={globalStyles.actFilterToggle}
                    onPress={() => setShowFilters(!showFilters)}
                    activeOpacity={0.8}
                >
                    <Text style={globalStyles.actFilterToggleText}>
                        <Ionicons name="filter" size={16} /> Filtrer les résultats
                    </Text>
                    <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={20} color={colors.blue} />
                </TouchableOpacity>

                {/* --- ZONE DE FILTRES --- */}
                {showFilters && (
                    <View style={globalStyles.actFilterContainer}>

                        <Text style={[globalStyles.actFilterLabel, { marginTop: 0 }]}>Budget Maximum (€)</Text>
                        <TextInput
                            style={globalStyles.actFilterInput}
                            placeholder="Ex: 30"
                            keyboardType="numeric"
                            value={maxTarif}
                            onChangeText={setMaxTarif}
                        />

                        <Text style={globalStyles.actFilterLabel}>Durée Maximum</Text>
                        <TextInput
                            style={globalStyles.actFilterInput}
                            placeholder="Ex: 00:00:00"
                            keyboardType="default"
                            maxLength={8}
                            value={maxDuree}
                            onChangeText={(text) => setMaxDuree(formatTimeMask(text))}
                        />

                        <Text style={globalStyles.actFilterLabel}>Durée Minimum</Text>
                        <TextInput
                            style={globalStyles.actFilterInput}
                            placeholder="Ex: 00:00:00"
                            keyboardType="default"
                            maxLength={8}
                            value={minDuree}
                            onChangeText={(text) => setMinDuree(formatTimeMask(text))}
                        />
                        {uniqueTypes.length > 0 && (
                            <>
                                <Text style={globalStyles.actFilterLabel}>Type d'activité (ID)</Text>
                                <View style={globalStyles.actFilterRow}>
                                    {/* Bouton "Tous" */}
                                    <TouchableOpacity
                                        style={[globalStyles.actFilterChip, selectedType === null && globalStyles.actFilterChipSelected]}
                                        onPress={() => setSelectedType(null)}
                                    >
                                        <Text style={[globalStyles.actFilterChipText, selectedType === null && globalStyles.actFilterChipTextSelected]}>Tous</Text>
                                    </TouchableOpacity>

                                    {/* Boutons pour chaque type existant */}
                                    {uniqueTypes.map(typeId => (
                                        <TouchableOpacity
                                            key={typeId}
                                            style={[globalStyles.actFilterChip, selectedType === typeId && globalStyles.actFilterChipSelected]}
                                            onPress={() => setSelectedType(typeId)}
                                        >
                                            <Text style={[globalStyles.actFilterChipText, selectedType === typeId && globalStyles.actFilterChipTextSelected]}>
                                                Type {typeId}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                )}

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

                {/* Affichage des activités filtrées */}
                <View style={globalStyles.actListContainer}>
                    {filteredActivities?.length === 0 && !listLoading && (
                        <Text style={{ textAlign: 'center', color: colors.grey, marginTop: 20 }}>
                            Aucune activité ne correspond à vos filtres.
                        </Text>
                    )}

                    {filteredActivities?.map((item: Activity) => (
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

            {/* MODAL (Reste inchangée) */}
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