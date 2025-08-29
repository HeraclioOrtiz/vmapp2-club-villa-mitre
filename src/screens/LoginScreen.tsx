import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../types';
import { isValidEmail } from '../utils/helpers';
import { COLORS } from '../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();

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
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido');
      return;
    }

    // Attempt login
    try {
      await login({ email, password });
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error handling is done via useEffect
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} color={COLORS.PRIMARY} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});
