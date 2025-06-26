import * as vscode from 'vscode';

const baseUrl = vscode.workspace.getConfiguration('minimapext').minimapServerUrl;

async function handleDidChangeActiveTextEditor(e: vscode.TextEditor | undefined) {
  let componentName = '';
  let relativePath = '';
  
  if (e === undefined) {
    console.log('No editor is active');
  } else {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(e.document.uri);
    console.log(`Active editor is ${e.document.uri} in workspace folder ${workspaceFolder?.name}`);
    relativePath = vscode.workspace.asRelativePath(e.document.uri, false);
    console.log(`Relative path of current editor is ${relativePath}`);

    if (workspaceFolder !== undefined) {
      componentName = workspaceFolder.name ?? '';
    }
  }

  try {
    await fetch(baseUrl + '/component/', {
      method: 'POST',
      body: JSON.stringify({
        component: componentName,
        relativePath,
      }),
    });
  } catch (e) {
    console.error('Failed to send active editor update', e);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('minimapext is running and watching for editor activity');

  handleDidChangeActiveTextEditor(vscode.window.activeTextEditor);
  const subscription = vscode.window.onDidChangeActiveTextEditor(handleDidChangeActiveTextEditor);
  context.subscriptions.push(subscription);
}

export function deactivate() { }
