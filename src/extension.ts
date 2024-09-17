import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('minimapext is running and watching for editor activity');

	const subscription = vscode.window.onDidChangeActiveTextEditor((e) => {
		if (e === undefined) {
			console.log('No editor is active');
		} else {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(e.document.uri);
      console.log(`Active editor is ${e.document.uri} in workspace folder ${workspaceFolder?.name}`);
    }
	});
	context.subscriptions.push(subscription);
}

export function deactivate() {}
