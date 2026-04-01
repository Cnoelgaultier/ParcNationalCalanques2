import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { User, loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

// Adapt this import to your navigation setup (React Navigation, Expo Router, etc.)
// import { useNavigation } from '@react-navigation/native';

interface LoginScreenProps {
    onNavigateToRegister?: () => void;
    onLoginSuccess?: (user: User) => void;
}

export default function LoginScreen({ onNavigateToRegister, onLoginSuccess }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email invalide';
        }
        if (!password) {
            newErrors.password = 'Mot de passe requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { login } = useAuth();

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const user = await loginUser(email, password); // ton API
            login(user);
            router.replace('/(tabs)');  // ← redirige vers l'accueil
        } catch (error) {
            Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
    <Text style={styles.title}>Connectez-vous à votre compte</Text>
    </View>

    {/* Form */}
    <View style={styles.form}>
    <View style={styles.fieldContainer}>
    <Text style={styles.label}>Email</Text>
        <TextInput
    style={[styles.input, errors.email ? styles.inputError : null]}
    placeholder="votre@email.com"
    placeholderTextColor="#9CA3AF"
    value={email}
    onChangeText={(v) => {
        setEmail(v);
        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    }}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    />
    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.fieldContainer}>
    <View style={styles.labelRow}>
    <Text style={styles.label}>Mot de passe</Text>
    <TouchableOpacity>
    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        </View>
        <TextInput
        style={[styles.input, errors.password ? styles.inputError : null]}
        placeholder="••••••••"
        placeholderTextColor="#9CA3AF"
        value={password}
        onChangeText={(v) => {
        setPassword(v);
        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
    }}
        secureTextEntry
        autoCapitalize="none"
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>
                        </View>

                    {/* Button */}
                    <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
            >
            {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
    )}
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity onPress={onNavigateToRegister} style={styles.registerLink}>
    <Text style={styles.registerLinkText}>
        Pas encore de compte ? <Text style={styles.registerLinkBold}>S'inscrire</Text>
        </Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
    }

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#F9FAFB',
            },
            inner: {
                flex: 1,
                paddingHorizontal: 28,
                justifyContent: 'center',
            },
            header: {
                alignItems: 'center',
                marginBottom: 40,
            },
            logoCircle: {
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: '#4472c4',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: '#4472c4',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 6,
            },
            logoText: {
                color: '#fff',
                fontSize: 28,
                fontWeight: '700',
            },
            title: {
                fontSize: 28,
                fontWeight: '700',
                color: '#111827',
                letterSpacing: -0.5,
            },
            subtitle: {
                fontSize: 15,
                color: '#6B7280',
                marginTop: 6,
            },
            form: {
                marginBottom: 24,
            },
            fieldContainer: {
                marginBottom: 16,
            },
            labelRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
            },
            label: {
                fontSize: 13,
                fontWeight: '500',
                color: '#374151',
                marginBottom: 6,
            },
            forgotText: {
                fontSize: 13,
                color: '#4472c4',
                fontWeight: '500',
            },
            input: {
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: '#111827',
            },
            inputError: {
                borderColor: '#EF4444',
                backgroundColor: '#FEF2F2',
            },
            errorText: {
                color: '#EF4444',
                fontSize: 12,
                marginTop: 4,
            },
            button: {
                backgroundColor: '#4472c4',
                borderRadius: 12,
                paddingVertical: 15,
                alignItems: 'center',
                shadowColor: '#4472c4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
            },
            buttonDisabled: {
                opacity: 0.7,
            },
            buttonText: {
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: 0.2,
            },
            registerLink: {
                marginTop: 24,
                alignItems: 'center',
            },
            registerLinkText: {
                fontSize: 14,
                color: '#6B7280',
            },
            registerLinkBold: {
                color: '#4472c4',
                fontWeight: '600',
            },
        });