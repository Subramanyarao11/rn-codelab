import type { ProblemDefinition } from './types'

export const PROBLEMS: ProblemDefinition[] = [
  {
    id: 1,
    slug: 'frozen-flatlist',
    title: 'The Frozen FlatList',
    subtitle: 'FlatList renders nothing even though data exists.',
    difficulty: 'intermediate',
    tags: ['FlatList', 'keyExtractor', 'data prop'],
    description:
      'Users report that the list of items never appears on screen. The component mounts without errors, and the data array is clearly populated, but the FlatList stays blank.',
    symptoms: [
      'No items rendered on screen',
      'No errors in console',
      'Data array logs correctly',
    ],
    yourTask: [
      'Fix the FlatList so all items render',
      "Each item must show the item's name",
      'The list must update if data changes',
    ],
    hint: 'What two props does FlatList absolutely require to render anything?',
    brokenCode: `import { View, FlatList, Text, StyleSheet } from 'react-native';

const data = [
  { id: '1', name: 'React Native' },
  { id: '2', name: 'Expo' },
  { id: '3', name: 'Metro Bundler' },
  { id: '4', name: 'StyleSheet' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="title">Tech Stack</Text>
      <FlatList
        items={data}
        render={({ item }) => (
          <View style={styles.item} testID={\`item-\${item.id}\`}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemText: { color: '#111827', fontSize: 16 },
});`,
    solutionCode: `import { View, FlatList, Text, StyleSheet } from 'react-native';

const data = [
  { id: '1', name: 'React Native' },
  { id: '2', name: 'Expo' },
  { id: '3', name: 'Metro Bundler' },
  { id: '4', name: 'StyleSheet' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="title">Tech Stack</Text>
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        initialNumToRender={data.length}
        renderItem={({ item }) => (
          <View style={styles.item} testID={\`item-\${item.id}\`}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  list: { flex: 1 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemText: { color: '#111827', fontSize: 16 },
});`,
    testCases: [
      { id: '1a', description: "Renders the title 'Tech Stack'", type: 'dom_text', selector: 'title', expectedText: 'Tech Stack' },
      { id: '1b', description: 'Renders all 4 list items', type: 'dom_exists', selectors: ['item-1', 'item-2', 'item-3', 'item-4'] },
      { id: '1c', description: "Each item shows its name", type: 'dom_text', selector: 'item-1', expectedText: 'React Native' },
    ],
  },
  {
    id: 2,
    slug: 'ghost-textinput',
    title: 'The Ghost TextInput',
    subtitle: 'Typing into the TextInput does nothing — it stays empty.',
    difficulty: 'intermediate',
    tags: ['TextInput', 'controlled input', 'state'],
    description:
      'This form has a TextInput that should let users type a name and display it below. But no matter what you type, the input field does not update and the greeting still shows "stranger".',
    symptoms: [
      'TextInput does not reflect typed characters',
      'Display always shows "stranger"',
      'No console errors',
    ],
    yourTask: [
      'Fix the TextInput so typing works',
      'Display should update as the user types',
    ],
    hint: 'What makes a TextInput "controlled" in React Native?',
    brokenCode: `import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function App() {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        placeholderTextColor="#9ca3af"
        testID="name-input"
      />
      <Text testID="display" style={styles.display}>
        Hello, {name || 'stranger'}!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8, color: '#111827' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827' },
  display: { marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#111827' },
});`,
    solutionCode: `import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function App() {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        placeholderTextColor="#9ca3af"
        testID="name-input"
        value={name}
        onChangeText={setName}
      />
      <Text testID="display" style={styles.display}>
        Hello, {name || 'stranger'}!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8, color: '#111827' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827' },
  display: { marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#111827' },
});`,
    testCases: [
      { id: '2a', description: "Shows 'Hello, stranger!' initially", type: 'dom_text', selector: 'display', expectedText: 'Hello, stranger!' },
      { id: '2b', description: 'TextInput exists and is rendered', type: 'dom_exists', selector: 'name-input' },
      { id: '2c', description: 'Typing updates the display text', type: 'interaction', action: 'type', actionTarget: 'name-input', actionValue: 'Alice', selector: 'display', expectedText: 'Alice' },
    ],
  },
  {
    id: 3,
    slug: 'invisible-style',
    title: 'The Invisible Style',
    subtitle: 'The component renders but nothing is visible on screen.',
    difficulty: 'intermediate',
    tags: ['StyleSheet', 'flexbox', 'dimensions'],
    description:
      'This card component should display a coloured box with text centred inside. But the screen is completely blank — no box, no text, nothing.',
    symptoms: ['Blank white screen', 'No errors in console', 'Component mounts successfully'],
    yourTask: [
      'Make the card and text visible on screen',
      'Centre the card in the viewport',
    ],
    hint: 'In React Native, what is the default flex value of a View, and why does a child View need dimensions or flex to be visible?',
    brokenCode: `import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} testID="card-title">Welcome</Text>
        <Text style={styles.subtitle} testID="card-subtitle">React Native Flexbox</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#6200ea',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ddd', fontSize: 14, marginTop: 6 },
});`,
    solutionCode: `import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title} testID="card-title">Welcome</Text>
        <Text style={styles.subtitle} testID="card-subtitle">React Native Flexbox</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#6200ea',
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ddd', fontSize: 14, marginTop: 6 },
});`,
    testCases: [
      { id: '3a', description: 'Card title is visible', type: 'dom_exists', selector: 'card-title' },
      { id: '3b', description: "Card title says 'Welcome'", type: 'dom_text', selector: 'card-title', expectedText: 'Welcome' },
      { id: '3c', description: 'Subtitle is visible', type: 'dom_exists', selector: 'card-subtitle' },
    ],
  },
  {
    id: 4,
    slug: 'runaway-scrollview',
    title: 'The Runaway ScrollView',
    subtitle: "ScrollView won't scroll — content is clipped at the bottom.",
    difficulty: 'intermediate',
    tags: ['ScrollView', 'flex', 'contentContainerStyle'],
    description:
      'This screen has a long list of items inside a ScrollView. But the list is cut off and scrolling does nothing. Items below the fold are completely unreachable.',
    symptoms: ['Only first few items visible', 'Scrolling has no effect', 'Last items unreachable'],
    yourTask: [
      'Fix ScrollView so all 20 items are reachable',
      'Header should stay visible above the list',
    ],
    hint: 'When a ScrollView is inside a flex container, what stops it from consuming all the available space and scrolling properly?',
    brokenCode: `import { View, ScrollView, Text, StyleSheet } from 'react-native';

const items = Array.from({ length: 20 }, (_, i) => ({ id: String(i), label: \`Item \${i + 1}\` }));

export default function App() {
  return (
    <View style={styles.outer}>
      <Text style={styles.header} testID="header">My List</Text>
      <ScrollView>
        {items.map(item => (
          <View key={item.id} style={styles.row} testID={\`row-\${item.id}\`}>
            <Text style={styles.rowText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  row: { padding: 14, borderBottomWidth: 1, borderColor: '#eee' },
  rowText: { color: '#111827', fontSize: 16 },
});`,
    solutionCode: `import { View, ScrollView, Text, StyleSheet } from 'react-native';

const items = Array.from({ length: 20 }, (_, i) => ({ id: String(i), label: \`Item \${i + 1}\` }));

export default function App() {
  return (
    <View style={styles.outer}>
      <Text style={styles.header} testID="header">My List</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {items.map(item => (
          <View key={item.id} style={styles.row} testID={\`row-\${item.id}\`}>
            <Text style={styles.rowText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  row: { padding: 14, borderBottomWidth: 1, borderColor: '#eee' },
  rowText: { color: '#111827', fontSize: 16 },
});`,
    testCases: [
      { id: '4a', description: 'Header renders', type: 'dom_text', selector: 'header', expectedText: 'My List' },
      { id: '4b', description: 'First item renders', type: 'dom_exists', selector: 'row-0' },
      { id: '4c', description: 'Last item exists in DOM', type: 'dom_exists', selector: 'row-19' },
    ],
  },
  {
    id: 5,
    slug: 'stale-asyncstorage',
    title: 'The Stale AsyncStorage',
    subtitle: 'Saved data never loads when the app reopens.',
    difficulty: 'intermediate',
    tags: ['useEffect', 'AsyncStorage', 'async/await'],
    description:
      'This note-saver app should load previously saved text from AsyncStorage on mount. But the input always starts empty, even when data was definitely saved.',
    symptoms: ['Input always empty on mount', 'Save appears to work', 'No errors shown'],
    yourTask: [
      'Fix useEffect so saved notes load on mount',
      'Save button should still work',
    ],
    hint: 'You defined an async loader inside useEffect — is it actually being called?',
    brokenCode: `import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadNote() {
      const stored = await AsyncStorage.getItem('note');
      if (stored) setNote(stored);
    }
    // Bug: loadNote is never invoked, so saved text never appears on mount
  }, []);

  const saveNote = async () => {
    await AsyncStorage.setItem('note', note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Note</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        multiline
        testID="note-input"
        placeholder="Write something..."
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity style={styles.button} onPress={saveNote} testID="save-btn">
        <Text style={styles.btnText}>{saved ? 'Saved!' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827', textAlignVertical: 'top' },
  button: { marginTop: 12, backgroundColor: '#6200ea', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    solutionCode: `import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      const stored = await AsyncStorage.getItem('note');
      if (stored) setNote(stored);
    };
    loadNote();
  }, []);

  const saveNote = async () => {
    await AsyncStorage.setItem('note', note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Note</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        multiline
        testID="note-input"
        placeholder="Write something..."
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity style={styles.button} onPress={saveNote} testID="save-btn">
        <Text style={styles.btnText}>{saved ? 'Saved!' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827', textAlignVertical: 'top' },
  button: { marginTop: 12, backgroundColor: '#6200ea', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    testCases: [
      { id: '5a', description: 'App renders without crashing', type: 'no_crash' },
      { id: '5b', description: 'TextInput is present', type: 'dom_exists', selector: 'note-input' },
      { id: '5c', description: 'Save button is present', type: 'dom_exists', selector: 'save-btn' },
      {
        id: '5d',
        description: 'Loads saved note from AsyncStorage on mount',
        type: 'dom_text',
        selector: 'note-input',
        expectedText: 'My saved note',
        storageSeed: { note: 'My saved note' },
      },
    ],
  },
  {
    id: 6,
    slug: 'lost-navigation-params',
    title: 'The Lost Navigation Params',
    subtitle: 'Params passed to a screen are always undefined.',
    difficulty: 'intermediate',
    tags: ['React Navigation', 'useRoute', 'params'],
    description:
      'This app navigates from a Home screen to a Details screen, passing a product ID and name. But the Details screen always shows "undefined" for both values.',
    symptoms: ['Details screen shows undefined', 'Navigation works', 'Params passed from Home'],
    yourTask: [
      'Fix Details screen to show correct id and name',
      'Navigation should still work from Home',
    ],
    hint: 'How does useRoute differ from useNavigation, and which one gives you access to params?',
    brokenCode: `import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="home-title">Products</Text>
      <TouchableOpacity
        testID="nav-btn"
        style={styles.button}
        onPress={() => navigation.navigate('Details', { id: 42, name: 'Widget Pro' })}
      >
        <Text style={styles.btnText}>View Widget Pro</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen({ route }) {
  const { id, name } = useNavigation().params;
  return (
    <View style={styles.container}>
      <Text testID="detail-name" style={styles.title}>{name}</Text>
      <Text testID="detail-id" style={styles.bodyText}>ID: {id}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  bodyText: { fontSize: 18, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 14, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    solutionCode: `import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="home-title">Products</Text>
      <TouchableOpacity
        testID="nav-btn"
        style={styles.button}
        onPress={() => navigation.navigate('Details', { id: 42, name: 'Widget Pro' })}
      >
        <Text style={styles.btnText}>View Widget Pro</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen() {
  const route = useRoute();
  const { id, name } = route.params;
  return (
    <View style={styles.container}>
      <Text testID="detail-name" style={styles.title}>{name}</Text>
      <Text testID="detail-id" style={styles.bodyText}>ID: {id}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  bodyText: { fontSize: 18, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 14, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    testCases: [
      { id: '6a', description: 'Home screen renders', type: 'dom_exists', selector: 'home-title' },
      { id: '6b', description: 'Navigate button exists', type: 'dom_exists', selector: 'nav-btn' },
      {
        id: '6c',
        description: 'Details screen shows product name after navigation',
        type: 'interaction',
        action: 'press',
        actionTarget: 'nav-btn',
        selector: 'detail-name',
        expectedText: 'Widget Pro',
      },
      {
        id: '6d',
        description: 'Details screen shows correct id',
        type: 'dom_text',
        selector: 'detail-id',
        expectedText: 'ID: 42',
      },
    ],
  },
  {
    id: 7,
    slug: 'keyboard-hider',
    title: 'The Keyboard Hider',
    subtitle: 'The keyboard covers the submit button on iOS.',
    difficulty: 'intermediate',
    tags: ['KeyboardAvoidingView', 'Platform', 'behavior'],
    description:
      "This login form works fine on Android, but on iOS the keyboard slides up and completely covers the Submit button. Users can't submit the form.",
    symptoms: ['Submit button hidden behind keyboard on iOS', 'Works on Android', 'Form otherwise functional'],
    yourTask: [
      'Fix KeyboardAvoidingView for iOS',
      'All inputs and submit button should remain accessible',
    ],
    howToTest: [
      'In Preview, keep the platform toggle on **iOS** (default for this challenge).',
      'Tap **Email** or **Password** — a simulated iOS keyboard rises and covers the Sign In button.',
      'Switch preview to **Android** — the keyboard overlay stays hidden (works as on Android).',
      'After you add `behavior` + `Platform`, the overlay disappears and a green badge shows KAV is active.',
      'Optional: open **Snack** → choose iOS in Snack to test on a simulator or device.',
    ],
    hint: 'What is the correct behavior prop value for KeyboardAvoidingView on iOS vs Android, and how do you detect the platform?',
    brokenCode: `import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        testID="email-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      <TouchableOpacity style={styles.button} testID="submit-btn">
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#111827' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});`,
    solutionCode: `import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        testID="email-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      <TouchableOpacity style={styles.button} testID="submit-btn">
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#111827' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});`,
    testCases: [
      { id: '7a', description: 'Form renders without crashing', type: 'no_crash' },
      { id: '7b', description: 'Email input is present', type: 'dom_exists', selector: 'email-input' },
      { id: '7c', description: 'Submit button is present', type: 'dom_exists', selector: 'submit-btn' },
    ],
  },
  {
    id: 8,
    slug: 'phantom-touchable',
    title: 'The Phantom TouchableOpacity',
    subtitle: 'The button is visible but tapping it does nothing.',
    difficulty: 'intermediate',
    tags: ['TouchableOpacity', 'zIndex', 'pointerEvents'],
    description:
      "There's a Checkout button at the bottom of the screen. It looks perfectly fine and renders correctly, but pressing it never triggers the onPress handler.",
    symptoms: ['Button visible but not tappable', 'onPress never fires', 'No visual feedback on press'],
    yourTask: [
      'Fix the button so tapping increments the cart count',
      'Overlay should not block touches',
    ],
    hint: 'What happens when an absolutely positioned View sits on top of another component without pointerEvents configured?',
    brokenCode: `import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="title">Cart ({count} items)</Text>
      <View style={styles.overlay} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCount(c => c + 1)}
        testID="checkout-btn"
      >
        <Text style={styles.btnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  button: { backgroundColor: '#6200ea', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});`,
    solutionCode: `import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="title">Cart ({count} items)</Text>
      <View style={styles.overlay} pointerEvents="none" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCount(c => c + 1)}
        testID="checkout-btn"
      >
        <Text style={styles.btnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  button: { backgroundColor: '#6200ea', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});`,
    testCases: [
      { id: '8a', description: 'Title renders', type: 'dom_exists', selector: 'title' },
      { id: '8b', description: 'Button renders', type: 'dom_exists', selector: 'checkout-btn' },
      { id: '8c', description: 'Pressing button increments count', type: 'interaction', action: 'press', actionTarget: 'checkout-btn', selector: 'title', expectedText: '1' },
    ],
  },
  {
    id: 9,
    slug: 'missing-memo',
    title: 'The Missing Memo',
    subtitle: 'Child component re-renders on every parent state change even though its props do not change.',
    difficulty: 'intermediate',
    tags: ['useCallback', 'React.memo', 're-render'],
    description:
      'This app has a parent with a counter and a heavy child component that displays a static greeting. Every time the counter changes, the child re-renders unnecessarily.',
    symptoms: ['Child re-renders when counter changes', 'Greeting props unchanged', 'Performance degrades'],
    yourTask: [
      'Prevent unnecessary re-renders of Greeting',
      'Wave button and counter should still work',
    ],
    hint: "React.memo alone isn't enough if you pass functions as props. Why?",
    brokenCode: `import { useState, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Greeting = memo(function Greeting({ name, onGreet }) {
  return (
    <View style={styles.card}>
      <Text testID="greeting" style={styles.greetText}>Hello, {name}!</Text>
      <TouchableOpacity onPress={onGreet} testID="greet-btn" style={styles.greetBtn}>
        <Text style={styles.greetBtnText}>Wave 👋</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [waves, setWaves] = useState(0);

  const handleGreet = () => setWaves(w => w + 1);

  return (
    <View style={styles.container}>
      <Greeting name="Alice" onGreet={handleGreet} />
      <Text testID="wave-count" style={styles.info}>Waves: {waves}</Text>
      <Text testID="count" style={styles.info}>Counter: {count}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCount(c => c + 1)} testID="inc-btn">
        <Text style={styles.btnText}>Increment Counter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  card: { backgroundColor: '#f3e5f5', borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center' },
  greetText: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  greetBtn: { backgroundColor: '#6200ea', padding: 10, borderRadius: 8 },
  greetBtnText: { color: '#fff' },
  info: { fontSize: 16, marginBottom: 8, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    solutionCode: `import { useState, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Greeting = memo(function Greeting({ name, onGreet }) {
  return (
    <View style={styles.card}>
      <Text testID="greeting" style={styles.greetText}>Hello, {name}!</Text>
      <TouchableOpacity onPress={onGreet} testID="greet-btn" style={styles.greetBtn}>
        <Text style={styles.greetBtnText}>Wave 👋</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [waves, setWaves] = useState(0);

  const handleGreet = useCallback(() => setWaves(w => w + 1), []);

  return (
    <View style={styles.container}>
      <Greeting name="Alice" onGreet={handleGreet} />
      <Text testID="wave-count" style={styles.info}>Waves: {waves}</Text>
      <Text testID="count" style={styles.info}>Counter: {count}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setCount(c => c + 1)} testID="inc-btn">
        <Text style={styles.btnText}>Increment Counter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  card: { backgroundColor: '#f3e5f5', borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center' },
  greetText: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#111827' },
  greetBtn: { backgroundColor: '#6200ea', padding: 10, borderRadius: 8 },
  greetBtnText: { color: '#fff' },
  info: { fontSize: 16, marginBottom: 8, color: '#111827' },
  button: { backgroundColor: '#6200ea', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    testCases: [
      { id: '9a', description: 'Greeting renders Alice', type: 'dom_text', selector: 'greeting', expectedText: 'Hello, Alice!' },
      { id: '9b', description: 'Wave button exists', type: 'dom_exists', selector: 'greet-btn' },
      { id: '9c', description: 'Increment button exists', type: 'dom_exists', selector: 'inc-btn' },
    ],
  },
  {
    id: 10,
    slug: 'confused-context',
    title: 'The Confused Context',
    subtitle: 'useContext returns undefined even though a Provider exists.',
    difficulty: 'intermediate',
    tags: ['Context API', 'Provider', 'useContext'],
    description:
      'This app uses a ThemeContext to pass a dark/light mode flag to child components. But useContext(ThemeContext) always returns undefined, and the child crashes trying to destructure it.',
    symptoms: ['useContext returns undefined', 'App may crash on render', 'Provider exists in tree'],
    yourTask: [
      'Fix context so ThemedCard receives theme and toggleTheme',
      'Toggle button should switch between light and dark',
    ],
    hint: 'Where exactly must a component be positioned relative to its Provider to access context?',
    brokenCode: `import { createContext, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThemeContext = createContext(null);

function ThemedCard() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text testID="theme-label" style={[styles.label, isDark && styles.labelDark]}>
        Current theme: {theme}
      </Text>
      <TouchableOpacity onPress={toggleTheme} testID="toggle-btn" style={styles.button}>
        <Text style={styles.btnText}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="app-title">Theme Switcher</Text>
      <ThemedCard />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
      </ThemeContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center' },
  cardDark: { backgroundColor: '#1a1a1a' },
  label: { fontSize: 18, marginBottom: 16, color: '#111827' },
  labelDark: { color: '#fff' },
  button: { backgroundColor: '#6200ea', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    solutionCode: `import { createContext, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ThemeContext = createContext(null);

function ThemedCard() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text testID="theme-label" style={[styles.label, isDark && styles.labelDark]}>
        Current theme: {theme}
      </Text>
      <TouchableOpacity onPress={toggleTheme} testID="toggle-btn" style={styles.button}>
        <Text style={styles.btnText}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <View style={styles.container}>
        <Text style={styles.title} testID="app-title">Theme Switcher</Text>
        <ThemedCard />
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center' },
  cardDark: { backgroundColor: '#1a1a1a' },
  label: { fontSize: 18, marginBottom: 16, color: '#111827' },
  labelDark: { color: '#fff' },
  button: { backgroundColor: '#6200ea', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});`,
    testCases: [
      { id: '10a', description: 'App title renders', type: 'dom_exists', selector: 'app-title' },
      { id: '10b', description: 'Theme label is visible', type: 'dom_exists', selector: 'theme-label' },
      { id: '10c', description: 'Toggle button exists', type: 'dom_exists', selector: 'toggle-btn' },
      { id: '10d', description: "Initial theme is 'light'", type: 'dom_text', selector: 'theme-label', expectedText: 'Current theme: light' },
    ],
  },
]

export function getProblem(id: number): ProblemDefinition | undefined {
  return PROBLEMS.find((p) => p.id === id)
}

export function getProblemBySlug(slug: string): ProblemDefinition | undefined {
  return PROBLEMS.find((p) => p.slug === slug)
}

export const TOTAL_PROBLEMS = PROBLEMS.length
