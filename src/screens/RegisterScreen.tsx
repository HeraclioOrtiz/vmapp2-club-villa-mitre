import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { theme } from '../styles/theme';
import { RegisterRequest } from '../types';
import { useAuth } from '../hooks/useAuth';

interface FormErrors {
  dni?: string;
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    dni: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Refs para navegación entre campos
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateField = (field: keyof RegisterRequest, value: string): string | undefined => {
    switch (field) {
      case 'dni':
        if (!value) return 'El DNI es requerido';
        if (!/^\d{8}$/.test(value)) return 'El DNI debe tener 8 dígitos';
        return undefined;
      case 'name':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return undefined;
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return undefined;
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'Debe contener al menos una mayúscula';
        if (!/[a-z]/.test(value)) return 'Debe contener al menos una minúscula';
        if (!/[0-9]/.test(value)) return 'Debe contener al menos un número';
        return undefined;
      case 'password_confirmation':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return undefined;
      case 'phone':
        if (value && !/^\+?[\d\s\-()]+$/.test(value)) return 'Teléfono inválido';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const field = key as keyof RegisterRequest;
      const error = validateField(field, formData[field] || '');
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 REGISTRO: Iniciando registro con datos:', formData);
      const result = await register(formData);
      
      console.log('📡 REGISTRO: Respuesta completa del servidor:', JSON.stringify(result, null, 2));
      console.log('📊 REGISTRO: Estado de la petición:', result.meta.requestStatus);
      
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('✅ REGISTRO: Registro exitoso');
        console.log('👤 REGISTRO: Datos del usuario recibidos:', JSON.stringify(result.payload, null, 2));
        
        // Registration successful, user is automatically logged in
        // Navigate to Home as the user now has a token
        Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada exitosamente', [
          { text: 'OK', onPress: () => {
            console.log('🏠 REGISTRO: Navegando a Home screen');
            navigation.navigate('Home');
          }}
        ]);
      } else {
        console.log('❌ REGISTRO: Registro falló');
        console.log('🔍 REGISTRO: Error payload:', result.payload);
        console.log('🔍 REGISTRO: Error type:', typeof result.payload);
        
        // Try to show specific error message
        const errorMessage = typeof result.payload === 'string' 
          ? result.payload 
          : 'No se pudo crear la cuenta. Por favor, verifica los datos e intenta nuevamente.';
        
        Alert.alert('Error de Registro', errorMessage);
      }
    } catch (error) {
      console.error('💥 REGISTRO: Error en el proceso de registro:', error);
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Social login temporarily disabled
  // const handleSocialLogin = (provider: 'google' | 'facebook') => {
  //   Alert.alert('Próximamente', `Login con ${provider} estará disponible pronto`);
  // };

  const renderInput = (
    field: keyof RegisterRequest,
    placeholder: string,
    icon: string,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
      maxLength?: number;
      showToggle?: boolean;
      showState?: boolean;
      onToggle?: () => void;
      ref?: React.RefObject<TextInput | null>;
      returnKeyType?: 'next' | 'done' | 'go';
      onSubmitEditing?: () => void;
    }
  ) => {
    const hasError = !!errors[field];
    const isFocused = focusedField === field;
    const hasValue = !!formData[field];

    return (
      <View style={styles.inputContainer}>
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}>
          <Ionicons 
            name={icon as any} 
            size={18} 
            color={hasError ? COLORS.ERROR : isFocused ? COLORS.PRIMARY_GREEN : COLORS.GRAY_MEDIUM} 
            style={styles.inputIcon}
          />
          <TextInput
            ref={options?.ref}
            style={[styles.input, hasValue && styles.inputWithValue]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.GRAY_MEDIUM}
            value={formData[field] || ''}
            onChangeText={(value) => handleInputChange(field, value)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={options?.secureTextEntry && !options?.showState}
            keyboardType={options?.keyboardType || 'default'}
            maxLength={options?.maxLength}
            editable={true}
            selectTextOnFocus={true}
            showSoftInputOnFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={options?.returnKeyType === 'done'}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            spellCheck={false}
            keyboardAppearance="light"
            returnKeyType={options?.returnKeyType || 'next'}
            onSubmitEditing={options?.onSubmitEditing}
            enablesReturnKeyAutomatically={true}
          />
          {options?.showToggle && (
            <TouchableOpacity onPress={options.onToggle} style={styles.toggleButton}>
              <Ionicons 
                name={options.showState ? 'eye-outline' : 'eye-off-outline'} 
                size={18} 
                color={COLORS.GRAY_MEDIUM} 
              />
            </TouchableOpacity>
          )}
        </View>
        {hasError && (
          <Animated.View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={COLORS.ERROR} />
            <Text style={styles.errorText}>{errors[field]}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Onboarding')}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Únete al Club Villa Mitre y disfruta de todos los beneficios
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {renderInput('dni', 'DNI (sin puntos)', 'card-outline', {
                keyboardType: 'numeric',
                maxLength: 8,
                returnKeyType: 'next',
                onSubmitEditing: () => nameRef.current?.focus()
              })}

              {renderInput('name', 'Nombre completo', 'person-outline', {
                keyboardType: 'default',
                ref: nameRef,
                returnKeyType: 'next',
                onSubmitEditing: () => emailRef.current?.focus()
              })}

              {renderInput('email', 'Email', 'mail-outline', {
                keyboardType: 'email-address',
                ref: emailRef,
                returnKeyType: 'next',
                onSubmitEditing: () => phoneRef.current?.focus()
              })}

              {renderInput('phone', 'Teléfono (opcional)', 'call-outline', {
                keyboardType: 'phone-pad',
                ref: phoneRef,
                returnKeyType: 'next',
                onSubmitEditing: () => passwordRef.current?.focus()
              })}

              {renderInput('password', 'Contraseña', 'lock-closed-outline', {
                secureTextEntry: true,
                showToggle: true,
                showState: showPassword,
                onToggle: () => setShowPassword(!showPassword),
                ref: passwordRef,
                returnKeyType: 'next',
                onSubmitEditing: () => confirmPasswordRef.current?.focus()
              })}
              
              {/* Password Requirements - Always Visible */}
              <View style={styles.passwordRequirements}>
                <View style={styles.requirementsHeader}>
                  <Ionicons name="information-circle-outline" size={18} color={COLORS.PRIMARY_GREEN} />
                  <Text style={styles.requirementsTitle}>Requisitos de la contraseña:</Text>
                </View>
                
                <View style={styles.requirementsList}>
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={formData.password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                      size={18} 
                      color={formData.password.length >= 8 ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY} 
                    />
                    <Text style={[
                      styles.requirementText,
                      formData.password.length >= 8 && styles.requirementValid
                    ]}>
                      Mínimo 8 caracteres
                    </Text>
                  </View>
                  
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[A-Z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={18} 
                      color={/[A-Z]/.test(formData.password) ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[A-Z]/.test(formData.password) && styles.requirementValid
                    ]}>
                      Una letra mayúscula (A-Z)
                    </Text>
                  </View>
                  
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[a-z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={18} 
                      color={/[a-z]/.test(formData.password) ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[a-z]/.test(formData.password) && styles.requirementValid
                    ]}>
                      Una letra minúscula (a-z)
                    </Text>
                  </View>
                  
                  <View style={styles.requirementItem}>
                    <Ionicons 
                      name={/[0-9]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                      size={18} 
                      color={/[0-9]/.test(formData.password) ? COLORS.SUCCESS : COLORS.TEXT_SECONDARY} 
                    />
                    <Text style={[
                      styles.requirementText,
                      /[0-9]/.test(formData.password) && styles.requirementValid
                    ]}>
                      Un número (0-9)
                    </Text>
                  </View>
                </View>
              </View>

              {renderInput('password_confirmation', 'Confirmar contraseña', 'lock-closed-outline', {
                secureTextEntry: true,
                showToggle: true,
                showState: showConfirmPassword,
                onToggle: () => setShowConfirmPassword(!showConfirmPassword),
                ref: confirmPasswordRef,
                returnKeyType: 'done',
                onSubmitEditing: handleSubmit
              })}
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <Text style={styles.submitButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            {/* Divider and Social Login temporarily disabled */}

            {/* Login Link */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkButton}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: theme.container,
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.GRAY_LIGHTER,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 14,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 18,
    height: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: COLORS.PRIMARY_GREEN,
    borderWidth: 2,
    shadowColor: COLORS.PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: COLORS.ERROR,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 0,
  },
  inputWithValue: {
    fontWeight: '500',
  },
  toggleButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    marginLeft: 6,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 16,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: COLORS.PRIMARY_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'column',
    marginBottom: 32,
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 16,
    height: 54,
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButton: {
    borderColor: '#E8F0FE',
    backgroundColor: '#FAFBFF',
  },
  facebookButton: {
    borderColor: '#E7F3FF',
    backgroundColor: '#F8FBFF',
  },
  socialIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  loginLinkText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  loginLinkButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_GREEN,
  },
  // Password Requirements styles
  passwordRequirements: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_GREEN + '20',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY_GREEN,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 4,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  requirementValid: {
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
});
