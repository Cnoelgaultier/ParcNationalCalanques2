import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import { User, registerUser } from '../api/auth/authApi';
import { useAuth } from '../context/AuthContext';

// Adapt this import to your navigation setup (React Navigation, Expo Router, etc.)
// import { useNavigation } from '@react-navigation/native';

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
}

type RegisterForm = Omit<User, 'id'>;

const INITIAL_FORM: RegisterForm = {
  email: '',
  password: '',
  nom: '',
  prenom: '',
  adresse: '',
  cp: '',
  ville: '',
  telephone: '',
};

interface FieldProps {
  label: string;
  field: keyof RegisterForm | 'confirmPassword';
  form: RegisterForm;
  confirmPassword: string;
  errors: Partial<Record<keyof RegisterForm | 'confirmPassword', string>>;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

const Field = ({
  label, field, form, confirmPassword, errors,
  onChangeText, placeholder, keyboardType = 'default',
  secureTextEntry = false, autoCapitalize = 'sentences',
}: FieldProps) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, errors[field] ? styles.inputError : null]}
      placeholder={placeholder || label}
      placeholderTextColor="#9CA3AF"
      value={field === 'confirmPassword' ? confirmPassword : form[field as keyof RegisterForm]}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
    />
    {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
  </View>
);

export default function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm | 'confirmPassword', string>>>({});

  const update = (field: keyof RegisterForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!form.prenom.trim()) newErrors.prenom = 'Prénom requis';
    if (!form.nom.trim()) newErrors.nom = 'Nom requis';
    if (!form.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!form.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (form.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }
    if (form.password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!form.adresse.trim()) newErrors.adresse = 'Adresse requise';
    if (!form.cp.trim()) newErrors.cp = 'Code postal requis';
    if (!form.ville.trim()) newErrors.ville = 'Ville requise';
    if (!form.telephone.trim()) newErrors.telephone = 'Téléphone requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login } = useAuth();

  const handleRegister = async () => {
    console.log('handleRegister appelé');
    if (!validate()) {
      console.log('validate() a échoué', errors);
      return;
    }

    console.log('validate() OK, appel API...');

    setLoading(true);
    try {
      const user = await registerUser(form);
      login(user);
      router.replace('/(tabs)');  // ← redirige vers l'accueil
    } catch (error) {
      //console.log('Erreur:', error);
      //Alert.alert('Erreur', 'Impossible de créer le compte. Réessayez.');
      console.log('Erreur complète:', JSON.stringify(error));
      console.log('Message:', (error as Error).message);
      Alert.alert('Erreur', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Remplissez vos informations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identité</Text>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Field
                label="Prénom"
                field="prenom"
                form={form}
                confirmPassword={confirmPassword}
                errors={errors}
                onChangeText={update('prenom')}
                autoCapitalize="words"
              />
              </View>
              <View style={styles.spacer} />
              <View style={styles.flex}>
              <Field
                label="Nom"
                field="nom"
                form={form}
                confirmPassword={confirmPassword}
                errors={errors}
                onChangeText={update('nom')}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connexion</Text>
          <Field label="Email" field="email" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('email')} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Mot de passe" field="password" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('password')} secureTextEntry autoCapitalize="none" />
          <Field label="Confirmer le mot de passe" field="confirmPassword" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={(v) => { setConfirmPassword(v); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined })); }} secureTextEntry autoCapitalize="none" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse</Text>
          <Field label="Adresse" field="adresse" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('adresse')} />
          <View style={styles.row}>
            <View style={{ width: 110 }}>
              <Field label="Code postal" field="cp" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('cp')} keyboardType="numeric" />
            </View>
            <View style={styles.spacer} />
            <View style={styles.flex}>
              <Field label="Ville" field="ville" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('ville')} autoCapitalize="words" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Field label="Téléphone" field="telephone" form={form} confirmPassword={confirmPassword} errors={errors} onChangeText={update('telephone')} keyboardType="phone-pad" />
        </View>

        <Pressable
          onPress={handleRegister}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Créer mon compte</Text>
          )}
        </Pressable>

        <TouchableOpacity onPress={onNavigateToLogin} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>
            Déjà un compte ? <Text style={styles.loginLinkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
    marginTop: 16,
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
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  spacer: {
    width: 12,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
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
    marginTop: 8,
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
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkBold: {
    color: '#4472c4',
    fontWeight: '600',
  },
});