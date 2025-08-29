import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";

export default function MisPuntosScreen() {
  const { width } = useWindowDimensions(); // 👈 se adapta al ancho del dispositivo

  const [puntosTotales, setPuntosTotales] = useState(1200);
  const [puntosObtenidos, setPuntosObtenidos] = useState(1800);
  const [puntosGastados, setPuntosGastados] = useState(600);

  const pieData = [
    {
      name: "Obtenidos",
      population: puntosObtenidos,
      color: "#4CAF50",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Gastados",
      population: puntosGastados,
      color: "#F44336",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  const barData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{ data: [200, 300, 250, 400, 350, 300] }],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>🎯 Mis Puntos</Text>
      <Text style={styles.total}>Total: {puntosTotales} pts</Text>

      {/* Gráfico circular */}
      <Text style={styles.subtitle}>Distribución</Text>
      <PieChart
        data={pieData}
        width={width * 0.9}   // 👈 ocupa 90% del ancho disponible
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      {/* Gráfico de barras */}
      <Text style={styles.subtitle}>Historial mensual</Text>
      <BarChart
        data={barData}
        width={width * 0.9}   // 👈 90% del ancho
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix=" pts"
        style={{ borderRadius: 16, alignSelf: "center" }}
      />

      {/* Opciones de uso */}
      <Text style={styles.subtitle}>¿Qué hacer con mis puntos?</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.buttonText}>🎁 Canjear beneficios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#2196F3" }]}>
          <Text style={styles.buttonText}>💳 Descuentos en compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#FF9800" }]}>
          <Text style={styles.buttonText}>📊 Ver más detalles</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  total: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10, textAlign: "center" },
  buttonsContainer: { paddingHorizontal: 15 },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
