import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    StyleSheet, ActivityIndicator, Modal, FlatList, Image, Alert
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    useActivites, useAvailability,
    formatDuree, formatDateForApi, Activite
} from '../api/reservation/createReservationApi';
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://webngo.sio.bts:8002/';

const colors = {
    red: '#e51a2e',
    blue: '#4472c4',
    black: '#000000',
    grey: '#555555',
    lightGreen: '#a8d08d',
    lightGrey: '#bbbbbb',
};

export default function CreateReservation() {
    const [date, setDate] = useState(''); // format JJ/MM/AAAA affiché
    const [nbParticipants, setNbParticipants] = useState('1');
    const [heure, setHeure] = useState('');
    const [activiteSelectionnee, setActiviteSelectionnee] = useState<Activite | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: activites, isLoading, isError } = useActivites();
    const { addToCart, isInCart } = useCart();

    // --- LECTURE DU PARAMÈTRE D'URL ---
    const params = useLocalSearchParams();
    const activiteIdDepuisParam = params.activite_id ? Number(params.activite_id) : null;

    // --- AUTO-SÉLECTION DE L'ACTIVITÉ ---
    useEffect(() => {
        if (activiteIdDepuisParam && activites && activites.length > 0) {
            const activiteTrouvee = activites.find(a => a.id === activiteIdDepuisParam);

            // On vérifie qu'on l'a trouvée et qu'elle n'est pas déjà sélectionnée (pour éviter de recharger en boucle)
            if (activiteTrouvee && activiteSelectionnee?.id !== activiteTrouvee.id) {
                setActiviteSelectionnee(activiteTrouvee);
            }
        }
    }, [activiteIdDepuisParam, activites]); // S'exécute à l'arrivée sur la page ou à la fin du chargement API

    const nb = Math.max(1, parseInt(nbParticipants || '1'));
    const dateApi = formatDateForApi(date); // YYYY-MM-DD pour l'API

    // Clé unique pour ce créneau dans le panier
    const cartKey = `${activiteSelectionnee?.id}-${dateApi}-${heure}`;

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
        !isInCart(cartKey);

    const getDispoColor = () => {
        if (placesApres === null) return colors.lightGrey;
        if (placesApres < 0) return colors.red;
        if (placesApres < 5) return '#f0a500';
        return colors.lightGreen;
    };

    const handleAjouterAuPanier = (): void => {
        if (!activiteSelectionnee) return;

        if (!date.trim() || !heure.trim()) {
            Alert.alert('Champs manquants', 'Veuillez renseigner une date et une heure.');
            return;
        }

        if (placesApres !== null && placesApres < 0) {
            Alert.alert(
                'Plus de places',
                `Il ne reste que ${placesDisponibles} place(s) pour cette date.`
            );
            return;
        }

        if (isInCart(cartKey)) {
            Alert.alert('Déjà ajouté', 'Ce créneau est déjà dans votre panier.');
            return;
        }

        addToCart({
            cartKey,
            activite_id: activiteSelectionnee.id,
            nom: activiteSelectionnee.nom,
            description: activiteSelectionnee.description,
            image_url: activiteSelectionnee.image_url,
            tarif: activiteSelectionnee.tarif,
            duree: activiteSelectionnee.duree,
            date: dateApi,
            dateAffichee: date,
            heure,
            nb_participants: nb,
        });

        Alert.alert('✅ Ajouté', `"${activiteSelectionnee.nom}" ajouté au panier !`);

        setDate('');
        setHeure('');
        setNbParticipants('1');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Stack.Screen options={{
                title: "Nouvelle réservation",
                headerTintColor: colors.blue,
                headerTitleStyle: { fontWeight: 'bold' }
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Choisir une activité</Text>
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.blue} />
                    ) : activiteSelectionnee ? (
                        <View style={styles.selectButtonContent}>
                            <Image
                                source={{ uri: `${API_BASE_URL}${activiteSelectionnee.image_url}` }}
                                style={styles.selectButtonImage}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectButtonTitle}>{activiteSelectionnee.nom}</Text>
                                <Text style={styles.selectButtonSub}>
                                    {formatDuree(activiteSelectionnee.duree)} · {activiteSelectionnee.tarif} €
                                </Text>
                            </View>
                            <Ionicons name="chevron-down" size={18} color={colors.lightGrey} />
                        </View>
                    ) : (
                        <View style={styles.selectButtonContent}>
                            <Text style={styles.selectButtonPlaceholder}>Sélectionner une activité...</Text>
                            <Ionicons name="chevron-down" size={18} color={colors.lightGrey} />
                        </View>
                    )}
                </TouchableOpacity>

                {isError && (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
                        <Text style={styles.errorText}>Impossible de charger les activités</Text>
                    </View>
                )}

                {activiteSelectionnee && (
                    <>
                        {/* Card activité */}
                        <View style={styles.card}>
                            <Image
                                source={{ uri: `${API_BASE_URL}${activiteSelectionnee.image_url}` }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{activiteSelectionnee.nom}</Text>
                                <Text style={styles.cardDesc}>{activiteSelectionnee.description}</Text>
                                <View style={styles.cardRow}>
                                    <View style={styles.cardInfo}>
                                        <Ionicons name="time-outline" size={18} color={colors.blue} />
                                        <Text style={styles.cardInfoText}>{formatDuree(activiteSelectionnee.duree)}</Text>
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <MaterialIcons name="euro" size={18} color={colors.blue} />
                                        <Text style={styles.cardInfoText}>{activiteSelectionnee.tarif} €</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Date */}
                        <Text style={styles.label}>Sélectionner une date</Text>
                        <TextInput
                            placeholder="JJ/MM/AAAA"
                            value={date}
                            onChangeText={setDate}
                            style={styles.input}
                            keyboardType="numeric"
                        />

                        {/* Heure */}
                        <Text style={styles.label}>Sélectionner une heure</Text>
                        <TextInput
                            placeholder="Ex: 14:00"
                            value={heure}
                            onChangeText={setHeure}
                            style={styles.input}
                        />

                        {/* Jauge disponibilité — s'affiche seulement si date valide */}
                        {dateApi !== '' && (
                            <View style={[
                                styles.infoBox,
                                placesApres !== null && placesApres < 0 && styles.infoBoxError,
                                placesApres !== null && placesApres >= 0 && placesApres < 5 && styles.infoBoxWarning,
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
                                            <Text style={[styles.infoText, { color: getDispoColor() }]}>
                                                {placesDisponibles === null
                                                    ? 'Entrez une date valide'
                                                    : placesApres! < 0
                                                        ? `Pas assez de places — ${placesDisponibles} disponible(s)`
                                                        : `${placesApres} place(s) restante(s) après réservation`}
                                            </Text>
                                            {/* Barre de progression */}
                                            {placesDisponibles !== null && quotaJour !== null && (
                                                <View style={styles.progressBar}>
                                                    <View style={[
                                                        styles.progressFill,
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
                        <Text style={styles.label}>Nombre de participants</Text>
                        <View style={styles.counter}>
                            <TouchableOpacity
                                onPress={() => setNbParticipants(Math.max(1, nb - 1).toString())}
                                style={styles.counterBtn}
                            >
                                <Text style={styles.counterBtnText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                keyboardType="numeric"
                                value={nbParticipants}
                                onChangeText={(v) => setNbParticipants(v.replace(/[^0-9]/g, ''))}
                                style={styles.counterInput}
                            />
                            <TouchableOpacity
                                onPress={() => setNbParticipants((nb + 1).toString())}
                                style={styles.counterBtn}
                            >
                                <Text style={styles.counterBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Total */}
                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>Total estimé</Text>
                            <Text style={styles.totalAmount}>
                                {(activiteSelectionnee.tarif * nb).toFixed(2)} €
                            </Text>
                        </View>

                        {/* Bouton */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.cartButton, !peutReserver && styles.cartButtonDisabled]}
                            disabled={!peutReserver}
                            onPress={handleAjouterAuPanier}
                        >
                            <Ionicons name="cart-outline" size={24} color="white" />
                            <Text style={styles.cartButtonText}>
                                {isInCart(cartKey) ? 'DÉJÀ DANS LE PANIER' : 'AJOUTER AU PANIER'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <Text style={styles.footer}>Application Mobile · NGO · BTSSIO Jean Rostand</Text>
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisir une activité</Text>
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
                                            styles.modalItem,
                                            activiteSelectionnee?.id === item.id && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setActiviteSelectionnee(item);
                                            setNbParticipants('1');
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: `${API_BASE_URL}${item.image_url}` }}
                                            style={styles.modalItemImage}
                                            resizeMode="cover"
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.modalItemTitle}>{item.nom}</Text>
                                            <Text style={styles.modalItemSub}>{item.description}</Text>
                                            <View style={styles.modalItemRow}>
                                                <Text style={styles.modalItemBadge}>{formatDuree(item.duree)}</Text>
                                                <Text style={[styles.modalItemBadge, { backgroundColor: '#eef2fb', color: colors.blue }]}>
                                                    {item.tarif} €
                                                </Text>
                                            </View>
                                        </View>
                                        {activiteSelectionnee?.id === item.id && (
                                            <Ionicons name="checkmark-circle" size={22} color={colors.blue} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    label: { fontSize: 14, fontWeight: '600', color: colors.grey, marginBottom: 8, marginTop: 16 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#fafafa', fontSize: 15 },
    selectButton: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#fafafa' },
    selectButtonContent: { flexDirection: 'row', alignItems: 'center' },
    selectButtonImage: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
    selectButtonTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    selectButtonSub: { fontSize: 12, color: colors.grey, marginTop: 2 },
    selectButtonPlaceholder: { flex: 1, fontSize: 15, color: colors.lightGrey },
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff0f0', padding: 12, borderRadius: 10, marginTop: 8 },
    errorText: { color: colors.red, marginLeft: 8, fontSize: 13 },
    card: { backgroundColor: '#f5f7ff', borderRadius: 16, marginTop: 16, overflow: 'hidden' },
    cardImage: { width: '100%', height: 180 },
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 17, fontWeight: 'bold', color: colors.black, marginBottom: 6 },
    cardDesc: { fontSize: 13, color: colors.grey, lineHeight: 19, marginBottom: 12 },
    cardRow: { flexDirection: 'row', gap: 20 },
    cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardInfoText: { fontSize: 14, fontWeight: '600', color: colors.black },
    infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#a8d08d20', borderWidth: 1, borderColor: colors.lightGreen, borderRadius: 12, padding: 14, marginTop: 16 },
    infoBoxError: { backgroundColor: '#fff0f0', borderColor: colors.red },
    infoBoxWarning: { backgroundColor: '#fff8e1', borderColor: '#f0a500' },
    infoText: { fontWeight: '600', fontSize: 13 },
    progressBar: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', overflow: 'hidden' },
    counterBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    counterBtnText: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    counterInput: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: colors.black },
    totalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4ff', borderRadius: 14, padding: 16, marginTop: 16 },
    totalLabel: { fontSize: 15, color: colors.grey, fontWeight: '500' },
    totalAmount: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    cartButton: { backgroundColor: colors.red, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    cartButtonDisabled: { opacity: 0.5 },
    cartButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
    footer: { textAlign: 'center', fontSize: 11, color: colors.lightGrey, marginTop: 24 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingBottom: 30 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.black },
    modalItem: { padding: 16, flexDirection: 'row', alignItems: 'center' },
    modalItemSelected: { backgroundColor: '#eef2fb' },
    modalItemImage: { width: 56, height: 56, borderRadius: 10, marginRight: 12 },
    modalItemTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    modalItemSub: { fontSize: 12, color: colors.grey, marginTop: 2, marginBottom: 8 },
    modalItemRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    modalItemBadge: { fontSize: 12, fontWeight: '600', backgroundColor: '#f0f0f0', color: colors.grey, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
});