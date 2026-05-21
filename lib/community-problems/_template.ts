import type { ProblemDefinition } from '@/lib/types'

/**
 * Copy this template when opening a PR with a new community challenge.
 * Assign id >= 100, export from ./index.ts, and remove this comment block.
 */
export const communityProblemTemplate: ProblemDefinition = {
  id: 100,
  slug: 'your-slug-here',
  title: 'Your Challenge Title',
  subtitle: 'One-line summary of the bug.',
  difficulty: 'intermediate',
  tags: ['TagOne', 'TagTwo'],
  origin: 'community',
  contributor: {
    name: 'Your Name',
    github: 'your-github-username',
  },
  description: 'Bug report paragraph.',
  symptoms: ['Symptom one', 'Symptom two'],
  yourTask: ['Task one', 'Task two'],
  hint: 'A hint that nudges without spoiling.',
  brokenCode: `import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text testID="title">Hello</Text>
    </View>
  );
}`,
  solutionCode: `import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text testID="title">Hello</Text>
    </View>
  );
}`,
  testCases: [
    { id: '100a', description: 'Title renders', type: 'dom_exists', selector: 'title' },
  ],
}
