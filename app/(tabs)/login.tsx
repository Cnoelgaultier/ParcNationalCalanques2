import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const passwordRef = useRef<TextInput>(null);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    if (!email.trim()) return 'Veuillez entrer votre email.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Adresse email invalide.';
    if (!password) return 'Veuillez entrer votre mot de passe.';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    return null;
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      shake();
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Remplace cette URL par celle de ton backend
      const response = await fetch('http://192.168.1.X:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Identifiants incorrects.');
      }

      // Connexion réussie → redirige vers les tabs
      router.replace('/(tabs)');

    } catch (err: any) {
      setError(err.message);
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.title}>Bon retour 👋</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
        </View>

        {/* Formulaire */}
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, focusedField === 'email' && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => { setEmail(text); setError(''); }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={[styles.inputContainer, focusedField === 'password' && styles.inputFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => { setPassword(text); setError(''); }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message d'erreur */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          {/* Mot de passe oublié */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton connexion */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0f" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Séparateur */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Bouton inscription */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerBtnText}>Créer un compte</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ACCENT = '#c8f135';
const BG = '#0a0a0f';
const CARD = '#13131a';
const BORDER = '#2a2a35';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: BG,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#aaa',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 14,
    height: 54,
  },
  inputFocused: {
    borderColor: ACCENT,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorBox: {
    backgroundColor: '#2a1010',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#5a1a1a',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontWeight: '500',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: BG,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  separatorText: {
    color: '#444',
    fontSize: 13,
    marginHorizontal: 12,
  },
  registerBtn: {
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});