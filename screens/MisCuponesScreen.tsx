import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import DetalleCuponScreen from "./DetalleCuponScreen";

type Cupon = {
  id: string;
  titulo: string;
  descripcion: string;
  validoHasta: string;
  categoria: string;
  imagenUrl: string;
};

// 20 cupones de ejemplo
const cupones: Cupon[] = [
  { id: '1', titulo: '10% Off Restaurante', descripcion: 'Descuento en comidas', validoHasta: '2025-12-31', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1011/200/120' },
  { id: '2', titulo: '2x1 Cine', descripcion: 'Entradas dobles', validoHasta: '2025-10-15', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1020/200/120' },
  { id: '3', titulo: '50% Off Ropa', descripcion: 'Descuento en moda', validoHasta: '2025-11-20', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1030/200/120' },
  { id: '4', titulo: 'Descuento Pizzería', descripcion: '20% en pizzas', validoHasta: '2025-09-30', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1012/200/120' },
  { id: '5', titulo: 'Combo Cine', descripcion: 'Palomitas + Entrada', validoHasta: '2025-10-20', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1021/200/120' },
  { id: '6', titulo: 'Jeans 30% Off', descripcion: 'Ropa de moda', validoHasta: '2025-11-15', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1031/200/120' },
  { id: '7', titulo: 'Hamburguesa Gratis', descripcion: 'Con bebida incluida', validoHasta: '2025-12-10', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1013/200/120' },
  { id: '8', titulo: 'Entradas Teatro', descripcion: '2x1 funciones', validoHasta: '2025-10-25', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1022/200/120' },
  { id: '9', titulo: 'Camisetas 40% Off', descripcion: 'Ropa deportiva', validoHasta: '2025-11-10', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1032/200/120' },
  { id: '10', titulo: 'Helado Gratis', descripcion: '1 porción', validoHasta: '2025-09-20', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1014/200/120' },
  { id: '11', titulo: 'Concierto 2x1', descripcion: 'Entradas dobles', validoHasta: '2025-10-05', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1023/200/120' },
  { id: '12', titulo: 'Zapatos 25% Off', descripcion: 'Descuento en calzado', validoHasta: '2025-11-05', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1033/200/120' },
  { id: '13', titulo: 'Café Gratis', descripcion: '1 taza al día', validoHasta: '2025-12-01', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1015/200/120' },
  { id: '14', titulo: 'Parque de Diversiones', descripcion: '2x1 entradas', validoHasta: '2025-10-30', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1024/200/120' },
  { id: '15', titulo: 'Accesorios 50% Off', descripcion: 'Relojes y bolsos', validoHasta: '2025-11-25', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1034/200/120' },
  { id: '16', titulo: 'Pizza Gratis', descripcion: 'Solo para socios', validoHasta: '2025-12-15', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1016/200/120' },
  { id: '17', titulo: 'Entradas Cine', descripcion: '3x2 promociones', validoHasta: '2025-10-28', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1025/200/120' },
  { id: '18', titulo: 'Chaquetas 35% Off', descripcion: 'Ropa de invierno', validoHasta: '2025-11-30', categoria: 'Moda', imagenUrl: 'https://picsum.photos/id/1035/200/120' },
  { id: '19', titulo: 'Descuento Café', descripcion: '2x1 bebidas', validoHasta: '2025-12-05', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1017/200/120' },
  { id: '20', titulo: 'Concierto Rock', descripcion: 'Entradas 30% Off', validoHasta: '2025-10-18', categoria: 'Entretenimiento', imagenUrl: 'https://picsum.photos/id/1026/200/120' },
];

const categorias = ['Alimentos', 'Entretenimiento', 'Moda'];

// Componente que muestra loader mientras carga la imagen
const ImageWithLoader: React.FC<{ uri: string; style: any }> = ({ uri, style }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      {loading && <ActivityIndicator size="small" color="#4CAF50" style={{ position: 'absolute' }} />}
      <Image
        source={{ uri }}
        style={style}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

const CuponCard: React.FC<{ cupon: Cupon }> = ({ cupon }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.cuponCard}
      onPress={() => navigation.navigate("DetalleCupon", { cupon })}
    >
      <ImageWithLoader uri={cupon.imagenUrl} style={styles.cuponImage} />
      <View style={styles.cuponInfo}>
        <Text style={styles.titulo}>{cupon.titulo}</Text>
        <Text style={styles.descripcion}>{cupon.descripcion}</Text>
        <Text style={styles.valido}>Válido hasta: {cupon.validoHasta}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ListaCupones: React.FC = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

  const renderCarrusel = (categoria: string) => {
    const cuponesFiltrados = cupones.filter(c => c.categoria === categoria);
    return (
      <View style={styles.carruselContainer} key={categoria}>
        <Text style={styles.categoriaTitle}>{categoria}</Text>
        <FlatList
          data={cuponesFiltrados}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CuponCard cupon={item} />}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center' }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <ScrollView horizontal style={styles.selector} showsHorizontalScrollIndicator={false}>
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.selectorItem,
              categoriaSeleccionada === cat && styles.selectorItemSelected
            ]}
            onPress={() => setCategoriaSeleccionada(categoriaSeleccionada === cat ? null : cat)}
          >
            <Text style={[
              styles.selectorText,
              categoriaSeleccionada === cat && styles.selectorTextSelected
            ]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {categorias.map(cat => (
        (categoriaSeleccionada === null || categoriaSeleccionada === cat) && renderCarrusel(cat)
      ))}
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

export default function MisCuponesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaCupones" component={ListaCupones} options={{ headerShown: false }} />
      <Stack.Screen name="DetalleCupon" component={DetalleCuponScreen} options={{ title: "Detalle del Cupón" }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  selector: { flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10 },
  selectorItem: {
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectorItemSelected: { backgroundColor: '#4CAF50' },
  selectorText: { color: '#333', fontWeight: 'bold' },
  selectorTextSelected: { color: '#fff' },
  carruselContainer: { marginBottom: 20 },
  categoriaTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
  cuponCard: {
    minWidth: 200,
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cuponImage: { width: '100%', height: 120 },
  cuponInfo: { padding: 10 },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  descripcion: { fontSize: 14, color: '#555', marginBottom: 5 },
  valido: { fontSize: 12, color: '#999' },
});
