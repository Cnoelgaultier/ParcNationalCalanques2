import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    ActivityIndicator, Modal, FlatList, Image, Alert
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    useActivites, useAvailability, useCreateReservation,
    formatDuree, formatDateForApi, Activite
} from '../api/reservation/createReservationApi';

// 1. Importation des styles globaux et des couleurs
import { globalStyles, colors } from '../styles/globalStyles';

const API_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function CreateReservation() {
    const [date, setDate] = useState(''); // format JJ/MM/AAAA affiché
    const [nbParticipants, setNbParticipants] = useState('1');
    const [heure, setHeure] = useState('');
    const [activiteSelectionnee, setActiviteSelectionnee] = useState<Activite | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: activites, isLoading, isError } = useActivites();
    const { mutate: creerReservation, isPending } = useCreateReservation();

    const nb = Math.max(1, parseInt(nbParticipants || '1'));
    const dateApi = formatDateForApi(date); // YYYY-MM-DD pour l'API

    // Fetch dispo uniquement si activité + date valide
    const {
        data: availability,
        isLoading: isLoadingDispo,
        isFetching: isFetchingDispo,
    } = useAvailability(activiteSelectionnee?.id ?? null, dateApi);

    const placesDisponibles = availability?.disponible_jour ?? null;
    const quotaJour = availability?.quota_jour ?? null;
    const placesApres = placesDisponibles !== null ? placesDisponibles - nb : null;
    const peutReserver =
        placesApres !== null &&
        placesApres >= 0 &&
        date.trim() !== '' &&
        heure.trim() !== '' &&
        !isPending;

    // Couleur de la jauge selon les places restantes
    const getDispoColor = () => {
        if (placesApres === null) return colors.lightGrey; // [cite: 18]
        if (placesApres < 0) return colors.red; // [cite: 15]
        if (placesApres < 5) return '#f0a500';
        return colors.lightGreen; // [cite: 22]
    };

    const handleAjouterAuPanier = () => {
        if (!activiteSelectionnee) return;
        if (!date.trim() || !heure.trim()) {
            Alert.alert('Champs manquants', 'Veuillez renseigner une date et une heure.');
            return;
        }
        if (placesApres !== null && placesApres < 0) {
            Alert.alert('Plus de places', `Il ne reste que ${placesDisponibles} place(s) pour cette date.`);
            return;
        }

        creerReservation(
            { activite_id: activiteSelectionnee.id, date: dateApi, heure, nb_participants: nb },
            {
                onSuccess: () => {
                    Alert.alert('Succès', `"${activiteSelectionnee.nom}" ajouté au panier !`);
                    setDate('');
                    setHeure('');
                    setNbParticipants('1');
                },
                onError: (error) => {
                    Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <Stack.Screen options={{
                title: "Nouvelle réservation",
                headerTintColor: colors.blue, // [cite: 21]
                headerTitleStyle: { fontWeight: 'bold' }
            }} />

            <ScrollView contentContainerStyle={globalStyles.scrollContent}>

                {/* Sélection de l'activité */}
                <Text style={globalStyles.label}>Choisir une activité</Text>
                <TouchableOpacity
                    style={globalStyles.resSelectButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.blue} />
                    ) : activiteSelectionnee ? (
                        <View style={globalStyles.resSelectButtonContent}>
                            <Image
                                source={{ uri: `${API_BASE_URL}${activiteSelectionnee.image_url}` }}
                                style={globalStyles.resSelectButtonImage}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={globalStyles.resSelectButtonTitle}>{activiteSelectionnee.nom}</Text>
                                <Text style={globalStyles.resSelectButtonSub}>
                                    {formatDuree(activiteSelectionnee.duree)} · {activiteSelectionnee.tarif} €
                                </Text>
                            </View>
                            <Ionicons name="chevron-down" size={18} color={colors.lightGrey} />
                        </View>
                    ) : (
                        <View style={globalStyles.resSelectButtonContent}>
                            <Text style={globalStyles.resSelectButtonPlaceholder}>Sélectionner une activité...</Text>
                            <Ionicons name="chevron-down" size={18} color={colors.lightGrey} />
                        </View>
                    )}
                </TouchableOpacity>

                {isError && (
                    <View style={globalStyles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
                        <Text style={globalStyles.errorText}>Impossible de charger les activités</Text>
                    </View>
                )}

                {activiteSelectionnee && (
                    <>
                        {/* Card activité */}
                        <View style={globalStyles.card}>
                            <Image
                                source={{ uri: `${API_BASE_URL}${activiteSelectionnee.image_url}` }}
                                style={globalStyles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={globalStyles.cardBody}>
                                <Text style={globalStyles.cardTitle}>{activiteSelectionnee.nom}</Text>
                                <Text style={globalStyles.cardDesc}>{activiteSelectionnee.description}</Text>
                                <View style={globalStyles.cardRow}>
                                    <View style={globalStyles.resCardInfo}>
                                        <Ionicons name="time-outline" size={18} color={colors.blue} />
                                        <Text style={globalStyles.infoTextBlue}>{formatDuree(activiteSelectionnee.duree)}</Text>
                                    </View>
                                    <View style={globalStyles.resCardInfo}>
                                        <MaterialIcons name="euro" size={18} color={colors.blue} />
                                        <Text style={globalStyles.priceTextRed}>{activiteSelectionnee.tarif} €</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Date */}
                        <Text style={globalStyles.label}>Sélectionner une date</Text>
                        <TextInput
                            placeholder="JJ/MM/AAAA"
                            value={date}
                            onChangeText={setDate}
                            style={globalStyles.resInput}
                            keyboardType="numeric"
                        />

                        {/* Heure */}
                        <Text style={globalStyles.label}>Sélectionner une heure</Text>
                        <TextInput
                            placeholder="Ex: 14:00"
                            value={heure}
                            onChangeText={setHeure}
                            style={globalStyles.resInput}
                        />

                        {/* Jauge disponibilité — s'affiche seulement si date valide */}
                        {dateApi !== '' && (
                            <View style={[
                                globalStyles.resInfoBox,
                                placesApres !== null && placesApres < 0 && globalStyles.resInfoBoxError,
                                placesApres !== null && placesApres >= 0 && placesApres < 5 && globalStyles.resInfoBoxWarning,
                            ]}>
                                {isLoadingDispo || isFetchingDispo ? (
                                    <ActivityIndicator size="small" color={colors.blue} />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="information-circle-outline"
                                            size={20}
                                            color={getDispoColor()}
                                        />
                                        <View style={{ flex: 1, marginLeft: 8 }}>
                                            <Text style={[globalStyles.resInfoText, { color: getDispoColor() }]}>
                                                {placesDisponibles === null
                                                    ? 'Entrez une date valide'
                                                    : placesApres! < 0
                                                        ? `Pas assez de places — ${placesDisponibles} disponible(s)`
                                                        : `${placesApres} place(s) restante(s) après réservation`}
                                            </Text>
                                            {/* Barre de progression */}
                                            {placesDisponibles !== null && quotaJour !== null && (
                                                <View style={globalStyles.resProgressBar}>
                                                    <View style={[
                                                        globalStyles.resProgressFill,
                                                        {
                                                            width: `${Math.min(100, (placesDisponibles / quotaJour) * 100)}%`,
                                                            backgroundColor: getDispoColor(),
                                                        }
                                                    ]} />
                                                </View>
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        )}

                        {/* Participants */}
                        <Text style={globalStyles.label}>Nombre de participants</Text>
                        <View style={globalStyles.resCounter}>
                            <TouchableOpacity
                                onPress={() => setNbParticipants(Math.max(1, nb - 1).toString())}
                                style={globalStyles.resCounterBtn}
                            >
                                <Text style={globalStyles.resCounterBtnText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                keyboardType="numeric"
                                value={nbParticipants}
                                onChangeText={(v) => setNbParticipants(v.replace(/[^0-9]/g, ''))}
                                style={globalStyles.resCounterInput}
                            />
                            <TouchableOpacity
                                onPress={() => setNbParticipants((nb + 1).toString())}
                                style={globalStyles.resCounterBtn}
                            >
                                <Text style={globalStyles.resCounterBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Total */}
                        <View style={globalStyles.resTotalBox}>
                            <Text style={globalStyles.resTotalLabel}>Total estimé</Text>
                            <Text style={globalStyles.resTotalAmount}>
                                {(activiteSelectionnee.tarif * nb).toFixed(2)} €
                            </Text>
                        </View>

                        {/* Bouton */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[globalStyles.primaryButton, !peutReserver && globalStyles.resCartButtonDisabled]}
                            disabled={!peutReserver}
                            onPress={handleAjouterAuPanier}
                        >
                            {isPending ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <>
                                    <Ionicons name="cart-outline" size={24} color={colors.white} />
                                    <Text style={globalStyles.primaryButtonText}>AJOUTER AU PANIER</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                <Text style={globalStyles.footer}>Application Mobile · NGO · BTSSIO Jean Rostand</Text>
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={globalStyles.modalOverlay}>
                    <View style={globalStyles.resModalContainer}>
                        <View style={globalStyles.modalHeader}>
                            <Text style={globalStyles.modalTitle}>Choisir une activité</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.black} />
                            </TouchableOpacity>
                        </View>
                        {isLoading ? (
                            <ActivityIndicator size="large" color={colors.blue} style={{ marginTop: 40 }} />
                        ) : (
                            <FlatList
                                data={activites}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            globalStyles.resModalItem,
                                            activiteSelectionnee?.id === item.id && globalStyles.resModalItemSelected
                                        ]}
                                        onPress={() => {
                                            setActiviteSelectionnee(item);
                                            setNbParticipants('1');
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: `${API_BASE_URL}${item.image_url}` }}
                                            style={globalStyles.resModalItemImage}
                                            resizeMode="cover"
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={globalStyles.resModalItemTitle}>{item.nom}</Text>
                                            <Text style={globalStyles.resModalItemSub}>{item.description}</Text>
                                            <View style={globalStyles.resModalItemRow}>
                                                <Text style={globalStyles.resModalItemBadge}>{formatDuree(item.duree)}</Text>
                                                <Text style={[globalStyles.resModalItemBadge, { backgroundColor: '#eef2fb', color: colors.blue }]}>
                                                    {item.tarif} €
                                                </Text>
                                            </View>
                                        </View>
                                        {activiteSelectionnee?.id === item.id && (
                                            <Ionicons name="checkmark-circle" size={22} color={colors.blue} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={globalStyles.resSeparator} />}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}
