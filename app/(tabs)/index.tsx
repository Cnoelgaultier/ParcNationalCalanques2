import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const colors = {
  red: '#e51a2e',
  blue: '#4472c4',
  black: '#000000',
  grey: '#555555',
  lightGrey: '#bbbbbb',
  bgLight: '#f5f5f5',
};

export default function HomeScreen() {
  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Parc National{'\n'}des Calanques</Text>
          <Text style={styles.headerSubtitle}>Marseille · Cassis · La Ciotat</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="leaf-outline" size={32} color={colors.blue} />
          <Text style={styles.cardTitle}>Bienvenue</Text>
          <Text style={styles.cardText}>
            Explorez les plus belles calanques de la Méditerranée. Réservez vos activités directement depuis l'application.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Activités disponibles</Text>

        <Link href="/createReservation" asChild>
          <TouchableOpacity style={styles.activityCard} activeOpacity={0.8}>
            <View style={styles.activityIcon}>
              <Ionicons name="boat-outline" size={28} color={colors.blue} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Excursion en bateau</Text>
              <Text style={styles.activityDesc}>Départ Vieux-Port · 2h · 20€</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.activityCard} activeOpacity={0.8}>
          <View style={styles.activityIcon}>
            <Ionicons name="walk-outline" size={28} color={colors.blue} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Randonnée guidée</Text>
            <Text style={styles.activityDesc}>Calanque de Morgiou · 3h · 15€</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.activityCard} activeOpacity={0.8}>
          <View style={styles.activityIcon}>
            <Ionicons name="fish-outline" size={28} color={colors.blue} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Plongée sous-marine</Text>
            <Text style={styles.activityDesc}>Calanque de Sugiton · 2h30 · 45€</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
        </TouchableOpacity>

        {/* Bouton réserver */}
        <Link href="/createReservation" asChild>
          <TouchableOpacity style={styles.reserveButton} activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={22} color="white" />
            <Text style={styles.reserveButtonText}>FAIRE UNE RÉSERVATION</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.footer}>
          Application Mobile · NGO · BTSSIO Jean Rostand
        </Text>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 10,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#eef2fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  activityDesc: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 2,
  },
  reserveButton: {
    backgroundColor: colors.red,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.lightGrey,
    marginTop: 8,
  },
});