export type SystemStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type PowerMode = 'NORMAL' | 'POWER SAVING';
export type CommStatus = 'CONNECTED' | 'DISCONNECTED';
export type CommQuality = 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'DISCONNECTED';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED';

export type NavTab =
  | 'overview'
  | 'zone-a'
  | 'zone-b'
  | 'lora'
  | 'analytics'
  | 'alerts'
  | 'logs'
  | 'settings';

export interface SensorPacket {
  packetId: number;
  timestamp: string;
  gasLevel: number; // ppm (Simulated Hazardous Gas / Methane / CO)
  temperature: number; // °C (Simulated Ambient Helmet Temperature)
  fallDetected: boolean; // Simulated IMU 6-axis fall/impact detection flag
  sourceZone: 'ZONE_A_SENSOR';
  destinationZone: 'ZONE_B_CONTROL';
  checksumValid: boolean;
}

export interface PacketRecord {
  packetId: number;
  timestamp: string;
  gasLevel: number;
  temperature: number;
  fallDetected: boolean;
  sourceZone: 'ZONE_A_SENSOR';
  destinationZone: 'ZONE_B_CONTROL';
  transmissionOutcome: 'SENT' | 'DROPPED';
  validationResult: 'PASSED' | 'FAILED' | 'TIMEOUT';
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  type: string;
  description: string;
  status: AlertStatus;
  acknowledgedAt?: string;
  relatedZone?: 'ZONE_A' | 'ZONE_B' | 'LORA' | 'SYSTEM';
  sensorValue?: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  category: 'SYSTEM' | 'ZONE_A' | 'ZONE_B' | 'LORA' | 'ALERT' | 'POWER';
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
  packetId?: number;
}

export interface ThresholdConfig {
  gasWarning: number; // ppm
  gasCritical: number; // ppm
  tempWarning: number; // °C
  tempCritical: number; // °C
  batteryLow: number; // %
}

export interface TelemetryPoint {
  timeStr: string;
  timestamp: number;
  gas: number;
  temp: number;
  battery: number;
  packetsSent: number;
  packetsReceived: number;
  packetsLost: number;
  packetDeliveryRate: number; // 0 - 100%
  imuShockG: number; // e.g. 1.0g normal, 4.2g on fall/impact
  status: SystemStatus;
  activeAlertCount: number;
}

export interface ZoneAState {
  status: 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'STANDBY';
  gasLevel: number;
  temperature: number;
  fallDetected: boolean;
  imuShockG: number;
  lastPacketTime: string | null;
  packetSequence: number;
  txStatus: 'IDLE' | 'TRANSMITTING' | 'SENT_OK' | 'ERROR';
}

export interface ZoneBState {
  status: 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'STANDBY';
  rxStatus: 'WAITING' | 'RECEIVED_OK' | 'VALIDATION_FAILED' | 'TIMEOUT';
  lastPacket: SensorPacket | null;
  packetValidation: 'PASSED' | 'FAILED' | 'PENDING';
  packetsReceived: number;
  packetsLost: number;
  batteryLevel: number;
  powerMode: PowerMode;
  systemResponse: string;
}

export interface CommState {
  status: CommStatus;
  packetsSent: number;
  packetsReceived: number;
  packetsLost: number;
  lastPacketTime: string | null;
  qualitySimulated: CommQuality;
  deliveryRate: number;
}

export interface AppSettings {
  updateIntervalMs: number;
  chartTimeWindow: '30s' | '1m' | '5m';
  displayTheme: 'light' | 'dark';
  deterministicMode: boolean;
}

export interface SimulationState {
  isRunning: boolean;
  tickIntervalMs: number;
  activeScenario: string | null;
  systemStatus: SystemStatus;
  zoneA: ZoneAState;
  zoneB: ZoneBState;
  comm: CommState;
  alerts: AlertItem[];
  eventLog: LogEvent[];
  recentPackets: PacketRecord[];
  telemetryHistory: TelemetryPoint[];
  thresholds: ThresholdConfig;
  settings: AppSettings;
}

export type DemoScenarioType =
  | 'NORMAL'
  | 'GAS_WARNING'
  | 'GAS_CRITICAL'
  | 'HIGH_TEMP'
  | 'FALL_IMPACT'
  | 'COMM_FAILURE'
  | 'RESTORE_COMM'
  | 'LOW_BATTERY'
  | 'RESET';
