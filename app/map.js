import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { ActivityIndicator, Text, Chip, IconButton } from 'react-native-paper';
import * as Location from 'expo-location';
import { useRouter, Stack } from 'expo-router';
import { styles } from '../styles/map.styles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function MapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [layer, setLayer] = useState(null); 
  const [points, setPoints] = useState([]); 
  const [envLayers, setEnvLayers] = useState({ aqi: [], noise: [], water: [] }); 
  const [showLayers, setShowLayers] = useState(false); 
  
  const [initialRegion, setInitialRegion] = useState({
    latitude: 10.7769, 
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const fetchMapData = async () => {
      try {
          // 1. Tải điểm thu gom từ Firestore (Collection: map_points)
          const pointsSnap = await getDocs(collection(db, "map_points"));
          const pointsList = pointsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPoints(pointsList);

          // 2. Tải lớp môi trường từ Firestore (Collection: map_layers)
          const layersSnap = await getDocs(collection(db, "map_layers"));
          const layersData = { aqi: [], noise: [], water: [] };
          layersSnap.forEach(doc => {
              const data = doc.data();
              if (layersData[data.type]) {
                  layersData[data.type].push({
                      id: doc.id,
                      ...data
                  });
              }
          });
          setEnvLayers(layersData);

      } catch (error) {
          console.log("Lỗi tải map:", error);
      }
  };

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
      
      await fetchMapData();
      setLoading(false);
    })();
  }, []);

  const handleLongPress = (e) => {
      // Vì là app thật, ta không cho phép user tự thêm điểm vào DB chính thức ở màn hình này
      // Chỉ cho phép xem thôi.
      Alert.alert("Thông tin", "Để thêm điểm rác mới, vui lòng vào mục 'Báo cáo vi phạm'.");
  };

  const getPinColor = (type) => {
    switch(type) {
        case 'plastic': return '#4CAF50';
        case 'electronic': return '#2196F3';
        case 'medical': return '#F44336';
        case 'battery': return '#FFC107';
        default: return '#9C27B0';
    }
  };

  const displayedPoints = filterType === 'all' ? points : points.filter(p => p.type === filterType);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E4626" />
        <Text style={styles.loadingText}>Đang tải dữ liệu bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerContainer}>
          <IconButton icon="arrow-left" onPress={() => router.back()} iconColor="#0E4626" size={24} style={styles.headerIconBtn} />
          <Text style={styles.headerTitle}>Bản đồ Môi trường</Text>
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
        {(layer && envLayers[layer]) ? envLayers[layer].map((zone) => (
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