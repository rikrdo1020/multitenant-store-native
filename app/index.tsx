import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/use-auth-store';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handlePrimaryAction = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    if (user?.role === 'customer') {
      router.push('/marketplace');
    } else if (user?.role === 'superadmin') {
      router.push('/(superadmin)/dashboard');
    } else {
      router.push('/(admin)/dashboard');
    }
  };

  const authenticatedLabel =
    user?.role === 'customer'
      ? 'Ir al marketplace'
      : user?.role === 'superadmin'
        ? 'Panel Superadmin'
        : 'Ir a mi tienda';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 }}>

        {/* Top badge */}
        <View style={{
          alignSelf: 'flex-start',
          backgroundColor: '#1a1a1a',
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: '#2a2a2a',
        }}>
          <Text style={{ color: '#737373', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
            Multitenant Store
          </Text>
        </View>

        {/* Headline */}
        <View style={{ marginTop: 48 }}>
          <Text style={{
            color: '#ffffff',
            fontSize: 52,
            fontWeight: '800',
            lineHeight: 54,
            letterSpacing: -1.5,
          }}>
            Tu tienda,{'\n'}tu mercado.
          </Text>
          <View style={{ width: 48, height: 3, backgroundColor: '#ffffff', marginTop: 20 }} />
          <Text style={{
            color: '#737373',
            fontSize: 15,
            lineHeight: 24,
            marginTop: 16,
            maxWidth: width * 0.72,
          }}>
            Vende, descubre y compra en cientos de tiendas independientes en un solo lugar.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Buttons */}
        <View style={{ gap: 12 }}>
          <Link href="/marketplace" asChild>
            <TouchableOpacity
              accessibilityRole="link"
              activeOpacity={0.85}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 14,
                paddingVertical: 18,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#0a0a0a', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 }}>
                Explorar marketplace
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            onPress={handlePrimaryAction}
            activeOpacity={0.75}
            style={{
              borderRadius: 14,
              paddingVertical: 18,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#2a2a2a',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600', letterSpacing: 0.2 }}>
              {isAuthenticated ? authenticatedLabel : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{
          color: '#404040',
          fontSize: 11,
          textAlign: 'center',
          marginTop: 24,
          letterSpacing: 0.3,
        }}>
          {isAuthenticated
            ? `Sesión activa: ${user?.name ?? user?.email}`
            : '¿Tienes una tienda? Inicia sesión para gestionarla.'}
        </Text>

      </View>
    </SafeAreaView>
  );
}
