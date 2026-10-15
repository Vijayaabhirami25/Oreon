import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './components/pages/OverviewPage';
import { ZoneAPage } from './components/pages/ZoneAPage';
import { ZoneBPage } from './components/pages/ZoneBPage';
import { LoraCommPage } from './components/pages/LoraCommPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { EventLogsPage } from './components/pages/EventLogsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import {
  SimulationState,
  DemoScenarioType,
  ThresholdConfig,
  LogEvent,
  NavTab,
  AppSettings,
} from './types/mineguard';
import {
  createInitialState,
  createTransitionTracker,
  stepSimulation,
  formatTime,
} from './services/simulationEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Single shared source of truth
  const [state, setState] = useState<SimulationState>(() => createInitialState());

  // Transition tracker kept in ref to prevent duplicate alert storms
  const trackerRef = useRef(createTransitionTracker(state));

  // Step simulation function
  const executeTick = useCallback(() => {
    setState((prevState) => {
      const { nextState, nextTracker } = stepSimulation(prevState, trackerRef.current);
      trackerRef.current = nextTracker;
      return nextState;
    });
  }, []);

  // Interval timer effect — never disrupted by navigation!
  useEffect(() => {
    if (!state.isRunning) return;

    const intervalId = setInterval(() => {
      executeTick();
    }, state.settings.updateIntervalMs || state.tickIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [state.isRunning, state.settings.updateIntervalMs, state.tickIntervalMs, executeTick]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    setState((prev) => {
      const newRunning = !prev.isRunning;
      const timeStr = formatTime();
      const newEvent: LogEvent = {
        id: `evt-play-${Date.now()}`,
        timestamp: timeStr,
        category: 'SYSTEM',
        message: newRunning ? 'Simulation engine resumed by supervisor.' : 'Simulation engine paused by supervisor.',
        level: 'info',
      };

      return {
        ...prev,
        isRunning: newRunning,
        eventLog: [newEvent, ...prev.eventLog].slice(0, 200),
      };
    });
  };

  // Reset Simulation
  const handleReset = () => {
    const fresh = createInitialState();
    trackerRef.current = createTransitionTracker(fresh);
    const timeStr = formatTime();
    fresh.eventLog = [
      {
        id: `evt-reset-${Date.now()}`,
        timestamp: timeStr,
        category: 'SYSTEM',
        message: 'Simulation reset: All telemetry, alerts, and counters restored to baseline.',
        level: 'info',
      },
      ...fresh.eventLog,
    ];
    setState(fresh);
  };

  // Scenario Triggers (Updates state and evaluates immediately)
  const handleTriggerScenario = (scenario: DemoScenarioType) => {
    if (scenario === 'RESET') {
      handleReset();
      return;
    }

    setState((prev) => {
      const timeStr = formatTime();
      const newEvents: LogEvent[] = [];

      let updatedScenario: string | null = scenario;
      let nextZoneA = { ...prev.zoneA };
      let nextZoneB = { ...prev.zoneB };
      let nextComm = { ...prev.comm };

      switch (scenario) {
        case 'NORMAL':
          updatedScenario = 'NORMAL';
          nextZoneA.gasLevel = 18.2;
          nextZoneA.temperature = 24.6;
          nextZoneA.fallDetected = false;
          nextZoneA.imuShockG = 1.0;
          nextZoneA.status = 'ACTIVE';
          nextComm.status = 'CONNECTED';
          nextComm.qualitySimulated = 'EXCELLENT';
          nextZoneB.batteryLevel = 92.0;
          nextZoneB.powerMode = 'NORMAL';
          nextZoneB.systemResponse = 'Nominal baseline monitoring. Dual-zone LoRa link verified.';
          newEvents.push({
            id: `evt-scen-norm-${Date.now()}`,
            timestamp: timeStr,
            category: 'SYSTEM',
            message: 'DEMO SCENARIO: Normal Operation restored. Safe baseline telemetry and nominal link active.',
            level: 'success',
          });
          break;

        case 'GAS_WARNING':
          nextZoneA.gasLevel = 48.0;
          nextZoneA.status = 'WARNING';
          newEvents.push({
            id: `evt-scen-gaswarn-${Date.now()}`,
            timestamp: timeStr,
            category: 'ZONE_A',
            message: `DEMO SCENARIO: Gas Warning triggered (48.0 ppm > ${prev.thresholds.gasWarning} ppm threshold).`,
            level: 'warn',
          });
          break;

        case 'GAS_CRITICAL':
          nextZoneA.gasLevel = 92.0;
          nextZoneA.status = 'CRITICAL';
          newEvents.push({
            id: `evt-scen-gascrit-${Date.now()}`,
            timestamp: timeStr,
            category: 'ZONE_A',
            message: `DEMO SCENARIO: Critical Gas Alert triggered (92.0 ppm > ${prev.thresholds.gasCritical} ppm threshold).`,
            level: 'error',
          });
          break;

        case 'HIGH_TEMP':
          nextZoneA.temperature = 43.5;
          nextZoneA.status = 'WARNING';
          newEvents.push({
            id: `evt-scen-temp-${Date.now()}`,
            timestamp: timeStr,
            category: 'ZONE_A',
            message: `DEMO SCENARIO: High Temperature triggered (43.5 °C > ${prev.thresholds.tempWarning} °C threshold).`,
            level: 'warn',
          });
          break;

        case 'FALL_IMPACT':
          nextZoneA.fallDetected = true;
          nextZoneA.imuShockG = 4.3;
          nextZoneA.status = 'CRITICAL';
          newEvents.push({
            id: `evt-scen-fall-${Date.now()}`,
            timestamp: timeStr,
            category: 'ZONE_A',
            message: 'DEMO SCENARIO: Fall / Impact event injected. Zone A IMU 6-axis shock flag raised (4.3g).',
            level: 'error',
          });
          break;

        case 'COMM_FAILURE':
          nextComm.status = 'DISCONNECTED';
          nextComm.qualitySimulated = 'DISCONNECTED';
          nextZoneB.rxStatus = 'TIMEOUT';
          newEvents.push({
            id: `evt-scen-commfail-${Date.now()}`,
            timestamp: timeStr,
            category: 'LORA',
            message: 'DEMO SCENARIO: LoRa Communication Failure injected. Inter-zone RF link severed.',
            level: 'warn',
          });
          break;

        case 'RESTORE_COMM':
          nextComm.status = 'CONNECTED';
          nextComm.qualitySimulated = 'EXCELLENT';
          nextZoneB.rxStatus = 'RECEIVED_OK';
          newEvents.push({
            id: `evt-scen-commrest-${Date.now()}`,
            timestamp: timeStr,
            category: 'LORA',
            message: 'DEMO SCENARIO: LoRa Communication restored. Zone B resuming packet synchronization.',
            level: 'success',
          });
          break;

        case 'LOW_BATTERY':
          nextZoneB.batteryLevel = 14.0;
          nextZoneB.powerMode = 'POWER SAVING';
          newEvents.push({
            id: `evt-scen-lowbatt-${Date.now()}`,
            timestamp: timeStr,
            category: 'POWER',
            message: 'DEMO SCENARIO: Low Battery injected (14.0%). Zone B engaged Adaptive Power Saving mode.',
            level: 'warn',
          });
          break;
      }

      const intermediate = {
        ...prev,
        activeScenario: updatedScenario,
        zoneA: nextZoneA,
        zoneB: nextZoneB,
        comm: nextComm,
        eventLog: [...newEvents, ...prev.eventLog].slice(0, 200),
      };

      const { nextState, nextTracker } = stepSimulation(intermediate, trackerRef.current);
      trackerRef.current = nextTracker;
      return nextState;
    });
  };

  // Acknowledge Single Alert
  const handleAcknowledgeAlert = (id: string) => {
    setState((prev) => {
      const timeStr = formatTime();
      let ackType = '';
      const updatedAlerts = prev.alerts.map((alert) => {
        if (alert.id === id) {
          ackType = alert.type;
          return {
            ...alert,
            status: 'ACKNOWLEDGED' as const,
            acknowledgedAt: timeStr,
          };
        }
        return alert;
      });

      const newEvent: LogEvent = {
        id: `evt-ack-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: `Alert [${ackType}] acknowledged by safety control supervisor.`,
        level: 'info',
      };

      return {
        ...prev,
        alerts: updatedAlerts,
        eventLog: [newEvent, ...prev.eventLog].slice(0, 200),
      };
    });
  };

  // Acknowledge All Alerts
  const handleAcknowledgeAll = () => {
    setState((prev) => {
      const timeStr = formatTime();
      const updatedAlerts = prev.alerts.map((alert) => ({
        ...alert,
        status: 'ACKNOWLEDGED' as const,
        acknowledgedAt: timeStr,
      }));

      const newEvent: LogEvent = {
        id: `evt-ack-all-${Date.now()}`,
        timestamp: timeStr,
        category: 'ALERT',
        message: 'All active hazard alerts acknowledged by supervisor.',
        level: 'info',
      };

      return {
        ...prev,
        alerts: updatedAlerts,
        eventLog: [newEvent, ...prev.eventLog].slice(0, 200),
      };
    });
  };

  // Clear Event Log
  const handleClearLog = () => {
    setState((prev) => ({
      ...prev,
      eventLog: [
        {
          id: `evt-log-cleared-${Date.now()}`,
          timestamp: formatTime(),
          category: 'SYSTEM',
          message: 'Event log cleared by supervisor.',
          level: 'info',
        },
      ],
    }));
  };

  // Save Thresholds
  const handleSaveThresholds = (newThresholds: ThresholdConfig) => {
    setState((prev) => {
      const timeStr = formatTime();
      const newEvent: LogEvent = {
        id: `evt-thresh-update-${Date.now()}`,
        timestamp: timeStr,
        category: 'SYSTEM',
        message: `Thresholds updated: Gas [${newThresholds.gasWarning}/${newThresholds.gasCritical} ppm], Temp [${newThresholds.tempWarning}/${newThresholds.tempCritical} °C], Batt [${newThresholds.batteryLow}%].`,
        level: 'info',
      };

      return {
        ...prev,
        thresholds: newThresholds,
        eventLog: [newEvent, ...prev.eventLog].slice(0, 200),
      };
    });
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const activeAlertCount = state.alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171A21] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeAlertCount={activeAlertCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          isRunning={state.isRunning}
          systemStatus={state.systemStatus}
          activeScenario={state.activeScenario}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <OverviewPage
              state={state}
              onNavigate={(tab) => setActiveTab(tab)}
              onTriggerScenario={handleTriggerScenario}
            />
          )}

          {activeTab === 'zone-a' && (
            <ZoneAPage
              zoneA={state.zoneA}
              thresholds={state.thresholds}
              telemetryHistory={state.telemetryHistory}
              onTriggerScenario={handleTriggerScenario}
            />
          )}

          {activeTab === 'zone-b' && (
            <ZoneBPage
              zoneB={state.zoneB}
              thresholds={state.thresholds}
              recentPackets={state.recentPackets}
              telemetryHistory={state.telemetryHistory}
            />
          )}

          {activeTab === 'lora' && (
            <LoraCommPage
              comm={state.comm}
              recentPackets={state.recentPackets}
              telemetryHistory={state.telemetryHistory}
              onTriggerScenario={handleTriggerScenario}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage
              telemetryHistory={state.telemetryHistory}
              thresholds={state.thresholds}
              activeScenario={state.activeScenario}
              onTriggerScenario={handleTriggerScenario}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={state.alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onAcknowledgeAll={handleAcknowledgeAll}
            />
          )}

          {activeTab === 'logs' && (
            <EventLogsPage
              events={state.eventLog}
              onClearLog={handleClearLog}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              thresholds={state.thresholds}
              settings={state.settings}
              isRunning={state.isRunning}
              onSaveThresholds={handleSaveThresholds}
              onUpdateSettings={handleUpdateSettings}
              onTogglePlay={handleTogglePlay}
              onResetSimulation={handleReset}
            />
          )}
        </main>

        {/* Enterprise Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-4 px-6 text-xs text-[#697386]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              OREON © {new Date().getFullYear()} • <span className="text-[#171A21] font-medium">Intelligence Beneath the Surface.</span> • Team <strong className="text-[#171A21]">VAYUJ NEXUS</strong> (HSN|TN|00803) • Tamil Nadu
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              Dual-Zone Hardware Architecture & Adaptive Power Management • Software Prototype Simulation
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
