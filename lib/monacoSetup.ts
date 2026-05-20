import type { editor } from 'monaco-editor'
import { defineAllEditorThemes } from './editorThemes'
import { REACT_RN_EXTRA_LIB } from './monacoRnTypes'
import type { EditorThemeId } from './types'

let configured = false

const webpackModule = module as NodeModule & {
  hot?: { dispose: (cb: () => void) => void }
}
if (webpackModule.hot) {
  webpackModule.hot.dispose(() => {
    configured = false
  })
}

const RN_SNIPPETS = [
  {
    label: 'rn-component',
    insertText: [
      "import { View, Text, StyleSheet } from 'react-native';",
      '',
      'export default function App() {',
      '  return (',
      '    <View style={styles.container}>',
      '      <Text>Hello</Text>',
      '    </View>',
      '  );',
      '}',
      '',
      'const styles = StyleSheet.create({',
      '  container: { flex: 1, padding: 20 },',
      '});',
    ].join('\n'),
    detail: 'RN component scaffold',
  },
  {
    label: 'useState',
    insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initial});',
    insertTextRules: 4, // InsertAsSnippet
    detail: 'React useState hook',
  },
  {
    label: 'FlatList',
    insertText: [
      '<FlatList',
      '  data={${1:data}}',
      '  keyExtractor={(item) => item.id}',
      '  renderItem={({ item }) => (',
      '    <View testID={`item-\${item.id}`}>',
      '      <Text>{item.name}</Text>',
      '    </View>',
      '  )}',
      '/>',
    ].join('\n'),
    detail: 'FlatList with data + renderItem',
  },
]

export function defineEditorThemes(monaco: typeof import('monaco-editor')) {
  defineAllEditorThemes(monaco)
}

export function setupMonaco(monaco: typeof import('monaco-editor')) {
  if (configured) return
  configured = true

  defineEditorThemes(monaco)

  const compilerOptions = {
    allowJs: true,
    allowNonTsExtensions: true,
    checkJs: false,
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    esModuleInterop: true,
  }

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions)
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    REACT_RN_EXTRA_LIB,
    'ts:react-native-labs.d.ts'
  )

  monaco.languages.registerCompletionItemProvider('javascript', {
    triggerCharacters: ['.', '<', "'", '@'],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = RN_SNIPPETS.map((s) => ({
        label: s.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: s.insertText,
        ...(s.insertTextRules !== undefined
          ? { insertTextRules: s.insertTextRules }
          : {}),
        detail: s.detail,
        range,
      }))

      const rnApis = [
        'View', 'Text', 'TextInput', 'TouchableOpacity', 'ScrollView', 'FlatList',
        'StyleSheet', 'KeyboardAvoidingView', 'Platform', 'useState', 'useEffect',
        'useCallback', 'useContext', 'useMemo', 'useRef', 'memo', 'createContext',
      ].map((name) => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: name,
        detail: 'React Native / React',
        range,
      }))

      return { suggestions: [...suggestions, ...rnApis] }
    },
  })
}

export function getMonacoTheme(theme: EditorThemeId): string {
  return theme
}

export function buildEditorOptions(
  settings: { fontSize: number; minimap: boolean; wordWrap: boolean },
  readOnly: boolean
): editor.IStandaloneEditorConstructionOptions {
  return {
    readOnly,
    automaticLayout: true,
    lineNumbers: 'on',
    fontSize: settings.fontSize,
    fontFamily: "'Fira Code', 'Cascadia Code', 'Menlo', monospace",
    fontLigatures: true,
    minimap: { enabled: settings.minimap },
    scrollBeyondLastLine: false,
    wordWrap: settings.wordWrap ? 'on' : 'off',
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    suggestOnTriggerCharacters: true,
    quickSuggestions: { other: true, comments: false, strings: true },
    wordBasedSuggestions: 'matchingDocuments',
    parameterHints: { enabled: true },
    suggest: {
      showSnippets: true,
      preview: true,
      showKeywords: true,
      showIcons: true,
    },
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    padding: { top: 8 },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    renderLineHighlight: 'all',
    links: true,
    colorDecorators: true,
  }
}
