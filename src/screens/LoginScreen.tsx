import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../types';
import { isValidEmail } from '../utils/helpers';
import { BackgroundImage } from '../components/BackgroundImage';
import { Logo } from '../components/Logo';
import { Typography } from '../components/Typography';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SocialLoginContainer } from '../components/SocialLoginButton';
import { COLORS } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  
  // Refs para navegación entre campos
  const passwordRef = useRef<TextInput>(null);

    // Navigate to Home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

    // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Error de Login', error, [
        { text: 'OK', onPress: clearAuthError }
      ]);
    }
  }, [error, clearAuthError]);

    const handleLogin = async () => {
    // Validation
    if (!dni || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      Alert.alert('Error', 'Por favor, ingresa un DNI válido (8 dígitos)');
      return;
    }

    // Clear any previous errors
    if (error) {
      clearAuthError();
    }

    // Debug logging for the specific problematic credentials
    console.log('🔐 LOGIN ATTEMPT:', {
      dni,
      passwordLength: password.length,
      hasLetters: /[a-zA-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialChars: /[^a-zA-Z0-9]/.test(password)
    });

    // Attempt login
    try {
      await login({ dni, password });
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      console.error('🚨 LOGIN FAILED for DNI:', dni);
      // Error handling is done via useEffect
    }
  };

  // Social login temporarily disabled
  // const handleSocialLogin = async (provider: 'google' | 'facebook') => {
  //   Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto');
  // };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <BackgroundImage screen="login" overlay={true} overlayOpacity={0.4}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.container}>
              {/* Botón de regreso */}
              <TouchableOpacity 
                onPress={() => navigation.navigate('Onboarding')}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={28} color={COLORS.WHITE} />
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <Logo backgroundColor="light" size="xlarge" />
                <Typography 
                  variant="h1" 
                  style={styles.title}
                  fontFamily="BarlowCondensed-Bold"
                >
                  CLUB VILLA MITRE
                </Typography>
              </View>
              
              <View style={styles.formContainer}>
                <Input
                  placeholder="Ingresá tu DNI"
                  value={dni}
                  onChangeText={setDni}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  variant="rounded"
                  size="large"
                  fontFamily="BarlowCondensed-Regular"
                  maxLength={8}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />
                
                <Input
                  ref={passwordRef}
                  placeholder="Ingresá tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  variant="rounded"
                  size="large"
                  fontFamily="BarlowCondensed-Regular"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                />
                
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.WHITE} style={styles.loader} />
                ) : (
                  <Button 
                    title="INGRESAR" 
                    onPress={handleLogin} 
                    variant="primary"
                    size="large"
                    style={styles.loginButton}
                  />
                )}

                {/* Social login temporarily disabled */}
                {/* <SocialLoginContainer
                  onGooglePress={() => handleSocialLogin('google')}
                  onFacebookPress={() => handleSocialLogin('facebook')}
                  loading={socialLoading}
                  style={styles.socialContainer}
                /> */}
                
                <TouchableOpacity style={styles.registerContainer} onPress={handleRegisterPress}>
                  <Typography style={styles.registerText}>
                    Registrarme
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: COLORS.PRIMARY_BLACK,
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: 32, // Relativo mayor basado en 85pts vs 45pts (ratio ~1.9)
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    minWidth: 200,
  },
  socialContainer: {
    marginTop: 16,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: COLORS.WHITE,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: 20,
  },
});
