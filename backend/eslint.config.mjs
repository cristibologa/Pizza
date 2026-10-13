import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    node: true,
    ignores: ['**/*.gql', '_disabled']
  },
  {
    name: 'juniorsbootcamp/rewrite',
    rules: {
      'node/prefer-global/process': 'off',
      'ts/consistent-type-imports': 'off'
    }
  },
  {
    name: 'juniorsbootcamp/sort',
    rules: {
      'perfectionist/sort-decorators': [
        'error',
        {
          type: 'alphabetical',
          customGroups: [
            {
              groupName: 'nest-structural',
              elementNamePattern: '^(Module|Controller|Injectable|Catch|Scope|SetMetadata)$'
            },
            {
              groupName: 'nest-http',
              elementNamePattern:
                '^(Get|Post|Put|Delete|Patch|Options|Head|All|HttpCode|Redirect|Header|Version|Render|Sse)$'
            },
            {
              groupName: 'swagger',
              elementNamePattern: '^Api'
            },
            {
              groupName: 'graphql-type',
              elementNamePattern: '^(ObjectType|InputType|ArgsType|InterfaceType)$'
            },
            {
              groupName: 'graphql-resolver',
              elementNamePattern:
                '^(Field|ResolveField|Query|Mutation|Subscription|Directive|Extensions|Parent|Args|Info|Context|Root)$'
            },
            {
              groupName: 'mongoose',
              elementNamePattern: '^(Schema|Prop)$'
            },
            {
              groupName: 'nest-middleware',
              elementNamePattern: '.*(?:Guard|Interceptor|Filter|Pipe)s?$'
            },
            {
              groupName: 'nest-params',
              elementNamePattern:
                '^(Body|Param|Query|Headers|Ip|HostParam|Session|Req|Res|Next|Inject|Optional)$'
            },
            {
              groupName: 'class-transformer',
              elementNamePattern: '^(Type|Expose|Exclude|Transform)$'
            },
            {
              groupName: 'class-validator',
              elementNamePattern:
                '^(Is|Validate|Min|Max|MinLength|MaxLength|Matches|Length|Equals|NotEquals|Contains|NotContains|Allow)'
            }
          ],
          groups: [
            'swagger',
            'nest-structural',
            'nest-http',
            'graphql-type',
            'graphql-resolver',
            'mongoose',
            'nest-middleware',
            'nest-params',
            'class-transformer',
            'class-validator',
            'unknown'
          ]
        }
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'alphabetical',
          useConfigurationIf: {
            callingFunctionNamePattern: '^[A-Z][a-zA-Z0-9]*$'
          },
          customGroups: [
            {
              groupName: 'type',
              elementNamePattern: '^type$'
            },
            {
              groupName: 'description',
              elementNamePattern: '^description$'
            },
            {
              groupName: 'example',
              elementNamePattern: '^(example|examples)$'
            },
            {
              groupName: 'enum',
              elementNamePattern: '^enum$'
            },
            {
              groupName: 'required',
              elementNamePattern: '^(required|nullable|isArray|optional)$'
            },
            {
              groupName: 'default',
              elementNamePattern: '^default$'
            }
          ],
          groups: ['type', 'description', 'example', 'enum', 'required', 'default', 'unknown']
        },
        {
          type: 'unsorted'
        }
      ]
    }
  }
);
