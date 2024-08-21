import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";
import SplashScreen from "./screens/Splash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();
// ...

function App() {
  const isLoggedIn = true; // Replace with your actual login check logic

  const [state, setState] = React.useState({
    isLoading: false,
    isOnboardingCompleted: true,
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(
        "onboardingCompleted"
      );
      if (onboardingCompleted !== null) {
        // If onboardingCompleted exists, proceed based on its value
        return onboardingCompleted === "true";
      }
      // If onboardingCompleted does not exist, return false or handle as needed
      return false;
    } catch (error) {
      console.error(
        "Error reading onboarding status from AsyncStorage:",
        error
      );
      return false; // Fallback in case of error
    }
  };

  const saveOnboardingStatus = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const getOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem("onboardingCompleted");
      return status === "true";
    } catch (error) {
      console.error(
        "Error reading onboarding status from AsyncStorage:",
        error
      );
    }
  };

  if (state.isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
