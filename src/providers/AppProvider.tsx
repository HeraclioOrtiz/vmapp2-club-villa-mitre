import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';
import { store, persistor } from '../store';
import { makeServer } from '../mirage/server';
import { shouldUseMirageServer, logEnvironmentConfig, testApiConnectivity } from '../utils/environment';

// Singleton pattern to ensure Mirage only initializes once
let mirageServer: any = null;
let isInitialized = false;

const initializeMirage = () => {
  // Check environment variable to determine if Mirage should be used
  const useMirageServer = shouldUseMirageServer();

  if (isInitialized || !useMirageServer) {
    console.log('🔍 AppProvider: Mirage already initialized or disabled via environment');
    console.log('🔧 AppProvider: USE_MIRAGE_SERVER =', useMirageServer);
    return;
  }

  console.log('🚀 AppProvider: Initializing Mirage.js server (singleton)...');
  logEnvironmentConfig();
  console.log('🔧 AppProvider: Proceeding with Mirage setup');
  
  try {
    console.log('🔧 AppProvider: About to call makeServer...');
    mirageServer = makeServer({ environment: 'development' });
    isInitialized = true;
    console.log('✅ AppProvider: Mirage.js server initialized successfully');
    console.log('📡 AppProvider: Mirage server created with routes');
    console.log('🗄️ AppProvider: Server instance:', !!mirageServer);
  } catch (error) {
    console.error('❌ AppProvider: Failed to initialize Mirage.js server:', error);
    console.error('💥 AppProvider: Error details:', error);
  }
};

interface AppProviderProps {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#136F29" />
  </View>
);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Mirage on component mount
    initializeMirage();
    
    // Test API connectivity if not using Mirage
    if (!shouldUseMirageServer()) {
      console.log('🔍 Running connectivity test...');
      testApiConnectivity().catch(error => {
        console.error('🚨 Connectivity test failed during app initialization:', error);
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
