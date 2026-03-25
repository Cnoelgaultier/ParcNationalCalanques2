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

export default function RegisterScreen() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prenomRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

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
    if (!nom.trim()) return 'Veuillez entrer votre nom.';
    if (!prenom.trim()) return 'Veuillez entrer votre prénom.';
    if (!email.trim()) return 'Veuillez entrer votre email.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Adresse email invalide.';
    if (!password) return 'Veuillez entrer un mot de passe.';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Trop court', color: '#ff4444', width: '20%' };
    if (password.length < 8) return { label: 'Faible', color: '#ff944d', width: '40%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Moyen', color: '#ffd700', width: '65%' };
    return { label: 'Fort', color: '#c8f135', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async () => {
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
      const response = await fetch('http://173.30.31.13:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      // Inscription réussie → retour à la page de connexion
      router.replace('/login');

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
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>✦</Text>
          </View>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez-nous en quelques secondes</Text>
        </View>

        {/* Formulaire */}
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>

          {/* Nom & Prénom côte à côte */}
          <View style={styles.row}>
            <View style={[styles.fieldWrapper, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Nom</Text>
              <View style={[styles.inputContainer, focusedField === 'nom' && styles.inputFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Dupont"
                  placeholderTextColor="#555"
                  autoCapitalize="words"
                  value={nom}
                  onChangeText={(t) => { setNom(t); setError(''); }}
                  onFocus={() => setFocusedField('nom')}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => prenomRef.current?.focus()}
                />
              </View>
            </View>

            <View style={[styles.fieldWrapper, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Prénom</Text>
              <View style={[styles.inputContainer, focusedField === 'prenom' && styles.inputFocused]}>
                <TextInput
                  ref={prenomRef}
                  style={styles.input}
                  placeholder="Jean"
                  placeholderTextColor="#555"
                  autoCapitalize="words"
                  value={prenom}
                  onChangeText={(t) => { setPrenom(t); setError(''); }}
                  onFocus={() => setFocusedField('prenom')}
                  onBlur={() => setFocusedField(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, focusedField === 'email' && styles.inputFocused]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="exemple@email.com"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
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
                onChangeText={(t) => { setPassword(t); setError(''); }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Indicateur de force */}
            {strength && (
              <View style={styles.strengthWrapper}>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
          </View>

          {/* Confirmer mot de passe */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={[
              styles.inputContainer,
              focusedField === 'confirm' && styles.inputFocused,
              confirmPassword.length > 0 && password !== confirmPassword && styles.inputError,
              confirmPassword.length > 0 && password === confirmPassword && styles.inputSuccess,
            ]}>
              <Text style={styles.inputIcon}>🔑</Text>
              <TextInput
                ref={confirmRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#555"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message d'erreur */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          {/* Bouton inscription */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0f" size="small" />
            ) : (
              <Text style={styles.registerBtnText}>Créer mon compte</Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/login')}>
            <Text style={styles.loginLinkText}>
              Déjà un compte ? <Text style={styles.loginLinkAccent}>Se connecter</Text>
            </Text>
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
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
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
    fontSize: 28,
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
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
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
  inputError: {
    borderColor: '#ff4444',
  },
  inputSuccess: {
    borderColor: '#c8f135',
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
  strengthWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: BORDER,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
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
  registerBtn: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  registerBtnText: {
    color: BG,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkAccent: {
    color: ACCENT,
    fontWeight: '700',
  },
});