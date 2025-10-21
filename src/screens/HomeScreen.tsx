import React from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../components/Logo';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

import HomeMainScreen from './HomeMainScreen';
import ActividadesScreen from './ActividadesScreen';
import CentroDeportivoScreen from './CentroDeportivoScreen';
import AreasInstitucionalesScreen from './AreasInstitucionalesScreen';
import ServiciosScreen from './ServiciosScreen';
import MisPuntosScreen from './MisPuntosScreen';
import MisBeneficiosScreen from './MisBeneficiosScreen';
import EstadoDeCuentaScreen from './EstadoDeCuentaScreen';
import MiCarnetScreen from './MiCarnetScreen';
import QRBeneficioScreen from './QRBeneficioScreen';
import { 
  DailyWorkoutScreen, 
  TemplatesListScreen, 
  GymDashboardScreen, 
  WeeklyCalendarScreen,
  ActiveWorkoutScreen,
  WorkoutSummaryScreen 
} from './gym';

// 👇 Importá tu pantalla de cupones (ajustá la ruta si hace falta)
import MisCuponesScreen from './MisCuponesScreen';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
function CustomDrawerContent(props: any) {
  const { logout, user } = useAuth();

  // Función para verificar si el usuario tiene acceso a una funcionalidad
  const hasAccess = (feature: string): boolean => {
    if (!user) return false;
    const userType = user.user_type;

    switch (feature) {
      case 'home':
        return true; // Todos tienen acceso a Home
      case 'actividades_deportivas':
      case 'centro_deportivo':
      case 'areas_institucionales':
      case 'servicios':
        return true; // Usuarios locales y API pueden acceder
      case 'beneficios':
        return true; // Usuarios locales y API pueden acceder
      case 'mis_puntos':
      case 'carnet':
      case 'estado_cuenta':
        return userType === 'api'; // Solo usuarios API
      case 'actividades':
        return false; // Temporalmente deshabilitado
      case 'cupones':
        return true; // ✅ Habilitado para locales y API
      default:
        return true;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              props.navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
              );
            } catch {
              Alert.alert('Error', 'No se pudo cerrar la sesión correctamente');
            }
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Home - Disponible para todos */}
      {hasAccess('home') && (
        <DrawerItem
          label="Home"
          icon={() => <Ionicons name="home-outline" size={22} />}
          onPress={() => props.navigation.navigate('HomeMain')}
        />
      )}

      {/* Actividades Deportivas */}
      {hasAccess('actividades_deportivas') && (
        <DrawerItem
          label="Actividades Deportivas"
          icon={() => <Ionicons name="basketball-outline" size={22} />}
          onPress={() => props.navigation.navigate('Actividades')}
        />
      )}

      {/* Centro Deportivo */}
      {hasAccess('centro_deportivo') && (
        <DrawerItem
          label="Centro Deportivo"
          icon={() => <Ionicons name="fitness-outline" size={22} />}
          onPress={() => props.navigation.navigate('CentroDeportivo')}
        />
      )}

      {/* Áreas Institucionales */}
      {hasAccess('areas_institucionales') && (
        <DrawerItem
          label="Áreas Institucionales"
          icon={() => <Ionicons name="business-outline" size={22} />}
          onPress={() => props.navigation.navigate('AreasInstitucionales')}
        />
      )}

      {/* Servicios */}
      {hasAccess('servicios') && (
        <DrawerItem
          label="Servicios"
          icon={() => <Ionicons name="grid-outline" size={22} />}
          onPress={() => props.navigation.navigate('Servicios')}
        />
      )}

      {/* Mis Puntos */}
      {hasAccess('mis_puntos') && (
        <DrawerItem
          label="Mis Puntos"
          icon={() => <Ionicons name="star-outline" size={22} />}
          onPress={() => props.navigation.navigate('MisPuntos')}
        />
      )}

      {/* ✅ Mis Cupones */}
      {hasAccess('cupones') && (
        <DrawerItem
          label="Mis Cupones"
          icon={() => <Ionicons name="pricetags-outline" size={22} />}
          onPress={() => props.navigation.navigate('MisCupones')}
        />
      )}

      {/* Cerrar Sesión - Disponible para todos */}
      <DrawerItem
        label="Cerrar Sesión"
        icon={() => <Ionicons name="log-out-outline" size={22} color="#FF4444" />}
        labelStyle={{ color: '#FF4444' }}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator principal
export default function HomeScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeMain"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({ 
        headerShown: true,
        headerStyle: { backgroundColor: '#00973D', height: 110 },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'BarlowCondensed-Bold',
          fontWeight: '700',
          fontSize: 20,
          letterSpacing: 1.2,
          marginLeft: 0,
          textAlign: 'center',
          textTransform: 'uppercase',
          color: '#FFFFFF',
        },
        headerTitle: 'CLUB VILLA MITRE',
        headerRight: () => (
          <TouchableOpacity 
            style={{ paddingRight: 20, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('HomeMain')}
            activeOpacity={0.7}
          >
            <Logo backgroundColor="light" size="medium" style={{ width: 45, height: 45 }} />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen 
        name="HomeMain" 
        component={HomeMainScreen}
        options={{ headerTitle: 'CLUB VILLA MITRE' }}
      />
      <Drawer.Screen name="Actividades" component={ActividadesScreen} />
      <Drawer.Screen name="CentroDeportivo" component={CentroDeportivoScreen} />
      <Drawer.Screen name="AreasInstitucionales" component={AreasInstitucionalesScreen} />
      <Drawer.Screen name="Servicios" component={ServiciosScreen} />
      <Drawer.Screen name="MisPuntos" component={MisPuntosScreen} />

      {/* New Gym Screens */}
      <Drawer.Screen 
        name="GymDashboard" 
        component={GymDashboardScreen}
        options={{ headerTitle: 'DASHBOARD GYM' }}
      />
      <Drawer.Screen 
        name="TemplatesList" 
        component={TemplatesListScreen}
        options={{ headerTitle: 'MIS PLANTILLAS' }}
      />
      <Drawer.Screen 
        name="DailyWorkout" 
        component={DailyWorkoutScreen}
        options={{ headerTitle: 'ENTRENAMIENTO' }}
      />
      <Drawer.Screen 
        name="WeeklyCalendar" 
        component={WeeklyCalendarScreen}
        options={{ headerTitle: 'CALENDARIO SEMANAL' }}
      />

      {/* Entrenamiento activo */}
      <Drawer.Screen 
        name="ActiveWorkout" 
        component={ActiveWorkoutScreen}
        options={{ headerTitle: 'ENTRENAMIENTO ACTIVO', headerShown: false }}
      />
      <Drawer.Screen 
        name="WorkoutSummary" 
        component={WorkoutSummaryScreen}
        options={{ headerTitle: 'RESUMEN', headerShown: false }}
      />

      <Drawer.Screen name="QRBeneficio" component={QRBeneficioScreen} />
      <Drawer.Screen name="MisBeneficios" component={MisBeneficiosScreen} />
      <Drawer.Screen name="EstadoDeCuenta" component={EstadoDeCuentaScreen} />
      <Drawer.Screen name="MiCarnet" component={MiCarnetScreen} />

      {/* ✅ Nueva ruta: Mis Cupones */}
      <Drawer.Screen 
        name="MisCupones" 
        component={MisCuponesScreen}
        options={{ headerTitle: 'MIS CUPONES' }}
      />
    </Drawer.Navigator>
  );
}
