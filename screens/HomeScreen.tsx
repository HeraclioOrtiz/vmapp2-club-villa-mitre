import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import MisActividadesScreen from './MisActividadesScreen';
import MisBeneficiosScreen from './MisBeneficiosScreen';
import MisCuponesScreen from './MisCuponesScreen';
import MisPuntosScreen from './MisPuntosScreen';
import MiCarnetScreen from './MiCarnetScreen';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Mis Actividades"
        icon={() => <Ionicons name="list-outline" size={22} />}
        onPress={() => props.navigation.navigate('MisActividades')}
      />
      <DrawerItem
        label="Mis Beneficios"
        icon={() => <Ionicons name="gift-outline" size={22} />}
        onPress={() => props.navigation.navigate('MisBeneficios')}
      />
      <DrawerItem
        label="Mis Cupones"
        icon={() => <Ionicons name="ticket-outline" size={22} />}
        onPress={() => props.navigation.navigate('MisCupones')}
      />
      <DrawerItem
        label="Mis Puntos"
        icon={() => <Ionicons name="star-outline" size={22} />}
        onPress={() => props.navigation.navigate('MisPuntos')}
      />
      <DrawerItem
        label="Mi Carnet"
        icon={() => <Ionicons name="card-outline" size={22} />}
        onPress={() => props.navigation.navigate('MiCarnet')}
      />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator principal
export default function HomeScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="MisActividades"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true }} // Puedes ocultar o mostrar el header
    >
      <Drawer.Screen name="MisActividades" component={MisActividadesScreen} />
      <Drawer.Screen name="MisBeneficios" component={MisBeneficiosScreen} />
      <Drawer.Screen name="MisCupones" component={MisCuponesScreen} />
      <Drawer.Screen name="MisPuntos" component={MisPuntosScreen} />
      <Drawer.Screen name="MiCarnet" component={MiCarnetScreen} />
    </Drawer.Navigator>
  );
}
