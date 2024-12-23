const REGEX = /[\u4e00-\u9fff\uff00-\uffef\u3000-\u303f\u2014\u2018-\u2019\u2026\u201c\u201d]/

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    // https://commitlint.js.org/reference/rules.html
    'no-chinese': [2, 'always'],
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'docs', 'test', 'build', 'other']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'always'],
    'subject-empty': [2, 'never'],
    'body-empty': [0, 'never']
  },
  prompt: {
    questions: {
      type: {
        enum: {
          build: {
            description: 'Changes that affect the build system or CI/CD configuration'
          },
          other: {
            description: 'Changes that not belong to the types above'
          }
        }
      }
    }
  },
  plugins: [
    {
      rules: {
        'no-chinese': (parsed) => {
          return [
            !REGEX.test(`${parsed.header}${parsed.body}${parsed.footer}`),
            'avoid using Chinese in commit messages'
          ]
        }
      }
    }
  ]
}

export default Configuration
