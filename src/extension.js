const vscode = require('vscode');
const { VialCustomEditorProvider } = require('./vialCustomEditorProvider');

function activate(context) {
  const providerRegistration = vscode.window.registerCustomEditorProvider(
    VialCustomEditorProvider.viewType,
    new VialCustomEditorProvider(context),
    {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }
  );

  context.subscriptions.push(providerRegistration);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
