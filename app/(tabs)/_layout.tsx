import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 1. Import de ton fournisseur d'authentification
// (Vérifie bien que le chemin correspond. Si tu utilises les alias comme au-dessus,
// ça pourrait aussi être '@/context/AuthContext')
import { AuthProvider } from '../context/AuthContext';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        // 2. On enveloppe toute la navigation avec le Provider
        <AuthProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="createReservation"
                    options={{
                        title: 'Réserver',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="signup"
                    options={{
                        title: "S'inscrire"
                    }}
                />
                <Tabs.Screen
                    name="login"
                    options={{
                        title: "Se connecter"
                    }}
                />
            </Tabs>
        </AuthProvider>
    );
}