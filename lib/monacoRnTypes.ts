/** Minimal React + React Native typings for Monaco IntelliSense (in-browser). */
export const REACT_RN_EXTRA_LIB = `
declare module 'react' {
  export function useState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps: unknown[]): T;
  export function useContext<T>(ctx: unknown): T;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function memo<T>(c: T): T;
  export function createContext<T>(defaultValue: T): unknown;
  export type ReactNode = unknown;
  export type FC<P = object> = (props: P) => ReactNode;
  const React: { createElement: unknown };
  export default React;
}

declare module 'react-native' {
  import type { FC, ReactNode } from 'react';
  export const View: FC<{
    style?: object;
    testID?: string;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    children?: ReactNode;
  }>;
  export const Text: FC<{ style?: object; testID?: string; children?: ReactNode }>;
  export const TextInput: FC<{
    style?: object;
    testID?: string;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    multiline?: boolean;
    secureTextEntry?: boolean;
    keyboardType?: string;
  }>;
  export const TouchableOpacity: FC<{
    style?: object;
    testID?: string;
    onPress?: () => void;
    children?: ReactNode;
  }>;
  export const ScrollView: FC<{
    style?: object;
    contentContainerStyle?: object;
    children?: ReactNode;
  }>;
  export const FlatList: FC<{
    data?: unknown[];
    renderItem?: (info: { item: unknown; index: number }) => ReactNode;
    keyExtractor?: (item: unknown, index: number) => string;
    style?: object;
    initialNumToRender?: number;
  }>;
  export const StyleSheet: {
    create<T extends Record<string, object>>(s: T): T;
    absoluteFillObject: object;
  };
  export const KeyboardAvoidingView: FC<{
    style?: object;
    behavior?: 'height' | 'position' | 'padding';
    children?: ReactNode;
  }>;
  export const Platform: { OS: 'ios' | 'android' | 'web' };
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
  };
  export default AsyncStorage;
}

declare module '@react-navigation/native' {
  export function useNavigation<T = unknown>(): T & { navigate: (name: string, params?: object) => void };
  export function useRoute<T = { params: Record<string, unknown> }>(): T;
  export const NavigationContainer: import('react').FC<{ children?: import('react').ReactNode }>;
}

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator(): {
    Navigator: import('react').FC<{ children?: import('react').ReactNode }>;
    Screen: import('react').FC<{ name: string; component: import('react').FC }>;
  };
}

declare const App: import('react').FC;
`
