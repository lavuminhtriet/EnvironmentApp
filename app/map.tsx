import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Circle } from 'react-native-maps';
import { Appbar, ActivityIndicator, Text, Chip, SegmentedButtons } from 'react-native-paper';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { styles } from '../styles/map.styles'; 

interface RecyclePoint {
  id: number;
  lat: number;
  lng: number;
  title: string;
  type: 'plastic' | 'electronic' | 'medical' | 'battery' | 'general';
}

interface EnvZone {
    id: number;
    lat: number;
    lng: number;
    radius: number;
    color: string;
}

const ENV_DATA = {
    aqi: [ 
        { id: 1, lat: 10.7750, lng: 106.7020, radius: 800, color: 'rgba(255, 0, 0, 0.3)' }, 
        { id: 2, lat: 10.7600, lng: 106.6900, radius: 600, color: 'rgba(255, 255, 0, 0.3)' },
    ],
    noise: [ 
        { id: 3, lat: 10.7700, lng: 106.6950, radius: 500, color: 'rgba(128, 0, 128, 0.3)' },
        { id: 4, lat: 10.7800, lng: 106.7050, radius: 400, color: 'rgba(128, 0, 128, 0.4)' },
    ],
    water: [ 
        { id: 5, lat: 10.7900, lng: 106.7100, radius: 700, color: 'rgba(0, 0, 255, 0.3)' },
    ]
};

const RecyclePoints: RecyclePoint[] = [
  { id: 1, lat: 10.7712, lng: 106.6900, title: 'Điểm thu gom Nhựa (Q1)', type: 'plastic' },
  { id: 2, lat: 10.7850, lng: 106.6900, title: 'Trạm Xử lý Rác Điện tử', type: 'electronic' },
  { id: 3, lat: 10.7650, lng: 106.6850, title: 'Thùng rác Y tế', type: 'medical' },
  { id: 4, lat: 10.7800, lng: 106.7050, title: 'Điểm đổi Pin Cũ', type: 'battery' },
];

const getPinColor = (type: string) => {
    switch(type) {
        case 'plastic': return 'green';
        case 'electronic': return 'blue';
        case 'medical': return 'red';
        case 'battery': return 'yellow';
        default: return 'purple';
    }
}

export default function MapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [layer, setLayer] = useState<'aqi' | 'noise' | 'water'>('aqi');
  
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 10.7769, 
    longitude: 106.7000,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02, 
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
  }, []);

  const displayedPoints = filterType === 'all' ? RecyclePoints : RecyclePoints.filter(p => p.type === filterType);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{marginTop: 10}}>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: '#fff', elevation: 4}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Bản đồ Môi trường" subtitle="Dữ liệu ô nhiễm & Điểm thu gom" />
      </Appbar.Header>

      <View style={{padding: 10, backgroundColor: '#fff'}}>
          <SegmentedButtons
            value={layer}
            onValueChange={val => setLayer(val as any)}
            buttons={[
              { value: 'aqi', label: 'Không khí' },
              { value: 'noise', label: 'Tiếng ồn' },
              { value: 'water', label: 'Nguồn nước' },
            ]}
            density="small"
          />
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {ENV_DATA[layer].map((zone: EnvZone) => (
            <Circle 
                key={zone.id}
                center={{latitude: zone.lat, longitude: zone.lng}}
                radius={zone.radius}
                fillColor={zone.color}
                strokeColor="rgba(0,0,0,0.1)"
            />
        ))}

        {displayedPoints.map(point => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.lat, longitude: point.lng }}
            title={point.title}
            description={`Loại: ${point.type}`}
            pinColor={getPinColor(point.type)} 
          />
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Lọc điểm thu gom:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 5}}>
            <Chip selected={filterType === 'plastic'} onPress={() => setFilterType(filterType === 'plastic' ? 'all' : 'plastic')} icon="bottle-soda" showSelectedOverlay>Nhựa</Chip>
            <Chip selected={filterType === 'electronic'} onPress={() => setFilterType(filterType === 'electronic' ? 'all' : 'electronic')} icon="chip" showSelectedOverlay>Điện tử</Chip>
            <Chip selected={filterType === 'medical'} onPress={() => setFilterType(filterType === 'medical' ? 'all' : 'medical')} icon="pill" showSelectedOverlay>Y tế</Chip>
            <Chip selected={filterType === 'battery'} onPress={() => setFilterType(filterType === 'battery' ? 'all' : 'battery')} icon="battery" showSelectedOverlay>Pin</Chip>
        </ScrollView>
      </View>
    </View>
  );
}