import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    StyleSheet, ActivityIndicator, Modal, FlatList, Image
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useActivites, formatDuree, Activite } from '../api/reservation/createReservationApi';

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
    const [date, setDate] = useState('');
    const [nbParticipants, setNbParticipants] = useState('1');
    const [heure, setHeure] = useState('');
    const [activiteSelectionnee, setActiviteSelectionnee] = useState<Activite | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: activites, isLoading, isError } = useActivites();

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

                {/* Sélection de l'activité */}
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

                {/* Détails de l'activité sélectionnée */}
                {activiteSelectionnee && (
                    <>
                        <View style={styles.card}>
                            {/* Image principale */}
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

                        <Text style={styles.label}>Sélectionner une date</Text>
                        <TextInput
                            placeholder="JJ/MM/AAAA"
                            value={date}
                            onChangeText={setDate}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Sélectionner une heure</Text>
                        <TextInput
                            placeholder="Ex: 14:00"
                            value={heure}
                            onChangeText={setHeure}
                            style={styles.input}
                        />

                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color={colors.lightGreen} />
                            <Text style={styles.infoText}>14 places restantes (Quota respecté)</Text>
                        </View>

                        <Text style={styles.label}>Nombre de participants</Text>
                        <View style={styles.counter}>
                            <TouchableOpacity
                                onPress={() => setNbParticipants(Math.max(1, parseInt(nbParticipants) - 1).toString())}
                                style={styles.counterBtn}
                            >
                                <Text style={styles.counterBtnText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                keyboardType="numeric"
                                value={nbParticipants}
                                onChangeText={setNbParticipants}
                                style={styles.counterInput}
                            />
                            <TouchableOpacity
                                onPress={() => setNbParticipants((parseInt(nbParticipants) + 1).toString())}
                                style={styles.counterBtn}
                            >
                                <Text style={styles.counterBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>Total estimé</Text>
                            <Text style={styles.totalAmount}>
                                {(activiteSelectionnee.tarif * parseInt(nbParticipants || '1')).toFixed(2)} €
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cartButton}
                            onPress={() => alert(`"${activiteSelectionnee.nom}" ajouté au panier !`)}
                        >
                            <Ionicons name="cart-outline" size={24} color="white" />
                            <Text style={styles.cartButtonText}>AJOUTER AU PANIER</Text>
                        </TouchableOpacity>
                    </>
                )}

                <Text style={styles.footer}>Application Mobile · NGO · BTSSIO Jean Rostand</Text>

            </ScrollView>

            {/* Modal liste des activités */}
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
    infoText: { color: colors.lightGreen, fontWeight: '600', marginLeft: 8, fontSize: 13 },
    counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', overflow: 'hidden' },
    counterBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    counterBtnText: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    counterInput: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: colors.black },
    totalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4ff', borderRadius: 14, padding: 16, marginTop: 16 },
    totalLabel: { fontSize: 15, color: colors.grey, fontWeight: '500' },
    totalAmount: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    cartButton: { backgroundColor: colors.red, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
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
    modalItemRow: { flexDirection: 'row', gap: 8 },
    modalItemBadge: { fontSize: 12, fontWeight: '600', backgroundColor: '#f0f0f0', color: colors.grey, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
});