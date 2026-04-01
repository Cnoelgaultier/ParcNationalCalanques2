import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    StyleSheet, ActivityIndicator, Modal, FlatList, Image, Alert
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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

// Liste de tes créneaux horaires disponibles
const CRENEAUX_HORAIRES = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00', '17:30'];

export default function CreateReservation() {
    // États pour la date et l'heure
    const [date, setDate] = useState(''); // format JJ/MM/AAAA affiché
    const [dateObj, setDateObj] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [heure, setHeure] = useState('');
    const [nbParticipants, setNbParticipants] = useState('1');
    const [activiteSelectionnee, setActiviteSelectionnee] = useState<Activite | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: activites, isLoading, isError } = useActivites();
    const { addToCart, isInCart } = useCart();

    const nb = Math.max(1, parseInt(nbParticipants || '1'));
    const dateApi = formatDateForApi(date);

    const cartKey = `${activiteSelectionnee?.id}-${dateApi}-${heure}`;

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

    // Gestionnaire du calendrier natif
    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            setDateObj(selectedDate);
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();

            setDate(`${day}/${month}/${year}`);
        }
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Stack.Screen options={{
                title: "Nouvelle réservation",
                headerTintColor: colors.blue,
                headerTitleStyle: { fontWeight: 'bold' }
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Choisir une activité</Text>
                <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.blue} />
                    ) : activiteSelectionnee ? (
                        <View style={styles.selectButtonContent}>
                            <Image source={{ uri: `${API_BASE_URL}${activiteSelectionnee.image_url}` }} style={styles.selectButtonImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectButtonTitle}>{activiteSelectionnee.nom}</Text>
                                <Text style={styles.selectButtonSub}>{formatDuree(activiteSelectionnee.duree)} · {activiteSelectionnee.tarif} €</Text>
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
                        {/* Date */}
                        <Text style={styles.label}>Sélectionner une date</Text>

                        {Platform.OS === 'web' ? (
                            /* Fallback spécifique pour le Web (utilise le calendrier du navigateur) */
                            <input
                                type="date"
                                value={dateApi}
                                min={new Date().toISOString().split('T')[0]} // Empêche de réserver dans le passé
                                onChange={(e: any) => {
                                    const val = e.target.value; // Format retourné : YYYY-MM-DD
                                    if (val) {
                                        const [year, month, day] = val.split('-');
                                        setDate(`${day}/${month}/${year}`); // Affichage en JJ/MM/AAAA
                                        setDateObj(new Date(Number(year), Number(month) - 1, Number(day)));
                                    } else {
                                        setDate('');
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    backgroundColor: '#fafafa',
                                    fontSize: '15px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    color: colors.black,
                                    boxSizing: 'border-box'
                                }}
                            />
                        ) : Platform.OS === 'ios' ? (
                            /* Version iOS native */
                            <View style={styles.iosPickerContainer}>
                                <DateTimePicker
                                    value={dateObj}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                    minimumDate={new Date()}
                                />
                            </View>
                        ) : (
                            /* Version Android native */
                            <>
                                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                                    <Text style={[styles.dateButtonText, !date && { color: colors.lightGrey }]}>
                                        {date || "Choisir dans le calendrier..."}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color={colors.grey} />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dateObj}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </>
                        )}

                        {/* Jauge disponibilité */}
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
                                        <Ionicons name="information-circle-outline" size={20} color={getDispoColor()} />
                                        <View style={{ flex: 1, marginLeft: 8 }}>
                                            <Text style={[styles.infoText, { color: getDispoColor() }]}>
                                                {placesDisponibles === null
                                                    ? 'Entrez une date valide'
                                                    : placesApres! < 0
                                                        ? `Pas assez de places — ${placesDisponibles} disponible(s)`
                                                        : `${placesApres} place(s) restante(s) après réservation`}
                                            </Text>
                                            {placesDisponibles !== null && quotaJour !== null && (
                                                <View style={styles.progressBar}>
                                                    <View style={[
                                                        styles.progressFill,
                                                        { width: `${Math.min(100, (placesDisponibles / quotaJour) * 100)}%`, backgroundColor: getDispoColor() }
                                                    ]} />
                                                </View>
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        )}

                        {/* Heure (Créneaux sous forme de bulles) */}
                        <Text style={styles.label}>Sélectionner un créneau</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeContainer}>
                            {CRENEAUX_HORAIRES.map((creneau) => (
                                <TouchableOpacity
                                    key={creneau}
                                    activeOpacity={0.7}
                                    style={[styles.timeBadge, heure === creneau && styles.timeBadgeSelected]}
                                    onPress={() => setHeure(creneau)}
                                >
                                    <Text style={[styles.timeBadgeText, heure === creneau && styles.timeBadgeTextSelected]}>
                                        {creneau}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Participants */}
                        <Text style={styles.label}>Nombre de participants</Text>
                        <View style={styles.counter}>
                            <TouchableOpacity onPress={() => setNbParticipants(Math.max(1, nb - 1).toString())} style={styles.counterBtn}>
                                <Text style={styles.counterBtnText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                keyboardType="numeric"
                                value={nbParticipants}
                                onChangeText={(v) => setNbParticipants(v.replace(/[^0-9]/g, ''))}
                                style={styles.counterInput}
                            />
                            <TouchableOpacity onPress={() => setNbParticipants((nb + 1).toString())} style={styles.counterBtn}>
                                <Text style={styles.counterBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Total */}
                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>Total estimé</Text>
                            <Text style={styles.totalAmount}>{(activiteSelectionnee.tarif * nb).toFixed(2)} €</Text>
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
            </ScrollView>

            {/* Modal de sélection d'activité inchangé */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
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
                                        style={[styles.modalItem, activiteSelectionnee?.id === item.id && styles.modalItemSelected]}
                                        onPress={() => {
                                            setActiviteSelectionnee(item);
                                            setNbParticipants('1');
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Image source={{ uri: `${API_BASE_URL}${item.image_url}` }} style={styles.modalItemImage} resizeMode="cover" />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.modalItemTitle}>{item.nom}</Text>
                                            <Text style={styles.modalItemSub}>{item.description}</Text>
                                        </View>
                                        {activiteSelectionnee?.id === item.id && (
                                            <Ionicons name="checkmark-circle" size={22} color={colors.blue} />
                                        )}
                                    </TouchableOpacity>
                                )}
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

    // Nouveaux styles pour Date
    iosPickerContainer: { alignSelf: 'flex-start', marginTop: 4, marginBottom: 8 },
    dateButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#fafafa' },
    dateButtonText: { fontSize: 15, color: colors.black },

    // Nouveaux styles pour les créneaux
    timeContainer: { marginTop: 4, paddingBottom: 8 },
    timeBadge: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fafafa', marginRight: 10 },
    timeBadgeSelected: { backgroundColor: colors.blue, borderColor: colors.blue },
    timeBadgeText: { fontSize: 15, color: colors.grey, fontWeight: '600' },
    timeBadgeTextSelected: { color: '#fff' },

    // Anciens styles conservés
    selectButton: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#fafafa' },
    selectButtonContent: { flexDirection: 'row', alignItems: 'center' },
    selectButtonImage: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
    selectButtonTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    selectButtonSub: { fontSize: 12, color: colors.grey, marginTop: 2 },
    selectButtonPlaceholder: { flex: 1, fontSize: 15, color: colors.lightGrey },
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff0f0', padding: 12, borderRadius: 10, marginTop: 8 },
    errorText: { color: colors.red, marginLeft: 8, fontSize: 13 },
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingBottom: 30 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.black },
    modalItem: { padding: 16, flexDirection: 'row', alignItems: 'center' },
    modalItemSelected: { backgroundColor: '#eef2fb' },
    modalItemImage: { width: 56, height: 56, borderRadius: 10, marginRight: 12 },
    modalItemTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    modalItemSub: { fontSize: 12, color: colors.grey, marginTop: 2, marginBottom: 8 },
});