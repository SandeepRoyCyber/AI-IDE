import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppState } from 'react-native';
import { releaseAll } from './src/modules/inferenceEngine';
import { getDeviceProfile } from './src/modules/deviceIntelligence';
import { getDownloadedModels } from './src/modules/modelManager';
import usePocketCoderStore from './src/store';

import HomeScreen    from './src/screens/HomeScreen';
import ModelsScreen  from './src/screens/ModelsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { setDeviceProfile, setDownloadedModels } = usePocketCoderStore();

  useEffect(() => {
    // Boot: detect device + load downloaded models list
    async function boot() {
      const profile = await getDeviceProfile();
      setDeviceProfile(profile);

      const downloaded = await getDownloadedModels();
      setDownloadedModels(downloaded);
    }
    boot();

    // Release model when app goes to background
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'background') {
        await releaseAll();
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f172a' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home"     component={HomeScreen} />
        <Stack.Screen name="Models"   component={ModelsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
