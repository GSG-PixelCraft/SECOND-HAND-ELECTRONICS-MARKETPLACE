declare module "leaflet" {
  export type LatLngTuple = [number, number];
  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  export type LatLngExpression = LatLngLiteral | LatLngTuple;
  export type LatLngBoundsExpression =
    | [LatLngExpression, LatLngExpression]
    | LatLngExpression[];

  export interface FitBoundsOptions {
    paddingTopLeft?: LatLngTuple;
    paddingBottomRight?: LatLngTuple;
  }

  export interface MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    scrollWheelZoom?: boolean;
    className?: string;
  }

  export class Map {
    setView(center: LatLngExpression, zoom?: number, options?: Record<string, unknown>): this;
    getZoom(): number;
  }

  export interface TileLayerOptions {
    attribution?: string;
    maxZoom?: number;
    minZoom?: number;
  }

  export class TileLayer {
    constructor(url: string, options?: TileLayerOptions);
  }

  export interface MarkerOptions {
    draggable?: boolean;
  }

  export class Marker<T = any> {
    constructor(position: LatLngExpression, options?: MarkerOptions);
    getLatLng(): LatLngLiteral;
  }

  export interface LeafletMouseEvent {
    latlng: LatLngLiteral;
  }

  export interface LeafletEvent {
    target: unknown;
  }

  export namespace Icon {
    class Default {
      constructor(options?: Record<string, unknown>);
      static prototype: Default & Record<string, unknown>;
      static mergeOptions(options: Record<string, unknown>): void;
    }
  }
}
