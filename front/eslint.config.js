import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'boundaries': boundaries,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          'mode': 'full',
          'type': 'shared',
          'pattern': [
            'src/components/**/*',
            'src/hooks/**/*',
            'src/lib/**/*',
            'src/shared/**/*'
          ]
        },
        {
          'mode': 'full',
          'type': 'feature',
          'capture': ['featureName'],
          'pattern': ['src/features/*/**/*']
        },
        {
          'mode': 'full',
          'type': 'app',
          'capture': ['_', 'fileName'],
          'pattern': ['src/app/**/*']
        },
        {
          'mode': 'full',
          'type': 'root',
          'pattern': ['src/*.{ts,tsx}', 'src/*.css']
        },
        {
          'mode': 'full',
          'type': 'neverImport',
          'pattern': ['src/*', 'src/tasks/**/*']
        }
      ]
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'boundaries/no-unknown': ['error'],
      'boundaries/no-unknown-files': ['error'],
      'boundaries/element-types': [
        'error',
        {
          'default': 'disallow',
          'rules': [
            {
              'from': ['shared'],
              'allow': ['shared']
            },
            {
              'from': ['feature'],
              'allow': [
                'shared',
                ['feature', { 'featureName': '${from.featureName}' }]
              ]
            },
            {
              'from': ['app', 'neverImport'],
              'allow': ['shared', 'feature']
            },
            {
              'from': ['app'],
              'allow': [['app', { 'fileName': '*.css' }]]
            },
            {
              'from': ['root'],  // Add rule for root files like main.tsx
              'allow': ['app', 'shared', 'feature', 'root']
            }
          ]
        }
      ]
    },
  },
)