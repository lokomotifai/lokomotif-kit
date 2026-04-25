import { compose, type Module } from '@lokomotif/sdk';

const ROLE: Module = {
  id: 'roles/cross-industry/test-role',
  version: '1.0.0',
  kind: 'role',
  title: 'Test role',
  description: 'A fixture used by blueprint adapter tests.',
  industry: ['cross-industry'],
  languages: ['en'],
  owner: 'lokomotif-core',
  license: 'Apache-2.0',
  body: {
    identity: { en: 'Acting as a test analyst.' },
    expertise: [{ en: 'Test domain expertise.' }],
  },
};

const TASK: Module = {
  id: 'tasks/cross-industry/test-task',
  version: '1.0.0',
  kind: 'task',
  title: 'Test task',
  description: 'A fixture used by blueprint adapter tests.',
  industry: ['cross-industry'],
  languages: ['en'],
  owner: 'lokomotif-core',
  license: 'Apache-2.0',
  body: {
    instructions: { en: 'Summarize the input.' },
    output_format: { type: 'markdown' },
  },
};

export function fixtureComposition() {
  return compose([ROLE, TASK]);
}
