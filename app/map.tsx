import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Circle } from 'react-native-maps';
import { ActivityIndicator, Text, Chip, IconButton } from 'react-native-paper';
import * as Location from 'expo-location';
import { useRouter, Stack } from 'expo-router';
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

const ENV_DATA: { [key: string]: EnvZone[] } = {
    aqi: [ 
        { id: 1, lat: 10.7750, lng: 106.7020, radius: 800, color: 'rgba(255, 87, 34, 0.4)' }, 
        { id: 2, lat: 10.7600, lng: 106.6900, radius: 600, color: 'rgba(255, 193, 7, 0.4)' }, 
    ],
    noise: [ 
        { id: 3, lat: 10.7700, lng: 106.6950, radius: 500, color: 'rgba(156, 39, 176, 0.3)' }, 
        { id: 4, lat: 10.7800, lng: 106.7050, radius: 400, color: 'rgba(103, 58, 183, 0.3)' }, 
    ],
    water: [ 
        { id: 5, lat: 10.7900, lng: 106.7100, radius: 700, color: 'rgba(3, 169, 244, 0.3)' }, 
    ]
};

const INITIAL_POINTS: RecyclePoint[] = [
  { id: 1, lat: 10.7712, lng: 106.6900, title: 'Điểm thu gom Nhựa (Q1)', type: 'plastic' },
  { id: 2, lat: 10.7850, lng: 106.6900, title: 'Trạm Xử lý Rác Điện tử', type: 'electronic' },
  { id: 3, lat: 10.7650, lng: 106.6850, title: 'Thùng rác Y tế', type: 'medical' },
  { id: 4, lat: 10.7800, lng: 106.7050, title: 'Điểm đổi Pin Cũ', type: 'battery' },
];

const getPinColor = (type: string) => {
    switch(type) {
        case 'plastic': return '#4CAF50';
        case 'electronic': return '#2196F3';
        case 'medical': return '#F44336';
        case 'battery': return '#FFC107';
        default: return '#9C27B0';
    }
}

export default function MapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [layer, setLayer] = useState<'aqi' | 'noise' | 'water' | null>(null); 
  const [points, setPoints] = useState<RecyclePoint[]>(INITIAL_POINTS);
  const [showLayers, setShowLayers] = useState(false); 
  
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

  const handleLongPress = (e: any) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      Alert.alert("Thêm điểm mới", "Bạn muốn báo cáo điểm rác mới tại đây?", [
          { text: "Hủy" },
          { text: "Thêm ngay", onPress: () => {
              const newPoint: RecyclePoint = {
                  id: Date.now(),
                  lat: latitude,
                  lng: longitude,
                  title: "Điểm rác mới (Người dân báo)",
                  type: 'general'
              };
              setPoints([...points, newPoint]);
              Alert.alert("Thành công", "Cảm ơn bạn đã đóng góp dữ liệu!");
          }}
      ]);
  };

  const displayedPoints = filterType === 'all' ? points : points.filter(p => p.type === filterType);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E4626" />
        <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      
      <View style={styles.headerContainer}>
          <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={24} style={styles.headerIconBtn} />
          <Text style={styles.headerTitle}>Bản đồ Môi trường</Text>
          <IconButton icon="crosshairs-gps" onPress={() => {/* Logic to center map */}} iconColor="#0E4626" size={24} style={styles.headerIconBtn} />
      </View>

      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            <Chip selected={filterType === 'all'} onPress={() => setFilterType('all')} style={[styles.filterChip, filterType === 'all' && styles.filterChipSelected]} textStyle={filterType === 'all' ? styles.filterTextSelected : styles.filterText} icon={filterType === 'all' ? "check" : undefined}>Tất cả</Chip>
            <Chip selected={filterType === 'plastic'} onPress={() => setFilterType('plastic')} style={[styles.filterChip, filterType === 'plastic' && styles.filterChipSelected]} textStyle={filterType === 'plastic' ? styles.filterTextSelected : styles.filterText} icon="bottle-soda">Nhựa</Chip>
            <Chip selected={filterType === 'electronic'} onPress={() => setFilterType('electronic')} style={[styles.filterChip, filterType === 'electronic' && styles.filterChipSelected]} textStyle={filterType === 'electronic' ? styles.filterTextSelected : styles.filterText} icon="chip">Điện tử</Chip>
            <Chip selected={filterType === 'medical'} onPress={() => setFilterType('medical')} style={[styles.filterChip, filterType === 'medical' && styles.filterChipSelected]} textStyle={filterType === 'medical' ? styles.filterTextSelected : styles.filterText} icon="pill">Y tế</Chip>
            <Chip selected={filterType === 'battery'} onPress={() => setFilterType('battery')} style={[styles.filterChip, filterType === 'battery' && styles.filterChipSelected]} textStyle={filterType === 'battery' ? styles.filterTextSelected : styles.filterText} icon="battery">Pin</Chip>
        </ScrollView>
      </View>

      
      <View style={styles.layerFabGroup}>
          
          
          {showLayers && (
              <>
                <View style={styles.layerRow}>
                    <View style={styles.layerLabelCard}><Text style={styles.layerLabelText}>Chất lượng KK</Text></View>
                    <TouchableOpacity style={[styles.layerBtn, layer === 'aqi' && styles.layerBtnActive]} onPress={() => setLayer(layer === 'aqi' ? null : 'aqi')}>
                        <IconButton icon="air-filter" iconColor="#FF5722" size={22} />
                    </TouchableOpacity>
                </View>

                <View style={styles.layerRow}>
                    <View style={styles.layerLabelCard}><Text style={styles.layerLabelText}>Tiếng ồn</Text></View>
                    <TouchableOpacity style={[styles.layerBtn, layer === 'noise' && styles.layerBtnActive]} onPress={() => setLayer(layer === 'noise' ? null : 'noise')}>
                        <IconButton icon="volume-high" iconColor="#9C27B0" size={22} />
                    </TouchableOpacity>
                </View>

                <View style={styles.layerRow}>
                    <View style={styles.layerLabelCard}><Text style={styles.layerLabelText}>Nguồn nước</Text></View>
                    <TouchableOpacity style={[styles.layerBtn, layer === 'water' && styles.layerBtnActive]} onPress={() => setLayer(layer === 'water' ? null : 'water')}>
                        <IconButton icon="water" iconColor="#2196F3" size={22} />
                    </TouchableOpacity>
                </View>
              </>
          )}

          
          <View style={styles.layerRow}>
             <TouchableOpacity 
                style={[styles.layerBtn, styles.mainLayerBtn]} 
                onPress={() => setShowLayers(!showLayers)}
                activeOpacity={0.9}
             >
                 <IconButton icon={showLayers ? "close" : "layers"} iconColor="#fff" size={26} />
             </TouchableOpacity>
          </View>
      </View>

      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={false}
        onLongPress={handleLongPress}
      >
        
        {(layer && ENV_DATA[layer]) ? ENV_DATA[layer].map((zone: EnvZone) => (
            <Circle 
                key={zone.id}
                center={{latitude: zone.lat, longitude: zone.lng}}
                radius={zone.radius}
                fillColor={zone.color}
                strokeColor="rgba(0,0,0,0.05)"
                zIndex={1}
            />
        )) : null}

        
        {displayedPoints.map(point => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.lat, longitude: point.lng }}
            title={point.title}
            description={`Loại: ${point.type}`}
            pinColor={getPinColor(point.type)} 
            zIndex={2}
          />
        ))}
      </MapView>


    </View>
  );
}