import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { globalStyles, colors } from '../styles/globalStyles';

export default function HomeScreen() {
  return (
      <ScrollView style={globalStyles.idxContainer} contentContainerStyle={globalStyles.scrollContent}>

        {/* En-tête bleu (déjà dans globalStyles) */}
        <View style={globalStyles.headerBlue}>
          <Text style={globalStyles.headerBlueTitle}>Parc National{'\n'}des Calanques</Text>
          <Text style={globalStyles.headerBlueSubtitle}>Marseille · Cassis · La Ciotat</Text>
        </View>

        {/* Carte de Bienvenue spécifique à l'accueil */}
        <View style={globalStyles.idxWelcomeCard}>
          <Ionicons name="leaf-outline" size={32} color={colors.blue} />
          <Text style={globalStyles.idxWelcomeTitle}>Bienvenue</Text>
          <Text style={globalStyles.idxWelcomeText}>
            Explorez les plus belles calanques de la Méditerranée. Réservez vos activités directement depuis l'application.
          </Text>
        </View>

        <Text style={globalStyles.sectionTitle}>Activités disponibles</Text>

        {/* Petites cartes d'activités (utilisent rowCard de globalStyles) */}
        <Link href="/createReservation" asChild>
          <TouchableOpacity style={globalStyles.rowCard} activeOpacity={0.8}>
            <View style={globalStyles.rowCardIcon}>
              <Ionicons name="boat-outline" size={28} color={colors.blue} />
            </View>
            <View style={globalStyles.idxActivityInfo}>
              <Text style={globalStyles.idxActivityTitle}>Excursion en bateau</Text>
              <Text style={globalStyles.idxActivityDesc}>Départ Vieux-Port · 2h · 20€</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={globalStyles.rowCard} activeOpacity={0.8}>
          <View style={globalStyles.rowCardIcon}>
            <Ionicons name="walk-outline" size={28} color={colors.blue} />
          </View>
          <View style={globalStyles.idxActivityInfo}>
            <Text style={globalStyles.idxActivityTitle}>Randonnée guidée</Text>
            <Text style={globalStyles.idxActivityDesc}>Calanque de Morgiou · 3h · 15€</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.rowCard} activeOpacity={0.8}>
          <View style={globalStyles.rowCardIcon}>
            <Ionicons name="fish-outline" size={28} color={colors.blue} />
          </View>
          <View style={globalStyles.idxActivityInfo}>
            <Text style={globalStyles.idxActivityTitle}>Plongée sous-marine</Text>
            <Text style={globalStyles.idxActivityDesc}>Calanque de Sugiton · 2h30 · 45€</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
        </TouchableOpacity>

        {/* Bouton réserver principal (identique partout) */}
        <Link href="/createReservation" asChild>
          <TouchableOpacity style={globalStyles.primaryButton} activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={22} color={colors.white} />
            <Text style={globalStyles.primaryButtonText}>FAIRE UNE RÉSERVATION</Text>
          </TouchableOpacity>
        </Link>

        <Text style={globalStyles.footer}>
          Application Mobile · NGO · BTSSIO Jean Rostand
        </Text>

      </ScrollView>
  );
}
