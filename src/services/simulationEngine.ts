import {
  AlertItem,
  CommQuality,
  LogEvent,
  PacketRecord,
  PowerMode,
  SensorPacket,
  SimulationState,
  SystemStatus,
  TelemetryPoint,
  ThresholdConfig,
  AppSettings,
} from '../types/mineguard';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  gasWarning: 35, // ppm (Simulated Hazardous Gas Threshold)
  gasCritical: 75, // ppm
  tempWarning: 38, // °C
  tempCritical: 45, // °C
  batteryLow: 20, // %
};

export const DEFAULT_SETTINGS: AppSettings = {
  updateIntervalMs: 1500,
  chartTimeWindow: '1m',
  displayTheme: 'light',
  deterministicMode: false,
};

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function createInitialState(): SimulationState {
  const now = new Date();
  const timeStr = formatTime(now);

  const initialPacket: SensorPacket = {
    packetId: 101,
    timestamp: timeStr,
    gasLevel: 18.2,
    temperature: 24.6,
    fallDetected: false,
    sourceZone: 'ZONE_A_SENSOR',
    destinationZone: 'ZONE_B_CONTROL',
    checksumValid: true,
  };

  const initialTelemetry: TelemetryPoint[] = Array.from({ length: 15 }).map((_, i) => {
    const t = new Date(now.getTime() - (15 - i) * 1500);
    const gasVal = +(18.0 + Math.sin(i * 0.4) * 2.1 + Math.cos(i * 0.8) * 0.8).toFixed(1);
    const tempVal = +(24.5 + Math.sin(i * 0.2) * 0.5).toFixed(1);
    return {
      timeStr: formatTime(t),
      timestamp: t.getTime(),
      gas: gasVal,
      temp: tempVal,
      battery: +(95 - i * 0.05).toFixed(1),
      packetsSent: 86 + i,
      packetsReceived: 86 + i,
      packetsLost: 0,
      packetDeliveryRate: 100,
      imuShockG: 1.0,
      status: 'NORMAL',
      activeAlertCount: 0,
    };
  });

  const initialPacketRecord: PacketRecord = {
    ...initialPacket,
    transmissionOutcome: 'SENT',
    validationResult: 'PASSED',
  };

  return {
    isRunning: true,
    tickIntervalMs: 1500,
    activeScenario: null,
    systemStatus: 'NORMAL',
    zoneA: {
      status: 'ACTIVE',
      gasLevel: 18.2,
      temperature: 24.6,
      fallDetected: false,
      imuShockG: 1.02,
      lastPacketTime: timeStr,
      packetSequence: 101,
      txStatus: 'SENT_OK',
    },
    zoneB: {
      status: 'ACTIVE',
      rxStatus: 'RECEIVED_OK',
      lastPacket: initialPacket,
      packetValidation: 'PASSED',
      packetsReceived: 101,
      packetsLost: 0,
      batteryLevel: 94.2,
      powerMode: 'NORMAL',
      systemResponse: 'Nominal baseline monitoring. Dual-zone LoRa link verified.',
    },
    comm: {
      status: 'CONNECTED',
      packetsSent: 101,
      packetsReceived: 101,
      packetsLost: 0,
      lastPacketTime: timeStr,
      qualitySimulated: 'EXCELLENT',
      deliveryRate: 100,
    },
    alerts: [],
    eventLog: [
      {
        id: 'evt-init',
        timestamp: timeStr,
        category: 'SYSTEM',
        message: 'OREON Intelligent Mining Safety Platform initialized [VAYUJ NEXUS HSN|TN|00803]',
        level: 'info',
        packetId: 101,
      },
      {
        id: 'evt-link-init',
        timestamp: timeStr,
        category: 'LORA',
        message: 'Simulated LoRa Link established between Zone A and Zone B',
        level: 'success',
      },
    ],
    recentPackets: [initialPacketRecord],
    telemetryHistory: initialTelemetry,
    thresholds: { ...DEFAULT_THRESHOLDS },
    settings: { ...DEFAULT_SETTINGS },
  };
}

export interface TransitionStateTracker {
  gasState: 'NORMAL' | 'WARNING' | 'CRITICAL';
  tempState: 'NORMAL' | 'WARNING' | 'CRITICAL';
  fallState: boolean;
  commState: 'CONNECTED' | 'DISCONNECTED';
  batteryState: 'NORMAL' | 'LOW';
  tickCount: number;
}

