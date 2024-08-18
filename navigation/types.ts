// src/navigation/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

// Define your stack navigator parameters
export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  // Add other screens as needed
};

// Define the navigation prop type
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
