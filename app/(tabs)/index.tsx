import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import MapView, { UrlTile, Polyline, Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocateFixed } from 'lucide-react-native';

import { 
  AppHeader, 
  ThemedText, 
  BottomSheet, 
  RoadStrip, 
  SegmentDetail,
  Button,
  RiskIcon,
  RiskBadge,
  type BottomSheetRef
} from '../../src/components';
import { useRiskMap, useTowns, useHistory } from '../../src/api/hooks';
import { colors, spacing, risk, radii, severeHatch } from '../../src/design/tokens';
import type { Segment } from '../../src/api/types';

// Constants for MapView
const CARTO_URL = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
const ROUTE_REGION = {
  latitude: 30.41,
  longitude: 78.88,
  latitudeDelta: 0.75,
  longitudeDelta: 1.5,
};

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isHindi = i18n.language === 'hi';
  
  // Data hooks
  const { data: riskMapData, isFetching: riskMapLoading, refetch } = useRiskMap();
  const { data: townsData } = useTowns();
  const { data: historyData } = useHistory();

  // Local state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  
  // Refs
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheetRef>(null);

  // Derived data
  const segments = riskMapData?.segments || [];
  const towns = townsData || [];
  const history = historyData || [];
  
  const selectedSegment = useMemo(() => 
    segments.find(s => s.id === selectedId),
    [segments, selectedId]
  );
  
  const highRiskCount = segments.filter(s => s.level >= 2).length;

  const handleSegmentSelect = (id: string) => {
    setSelectedId(id);
    sheetRef.current?.snapToIndex(1); // snap to half
    
    // Fit map to segment bounds (simple heuristic)
    const seg = segments.find(s => s.id === id);
    if (seg && mapRef.current) {
      const coords = seg.geometry.coordinates;
      const lats = coords.map(c => c[1]);
      const lngs = coords.map(c => c[0]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      mapRef.current.animateToRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(0.1, (maxLat - minLat) * 1.5),
        longitudeDelta: Math.max(0.1, (maxLng - minLng) * 1.5),
      }, 500);
    }
  };

  const handleLocateMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need location to show where you are on the route.'
        );
        return;
      }
      
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc);
      
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (error) {
      console.warn('Location error:', error);
    }
  };

  // Polyline widths based on risk level
  const getRiskWidth = (level: number) => {
    switch (level) {
      case 0: return 4;
      case 1: return 5;
      case 2: return 7;
      case 3: return 8;
      default: return 4;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title={t('nav.map')} />
      
      {/* Alert Status Line (if High/Severe exists) */}
      {highRiskCount > 0 && (
        <TouchableOpacity 
          style={styles.alertLine}
          onPress={() => {
            setSelectedId(null);
            sheetRef.current?.snapToIndex(1);
          }}
        >
          <ThemedText variant="small" color={colors.ink}>
            {t('home.watch', { n: highRiskCount })}
          </ThemedText>
        </TouchableOpacity>
      )}
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          mapType="none"
          initialRegion={ROUTE_REGION}
          // Loose boundaries around NH-7
          minZoomLevel={7}
          maxZoomLevel={18}
        >
          <UrlTile 
            urlTemplate={CARTO_URL}
            maximumZ={18}
            tileSize={256}
          />
          
          {/* History markers */}
          {history.map(event => (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.lat, longitude: event.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.historyDot} />
            </Marker>
          ))}
          
          {/* Segments */}
          {segments.map(seg => {
            const isSelected = selectedId === seg.id;
            const riskWidth = getRiskWidth(seg.level);
            const casingWidth = riskWidth + 3 + (isSelected ? 2 : 0);
            const isSevere = seg.level === 3;
            const riskColor = risk[seg.level].fill;
            
            // Map GeoJSON [lng, lat] to MapView {latitude, longitude}
            const coords = seg.geometry.coordinates.map(c => ({
              latitude: c[1],
              longitude: c[0]
            }));

            return (
              <React.Fragment key={seg.id}>
                {/* Outer casing */}
                <Polyline
                  coordinates={coords}
                  strokeColor={isSelected ? colors.ink : '#FFFFFF'}
                  strokeWidth={casingWidth}
                  lineDashPattern={isSevere && !isSelected ? [severeHatch.stripeWidth, severeHatch.gapWidth] : undefined}
                  tappable
                  onPress={() => handleSegmentSelect(seg.id)}
                  zIndex={isSelected ? 10 : 1}
                />
                
                {/* Inner line */}
                <Polyline
                  coordinates={coords}
                  strokeColor={riskColor}
                  strokeWidth={riskWidth + (isSelected ? 1 : 0)}
                  tappable
                  onPress={() => handleSegmentSelect(seg.id)}
                  zIndex={isSelected ? 11 : 2}
                />
              </React.Fragment>
            );
          })}
          
          {/* Towns */}
          {towns.map(town => (
            <Marker
              key={town.id}
              coordinate={{ latitude: town.lat, longitude: town.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={styles.townMarker}>
                <View style={styles.townDot} />
                <ThemedText variant="caption" color={colors.ink} style={styles.townLabel}>
                  {isHindi ? town.name_hi : town.name_en}
                </ThemedText>
              </View>
            </Marker>
          ))}
          
          {/* User Location */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.userDotContainer}>
                <View style={styles.userDot} />
              </View>
            </Marker>
          )}
        </MapView>
        
        {/* Controls Overlay */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={handleLocateMe}
            accessibilityLabel="Locate me"
          >
            <LocateFixed size={24} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </View>
      
      <BottomSheet ref={sheetRef} initialIndex={0}>
        {selectedSegment ? (
          <SegmentDetail 
            segment={selectedSegment} 
            updatedAt={riskMapData?.updated_at}
            onAlertMe={() => {}}
            onReport={() => router.push('/report')}
          />
        ) : (
          <View style={styles.sheetContent}>
            {/* When not selected, show overview/stretches to watch */}
            <View style={styles.dragHandle} />
            
            <View style={styles.sheetHeader}>
              <ThemedText variant="h3" color={colors.ink}>
                Stretches to watch
              </ThemedText>
              <ThemedText variant="small" color={colors.granite}>
                {riskMapData?.updated_at ? t('status.fresh', { n: Math.floor((Date.now() - new Date(riskMapData.updated_at).getTime()) / 60000) }) : ''}
              </ThemedText>
            </View>
            
            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <Button label={t('nav.plan')} variant="primary" onPress={() => router.push('/plan')} />
              </View>
              <View style={{ flex: 1 }}>
                <Button label={t('drive_mode')} variant="secondary" onPress={() => router.push('/drive')} />
              </View>
            </View>
            
            <View style={styles.stripContainer}>
               <RoadStrip 
                 segments={segments} 
                 towns={towns}
                 orientation="vertical"
                 onSelect={handleSegmentSelect}
               />
            </View>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  alertLine: {
    backgroundColor: risk[2].tint,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#EAEAEA', // Carto base color roughly
  },
  controls: {
    position: 'absolute',
    bottom: 200, // Above the peek sheet
    right: spacing.base,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.snow,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.snow,
  },
  townMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  townDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ink,
    marginBottom: 2,
  },
  townLabel: {
    fontFamily: 'IBMPlexSansCondensed_600SemiBold',
    textShadowColor: colors.snow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  userDotContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(29, 94, 107, 0.2)', // river transparent
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.river,
    borderWidth: 1.5,
    borderColor: colors.snow,
  },
  sheetContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 32,
    height: 4,
    backgroundColor: colors.mist,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stripContainer: {
    flex: 1,
    alignItems: 'center',
  }
});