export function createTransitionTracker(state: SimulationState): TransitionStateTracker {
  return {
    gasState:
      state.zoneA.gasLevel >= state.thresholds.gasCritical
        ? 'CRITICAL'
        : state.zoneA.gasLevel >= state.thresholds.gasWarning
        ? 'WARNING'
        : 'NORMAL',
    tempState:
      state.zoneA.temperature >= state.thresholds.tempCritical
        ? 'CRITICAL'
        : state.zoneA.temperature >= state.thresholds.tempWarning
        ? 'WARNING'
        : 'NORMAL',
    fallState: state.zoneA.fallDetected,
    commState: state.comm.status,
    batteryState: state.zoneB.batteryLevel <= state.thresholds.batteryLow ? 'LOW' : 'NORMAL',
    tickCount: 0,
  };
}

export function stepSimulation(
  prev: SimulationState,
  tracker: TransitionStateTracker
): { nextState: SimulationState; nextTracker: TransitionStateTracker } {
  const now = new Date();
  const timeStr = formatTime(now);
  const newEvents: LogEvent[] = [];
  const newAlerts: AlertItem[] = [...prev.alerts];
  const tick = tracker.tickCount + 1;

  // 1. Natural fluctuations & simulated wave telemetry
  let gas = prev.zoneA.gasLevel;
  let temp = prev.zoneA.temperature;
  let fall = prev.zoneA.fallDetected;
  let battery = prev.zoneB.batteryLevel;
  let imuG = fall ? +(4.1 + (Math.random() - 0.5) * 0.4).toFixed(2) : +(1.0 + (Math.random() - 0.5) * 0.08).toFixed(2);

  // Drain battery slowly
  const drainRate = prev.zoneB.powerMode === 'POWER SAVING' ? 0.02 : 0.05;
  battery = Math.max(0, +(battery - drainRate).toFixed(2));

  // Natural organic wandering if no extreme scenario active
  if (prev.activeScenario === null || prev.activeScenario === 'NORMAL') {
    // Multi-harmonic realistic curve
    const wave1 = Math.sin(tick * 0.25) * 2.2;
    const wave2 = Math.cos(tick * 0.6) * 1.1;
    const microJitter = (Math.random() - 0.5) * 0.8;
    gas = +(18.0 + wave1 + wave2 + microJitter).toFixed(1);
    if (gas < 12.0) gas = 12.0;

    const tempWave = Math.sin(tick * 0.1) * 0.6;
    temp = +(24.6 + tempWave + (Math.random() - 0.5) * 0.2).toFixed(1);
    fall = false;
    imuG = +(1.0 + (Math.random() - 0.5) * 0.05).toFixed(2);
  } else if (prev.activeScenario === 'GAS_WARNING') {
    gas = +(47.0 + Math.sin(tick * 0.4) * 2.5 + (Math.random() - 0.5) * 1.2).toFixed(1);
  } else if (prev.activeScenario === 'GAS_CRITICAL') {
    gas = +(91.0 + Math.sin(tick * 0.5) * 4.0 + (Math.random() - 0.5) * 2.0).toFixed(1);
  } else if (prev.activeScenario === 'HIGH_TEMP') {
    temp = +(43.5 + Math.sin(tick * 0.2) * 1.2 + (Math.random() - 0.5) * 0.3).toFixed(1);
  } else if (prev.activeScenario === 'FALL_IMPACT') {
    fall = true;
    imuG = +(4.35 + (Math.random() - 0.5) * 0.3).toFixed(2);
  }

  // 2. Zone A packet preparation
  const newPacketSeq = prev.zoneA.packetSequence + 1;
  const newPacket: SensorPacket = {
    packetId: newPacketSeq,
    timestamp: timeStr,
    gasLevel: gas,
    temperature: temp,
    fallDetected: fall,
    sourceZone: 'ZONE_A_SENSOR',
    destinationZone: 'ZONE_B_CONTROL',
    checksumValid: true,
  };

  const packetsSent = prev.comm.packetsSent + 1;
  const isCommConnected = prev.comm.status === 'CONNECTED';

  let packetsReceived = prev.comm.packetsReceived;
  let packetsLost = prev.comm.packetsLost;
  let commQuality: CommQuality = 'EXCELLENT';
  let rxStatus: 'WAITING' | 'RECEIVED_OK' | 'VALIDATION_FAILED' | 'TIMEOUT' = 'RECEIVED_OK';
  let packetValidation: 'PASSED' | 'FAILED' | 'PENDING' = 'PASSED';
  let zoneBResponse = prev.zoneB.systemResponse;

  let packetRecord: PacketRecord;

  if (isCommConnected) {
    packetsReceived += 1;
    rxStatus = 'RECEIVED_OK';
    packetValidation = 'PASSED';
    commQuality = 'EXCELLENT';
    packetRecord = {
      ...newPacket,
      transmissionOutcome: 'SENT',
      validationResult: 'PASSED',
    };
  } else {
    packetsLost += 1;
    rxStatus = 'TIMEOUT';
    packetValidation = 'FAILED';
    commQuality = 'DISCONNECTED';
    packetRecord = {
      ...newPacket,
      transmissionOutcome: 'DROPPED',
      validationResult: 'TIMEOUT',
    };
    newEvents.push({
      id: `evt-pkt-lost-${newPacketSeq}`,
      timestamp: timeStr,
      category: 'LORA',
      message: `Simulated LoRa packet #${newPacketSeq} dropped — receiver timeout (Link Down)`,
      level: 'error',
      packetId: newPacketSeq,
    });
  }

  const deliveryRate = packetsSent > 0 ? +((packetsReceived / packetsSent) * 100).toFixed(1) : 100;

  // 3. Evaluate Hazard Rules & Transitions
  const nextTracker: TransitionStateTracker = { ...tracker, tickCount: tick };

  // Gas Evaluation
  const currentGasState =
    gas >= prev.thresholds.gasCritical
      ? 'CRITICAL'
      : gas >= prev.thresholds.gasWarning
      ? 'WARNING'
      : 'NORMAL';

  if (currentGasState !== tracker.gasState) {
    if (currentGasState === 'CRITICAL') {
      newAlerts.unshift({
        id: `alert-gas-crit-${Date.now()}`,
        timestamp: timeStr,
        severity: 'CRITICAL',
        type: 'CRITICAL_GAS_EXPOSURE',
        description: `Simulated hazardous gas level reached ${gas} ppm (Exceeded critical threshold ${prev.thresholds.gasCritical} ppm)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_A',
        sensorValue: `${gas} ppm`,
      });
      newEvents.push({
        id: `evt-gas-crit-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `CRITICAL GAS ALERT triggered: ${gas} ppm detected by Zone A`,
        level: 'error',
        packetId: newPacketSeq,
      });
      zoneBResponse = 'EMERGENCY: Evacuation protocol recommended. Visual helmet strobe activated.';
    } else if (currentGasState === 'WARNING') {
      newAlerts.unshift({
        id: `alert-gas-warn-${Date.now()}`,
        timestamp: timeStr,
        severity: 'WARNING',
        type: 'GAS_WARNING',
        description: `Simulated hazardous gas concentration elevated: ${gas} ppm (Warning threshold ${prev.thresholds.gasWarning} ppm)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_A',
        sensorValue: `${gas} ppm`,
      });
      newEvents.push({
        id: `evt-gas-warn-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `Gas warning triggered: ${gas} ppm detected by Zone A`,
        level: 'warn',
        packetId: newPacketSeq,
      });
      zoneBResponse = 'WARNING: Elevated gas concentration. Zone B safety audio beacon armed.';
    } else if (tracker.gasState !== 'NORMAL') {
      newEvents.push({
        id: `evt-gas-norm-${Date.now()}`,
        timestamp: timeStr,
        category: 'ZONE_A',
        message: `Simulated gas concentration normalized to safe baseline (${gas} ppm)`,
        level: 'info',
        packetId: newPacketSeq,
      });
    }
    nextTracker.gasState = currentGasState;
  }

  // Temperature Evaluation
  const currentTempState =
    temp >= prev.thresholds.tempCritical
      ? 'CRITICAL'
      : temp >= prev.thresholds.tempWarning
      ? 'WARNING'
      : 'NORMAL';

  if (currentTempState !== tracker.tempState) {
    if (currentTempState === 'CRITICAL') {
      newAlerts.unshift({
        id: `alert-temp-crit-${Date.now()}`,
        timestamp: timeStr,
        severity: 'CRITICAL',
        type: 'CRITICAL_TEMPERATURE',
        description: `Simulated ambient temperature reached ${temp} °C (Threshold ${prev.thresholds.tempCritical} °C)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_A',
        sensorValue: `${temp} °C`,
      });
      newEvents.push({
        id: `evt-temp-crit-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `CRITICAL TEMPERATURE: ${temp} °C detected by Zone A`,
        level: 'error',
        packetId: newPacketSeq,
      });
    } else if (currentTempState === 'WARNING') {
      newAlerts.unshift({
        id: `alert-temp-warn-${Date.now()}`,
        timestamp: timeStr,
        severity: 'WARNING',
        type: 'HIGH_TEMPERATURE',
        description: `Simulated ambient temperature elevated: ${temp} °C (Warning threshold ${prev.thresholds.tempWarning} °C)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_A',
        sensorValue: `${temp} °C`,
      });
      newEvents.push({
        id: `evt-temp-warn-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `High temperature warning: ${temp} °C detected`,
        level: 'warn',
        packetId: newPacketSeq,
      });
    } else if (tracker.tempState !== 'NORMAL') {
      newEvents.push({
        id: `evt-temp-norm-${Date.now()}`,
        timestamp: timeStr,
        category: 'ZONE_A',
        message: `Simulated temperature normalized to ${temp} °C`,
        level: 'info',
        packetId: newPacketSeq,
      });
    }
    nextTracker.tempState = currentTempState;
  }

  // Fall / Impact Detection
  if (fall !== tracker.fallState) {
    if (fall) {
      newAlerts.unshift({
        id: `alert-fall-${Date.now()}`,
        timestamp: timeStr,
        severity: 'CRITICAL',
        type: 'FALL_IMPACT_DETECTED',
        description: `Zone A 6-Axis IMU registered high-g kinetic shock (${imuG}g) followed by immobility (Possible fall/injury)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_A',
        sensorValue: `${imuG}g`,
      });
      newEvents.push({
        id: `evt-fall-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `FALL / IMPACT DETECTED: Zone A IMU recorded ${imuG}g shock vector`,
        level: 'error',
        packetId: newPacketSeq,
      });
      zoneBResponse = 'MAN-DOWN ALARM: Impact vector recorded. Dispatching simulated location beacon.';
    } else {
      newEvents.push({
        id: `evt-fall-cleared-${Date.now()}`,
        timestamp: timeStr,
        category: 'ZONE_A',
        message: 'Simulated IMU orientation and movement restored to steady state (1.0g)',
        level: 'info',
        packetId: newPacketSeq,
      });
    }
    nextTracker.fallState = fall;
  }

  // Communication status transition
  if (prev.comm.status !== tracker.commState) {
    if (prev.comm.status === 'DISCONNECTED') {
      newAlerts.unshift({
        id: `alert-comm-lost-${Date.now()}`,
        timestamp: timeStr,
        severity: 'WARNING',
        type: 'COMMUNICATION_LOST',
        description: 'Simulated LoRa Link between Zone A and Zone B severed (Packet reception timed out)',
        status: 'ACTIVE',
        relatedZone: 'LORA',
      });
      newEvents.push({
        id: `evt-comm-lost-${Date.now()}`,
        timestamp: timeStr,
        category: 'LORA',
        message: 'Communication failure: Zone B lost telemetry link to Zone A',
        level: 'warn',
        packetId: newPacketSeq,
      });
      zoneBResponse = 'COMMUNICATION TIMEOUT: Attempting automatic LoRa reconnect protocol.';
    } else {
      newEvents.push({
        id: `evt-comm-restored-${Date.now()}`,
        timestamp: timeStr,
        category: 'LORA',
        message: 'LoRa communication restored. Telemetry link re-synchronized.',
        level: 'success',
        packetId: newPacketSeq,
      });
      zoneBResponse = 'LoRa link restored. Resuming continuous hazard analysis.';
    }
    nextTracker.commState = prev.comm.status;
  }

  // Battery & Power Management
  let powerMode: PowerMode = prev.zoneB.powerMode;
  const currentBatteryState = battery <= prev.thresholds.batteryLow ? 'LOW' : 'NORMAL';
  if (currentBatteryState !== tracker.batteryState) {
    if (currentBatteryState === 'LOW') {
      powerMode = 'POWER SAVING';
      newAlerts.unshift({
        id: `alert-batt-low-${Date.now()}`,
        timestamp: timeStr,
        severity: 'WARNING',
        type: 'LOW_BATTERY',
        description: `Zone B simulated battery depleted to ${battery}% (Below ${prev.thresholds.batteryLow}% threshold)`,
        status: 'ACTIVE',
        relatedZone: 'ZONE_B',
        sensorValue: `${battery}%`,
      });
      newEvents.push({
        id: `evt-batt-low-${Date.now()}`,
        timestamp: timeStr,
        category: 'POWER',
        message: `Low battery detected (${battery}%). Zone B activated ADAPTIVE POWER SAVING mode.`,
        level: 'warn',
      });
      zoneBResponse = 'ADAPTIVE POWER SAVING ACTIVE: Non-essential peripherals throttled to extend operating life.';
    } else {
      powerMode = 'NORMAL';
      newEvents.push({
        id: `evt-batt-restored-${Date.now()}`,
        timestamp: timeStr,
        category: 'POWER',
        message: `Battery level normal (${battery}%). Zone B returned to NORMAL power mode.`,
        level: 'info',
      });
    }
    nextTracker.batteryState = currentBatteryState;
  }

  // Overall System Status
  const hasActiveCritical = newAlerts.some((a) => a.status === 'ACTIVE' && a.severity === 'CRITICAL');
  const hasActiveWarning = newAlerts.some((a) => a.status === 'ACTIVE' && a.severity === 'WARNING');
  const systemStatus: SystemStatus = hasActiveCritical
    ? 'CRITICAL'
    : hasActiveWarning
    ? 'WARNING'
    : 'NORMAL';

  // Zone status tags
  const zoneAStatus =
    currentGasState === 'CRITICAL' || currentTempState === 'CRITICAL' || fall
      ? 'CRITICAL'
      : currentGasState === 'WARNING' || currentTempState === 'WARNING'
      ? 'WARNING'
      : 'ACTIVE';

  const zoneBStatus =
    !isCommConnected
      ? 'WARNING'
      : hasActiveCritical
      ? 'CRITICAL'
      : hasActiveWarning
      ? 'WARNING'
      : 'ACTIVE';

  const activeAlertCount = newAlerts.filter((a) => a.status === 'ACTIVE').length;

  // Telemetry point
  const newTelemetry: TelemetryPoint = {
    timeStr,
    timestamp: now.getTime(),
    gas,
    temp,
    battery,
    packetsSent,
    packetsReceived,
    packetsLost,
    packetDeliveryRate: deliveryRate,
    imuShockG: imuG,
    status: systemStatus,
    activeAlertCount,
  };

  const updatedHistory = [...prev.telemetryHistory.slice(-40), newTelemetry];
  const updatedRecentPackets = [packetRecord, ...prev.recentPackets.slice(0, 49)];

  const nextState: SimulationState = {
    ...prev,
    systemStatus,
    zoneA: {
      status: zoneAStatus,
      gasLevel: gas,
      temperature: temp,
      fallDetected: fall,
      imuShockG: imuG,
      lastPacketTime: timeStr,
      packetSequence: newPacketSeq,
      txStatus: 'SENT_OK',
    },
    zoneB: {
      status: zoneBStatus,
      rxStatus,
      lastPacket: isCommConnected ? newPacket : prev.zoneB.lastPacket,
      packetValidation,
      packetsReceived,
      packetsLost,
      batteryLevel: battery,
      powerMode,
      systemResponse: zoneBResponse,
    },
    comm: {
      ...prev.comm,
      packetsSent,
      packetsReceived,
      packetsLost,
      lastPacketTime: isCommConnected ? timeStr : prev.comm.lastPacketTime,
      qualitySimulated: commQuality,
      deliveryRate,
    },
    alerts: newAlerts,
    eventLog: [...newEvents, ...prev.eventLog].slice(0, 200),
    recentPackets: updatedRecentPackets,
    telemetryHistory: updatedHistory,
  };

  return { nextState, nextTracker };
}
