import { useRoute, useNavigation } from '@react-navigation/native';
// ...

type RouteParams = { cupon?: Cupon; beneficio?: Cupon };

export default function QRBeneficioScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // ✅ Soportá tanto { cupon } como { beneficio } y poné guardas
  const params = (route.params ?? {}) as RouteParams;
  const cupon = params.cupon ?? params.beneficio;

  const { user, token } = useAuth();
  const USER_ID_FALLBACK = 'USER_ID_FALLBACK';
  const userId = (user as any)?.id ?? (user as any)?.uid ?? (user as any)?.userId ?? USER_ID_FALLBACK;

  // ... estados e intervalRef iguales ...

  const claimQr = async () => {
    if (!cupon?.id) {
      Alert.alert('Falta la promoción', 'No recibí datos del cupón.');
      return;
    }
    try {
      setLoading(true);
      setIsQrReady(false);

      const res = await fetch(`${API_BASE}/api/v1/promotions/${cupon.id}/claim-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: userId, device: 'rn-app' }),
      });
      // ... igual ...
    } catch (e: any) {
      // ... igual ...
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cupon?.id) claimQr();         // ✅ guard
    return () => clearTick();
  }, [cupon?.id]);                     // ✅ optional chaining en dependencia

  if (!cupon) {
    // ✅ fallback amigable si no vino el parámetro
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>No recibí la promoción a mostrar.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.PRIMARY_GREEN, fontWeight: 'bold' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ... resto del render como ya lo tenías ...
}
