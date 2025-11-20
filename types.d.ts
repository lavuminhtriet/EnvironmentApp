declare module 'react-native-maps' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  // --- THÊM KHAI BÁO REGION VÀO ĐÂY ---
  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapViewProps extends ViewProps {
    provider?: 'google';
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    [key: string]: any;
  }

  export class MapView extends Component<MapViewProps> {}
  export class Marker extends Component<any> {}
  export class Callout extends Component<any> {}
  export class Polygon extends Component<any> {}
  export class Polyline extends Component<any> {}
  export class Circle extends Component<any> {}
  export class Overlay extends Component<any> {}
  export const PROVIDER_GOOGLE: 'google';
  export const PROVIDER_DEFAULT: null;
  
  export default MapView;
}