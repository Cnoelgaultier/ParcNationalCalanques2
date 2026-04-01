import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import des hooks de l'API activité
import { useActivities, useActivityById, Activity } from '../api/activite/activitiesApi';
// Import du hook API des types d'activités
import { useTypeActivites, TypeActivite } from '../api/typeActivite/typeActivitiesApi';

// Import des styles globaux et des couleurs
import { globalStyles, colors } from '../styles/globalStyles';
// IMPORT DE useRouter pour la navigation depuis la modal
import { Link, useRouter } from "expo-router";

const IMAGE_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function ActivitiesScreen() {
    const { data: activities, isLoading: listLoading, isError: listError } = useActivities();
    const { data: types, isLoading: typesLoading } = useTypeActivites();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { data: detailData, isLoading: detailLoading, isError: detailError } = useActivityById(selectedId);

    // Initialisation du routeur
    const router = useRouter();

    // --- ÉTATS POUR LES FILTRES ---
    const [showFilters, setShowFilters] = useState(false);
    const [maxTarif, setMaxTarif] = useState<string>('');
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [maxDuree, setMaxDuree] = useState<string>('');
    const [minDuree, setMinDuree] = useState<string>('');

    // --- LOGIQUE DE FILTRAGE ---
    const filteredActivities = activities?.filter(item => {
        let isValid = true;
        if (selectedType !== null && item.type_id !== selectedType) isValid = false;
        if (maxTarif.trim() !== '') {
            const tarifSaisi = parseFloat(maxTarif.replace(',', '.'));
            if (item.tarif > tarifSaisi) isValid = false;
        }
        if (maxDuree.length === 8 && item.duree > maxDuree) isValid = false;
        if (minDuree.length === 8 && item.duree < minDuree) isValid = false;
        return isValid;
    });

    const formatTimeMask = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;
        if (numbers.length > 2) formatted = `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
        if (numbers.length > 4) formatted = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(4, 6)}`;
        return formatted;
    };

    // --- FONCTION DE REDIRECTION DEPUIS LA MODAL ---
    const handleReserveActivity = () => {
        // On ferme la modal
        setSelectedId(null);
        // On redirige vers la page de réservation
        router.push({ pathname: "/createReservation", params: { activite_id: selectedId } });
    };

    return (
        <View style={globalStyles.container}>

            {/* --- EN-TÊTE ET CARROUSEL DES TYPES D'ACTIVITÉS --- */}
            <View style={{ paddingTop: 20 }}>
                <View style={[globalStyles.actHeader, { paddingHorizontal: 20 }]}>
                    <Text style={[globalStyles.pageTitle, { marginBottom: 10, marginTop: 0 }]}>Nos Activités</Text>
                </View>

                {typesLoading ? (
                    <ActivityIndicator size="small" color={colors.blue} style={{ marginBottom: 15 }} />
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={globalStyles.actTypesScroll}
                        contentContainerStyle={globalStyles.actTypesContainer}
                    >
                        <TouchableOpacity
                            style={[globalStyles.actFilterChip, selectedType === null && globalStyles.actFilterChipSelected]}
                            onPress={() => setSelectedType(null)}
                        >
                            <Text style={[globalStyles.actFilterChipText, selectedType === null && globalStyles.actFilterChipTextSelected]}>
                                Toutes
                            </Text>
                        </TouchableOpacity>

                        {types?.map((type: TypeActivite) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    globalStyles.actFilterChip,
                                    selectedType === type.id && globalStyles.actFilterChipSelected
                                ]}
                                onPress={() => setSelectedType(type.id)}
                            >
                                <Text style={[
                                    globalStyles.actFilterChipText,
                                    selectedType === type.id && globalStyles.actFilterChipTextSelected
                                ]}>
                                    {type.libelle}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* --- CONTENU PRINCIPAL --- */}
            <ScrollView contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 0 }]}>

                <TouchableOpacity
                    style={globalStyles.actFilterToggle}
                    onPress={() => setShowFilters(!showFilters)}
                    activeOpacity={0.8}
                >
                    <Text style={globalStyles.actFilterToggleText}>
                        <Ionicons name="options-outline" size={16} /> Filtres avancés (Prix, Durée)
                    </Text>
                    <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={20} color={colors.blue} />
                </TouchableOpacity>

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
                            keyboardType="numeric"
                            maxLength={8}
                            value={maxDuree}
                            onChangeText={(text) => setMaxDuree(formatTimeMask(text))}
                        />

                        <Text style={globalStyles.actFilterLabel}>Durée Minimum</Text>
                        <TextInput
                            style={globalStyles.actFilterInput}
                            placeholder="Ex: 00:00:00"
                            keyboardType="numeric"
                            maxLength={8}
                            value={minDuree}
                            onChangeText={(text) => setMinDuree(formatTimeMask(text))}
                        />
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

            <View style={globalStyles.footer}>
                <Link href="/createReservation" asChild>
                    <TouchableOpacity style={globalStyles.secondaryButton}>
                        <Text style={globalStyles.secondaryButtonText}>Faire une réservation</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* MODAL */}
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

                        {/* --- ZONE DES BOUTONS DE LA MODAL --- */}
                        <View style={{ gap: 10, marginTop: 10 }}>
                            {/* Bouton pour aller réserver cette activité */}
                            <TouchableOpacity
                                style={globalStyles.primaryButton}
                                onPress={handleReserveActivity}
                            >
                                <Text style={globalStyles.primaryButtonText}>RÉSERVER CETTE ACTIVITÉ</Text>
                            </TouchableOpacity>

                            {/* Bouton pour fermer la modal */}
                            <TouchableOpacity
                                style={globalStyles.secondaryButton}
                                onPress={() => setSelectedId(null)}
                            >
                                <Text style={globalStyles.secondaryButtonText}>FERMER</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
}