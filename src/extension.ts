import * as vscode from 'vscode';

const baseUrl = 'http://127.0.0.1:8081';

const workspaceFolderNameToComponentName = new Map([
  ['minimapui', 'ui'],
  ['minimapsrv', 'server'],
  ['minimapext', 'extension'],
  ['codesrv', 'codeserver'],
]);

async function handleDidChangeActiveTextEditor(e: vscode.TextEditor | undefined) {
  let componentName = '';
  
  if (e === undefined) {
    console.log('No editor is active');
  } else {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(e.document.uri);
    console.log(`Active editor is ${e.document.uri} in workspace folder ${workspaceFolder?.name}`);

    if (workspaceFolder !== undefined) {
      componentName = workspaceFolderNameToComponentName.get(workspaceFolder.name) ?? '';
    }
  }

  try {
    await fetch(baseUrl + '/component/', {
      method: 'POST',
      body: componentName,
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
