import assert from 'assert';
import createProjectName from '../src/createProjectName';

describe('createProjectName', () => {

  it('should return project name.', () => {
    const cases = [
      ['/path/to/project', 'project'],
      ['/path/to/project-name', 'project-name'],
      ['/path/to/project.name', 'project.name'],
      ['/path/to/project_name', 'project-name'],
      ['/path/to/project*name', 'project-name'],
      ['/path/to/project name', 'project-name'],
      ['/path/to/projectあname', 'project-name'],
      ['/path/to/-project', 'project'],
      ['/path/to/.project', 'project'],
      ['/path/to/project-', 'project'],
      ['/path/to/project.', 'project'],
      ['/path/to/------', ''],
      ['/path/to/.......', '']
    ];

    cases.forEach(([dirname, expected]) => {
      const actual = createProjectName(dirname);

      assert(typeof actual === 'string');
      assert(actual === expected);
    });

  });

});
