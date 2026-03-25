import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext'; // On importe le cerveau ici !
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const API_BASE_URL = 'http://webngo.sio.bts:8002/';

export default function CartScreen() {
    // On récupère les items et le total depuis le CartContext
    const { items, totalPrix, removeFromCart } = useCart();

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Stack.Screen options={{ title: "Mon Panier" }} />
                <Ionicons name="cart-outline" size={80} color="#bbbbbb" />
                <Text style={styles.emptyText}>Votre panier est vide pour le moment.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Mon Panier" }} />

            <FlatList
                data={items}
                keyExtractor={(item) => item.cartKey}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image
                            source={{ uri: `${API_BASE_URL}${item.image_url}` }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{item.nom}</Text>
                            <Text style={styles.itemSubText}>📅 {item.dateAffichee} à {item.heure}</Text>
                            <Text style={styles.itemSubText}>👥 {item.nb_participants} participant(s)</Text>
                            <Text style={styles.itemPrice}>{(item.tarif * item.nb_participants).toFixed(2)} €</Text>
                        </View>
                        {/* Bouton pour supprimer du panier */}
                        <TouchableOpacity onPress={() => removeFromCart(item.cartKey)} style={{padding: 8}}>
                            <Ionicons name="trash-outline" size={24} color="#e51a2e" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <Text style={styles.totalText}>Total : {totalPrix.toFixed(2)} €</Text>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>VALIDER LA COMMANDE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    emptyText: { marginTop: 16, fontSize: 16, color: '#555' },
    listContainer: { padding: 16 },
    cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
    itemDetails: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#000', marginBottom: 4 },
    itemSubText: { fontSize: 12, color: '#555', marginBottom: 2 },
    itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#4472c4', marginTop: 4 },
    footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee' },
    totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'right' },
    checkoutButton: { backgroundColor: '#4472c4', padding: 16, borderRadius: 12, alignItems: 'center' },
    checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});