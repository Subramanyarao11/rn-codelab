import { transform } from '@babel/standalone'
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
  memo,
  createContext,
} from 'react'
import * as RN from 'react-native'
import { createPlatformMock, type PreviewPlatformOS } from './previewPlatform'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation, useRoute } from '@react-navigation/native'

try {
  const { enableScreens } = require('react-native-screens')
  enableScreens(false)
} catch {
  // optional in test environment
}

function prepareCode(code: string): string {
  return code
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/export\s+default\s+/g, '')
    .trim()
}

function transpileJsx(code: string): string {
  const prepared = prepareCode(code)
  try {
    const { code: output } = transform(prepared, {
      presets: [['react', { runtime: 'classic' }]],
      filename: 'App.jsx',
    })
    if (!output) {
      throw new Error('Babel produced no output')
    }
    return output
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transpile failed'
    throw new Error(`Could not transpile JSX: ${message}`)
  }
}

export type EvalUserCodeOptions = {
  /** Override Platform.OS in the preview sandbox (web | ios | android). */
  platformOS?: PreviewPlatformOS
}

export function evalUserCode(
  code: string,
  options: EvalUserCodeOptions = {}
): React.ComponentType {
  const body = transpileJsx(code)
  const Platform =
    options.platformOS != null ? createPlatformMock(options.platformOS) : RN.Platform

  const fn = new Function(
    'React',
    'useState',
    'useEffect',
    'useCallback',
    'useContext',
    'useMemo',
    'useRef',
    'memo',
    'createContext',
    'View',
    'Text',
    'TextInput',
    'TouchableOpacity',
    'ScrollView',
    'FlatList',
    'StyleSheet',
    'KeyboardAvoidingView',
    'Platform',
    'AsyncStorage',
    'NavigationContainer',
    'createNativeStackNavigator',
    'useNavigation',
    'useRoute',
    `
    ${body}
    if (typeof App !== 'undefined') return App;
    throw new Error('No App component found. Export default function App() { ... }');
    `
  )

  const Component = fn(
    React,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
    useRef,
    memo,
    createContext,
    RN.View,
    RN.Text,
    RN.TextInput,
    RN.TouchableOpacity,
    RN.ScrollView,
    RN.FlatList,
    RN.StyleSheet,
    RN.KeyboardAvoidingView,
    Platform,
    AsyncStorage,
    NavigationContainer,
    createNativeStackNavigator,
    useNavigation,
    useRoute
  )

  if (!Component || typeof Component !== 'function') {
    throw new Error('Could not evaluate App component from user code')
  }

  return Component as React.ComponentType
}
