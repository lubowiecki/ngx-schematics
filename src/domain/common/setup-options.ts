import { Location, parseName } from '@schematics/angular/utility/parse-name';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectDefinition, WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { isDefined, Maybe } from '@lubowiecki/ts-utility';

import { Options } from './options';
import { SchemaOptions } from './schema-options';

function getProject(workspace: WorkspaceDefinition, projectName = [...workspace.projects.keys()][0]): Maybe<ProjectDefinition> {
	const project: Maybe<ProjectDefinition> = workspace.projects.get(projectName);

	if (!project) {
		throw new SchematicsException(`Project with name ${project} not found.`);
	}

	return project;
}

function getPath(project: ProjectDefinition, path: string | undefined): string {
	return path != null ? normalize(`${project.root}/${path}`) : normalize(`${project.sourceRoot}`);
}

export default async function getSetupOptions(tree: Tree, options: SchemaOptions): Promise<Maybe<Options>> {
	const workspace: WorkspaceDefinition = await getWorkspace(tree);
	const project: Maybe<ProjectDefinition> = getProject(workspace, options.project);
	let setupOptions: Maybe<Options> = null;

	if (isDefined(project)) {
		const path: string = getPath(project, options.path);
		const location: Location = parseName(path, options.name);

		setupOptions = {
			name: location.name,
			path: location.path,
			flat: !!options.flat,
		};
	}

	return setupOptions;
}
