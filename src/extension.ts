const vscode = require('vscode');
const { exec } = require('child_process');

function activate(context: any) {
    console.log('Flutter ARB Watcher attivo!');

    let disposable = vscode.workspace.onDidSaveTextDocument((document: any) => {
        // Controlla se il file salvato è un .arb
        if (document.fileName.endsWith('.arb')) {
            const config = vscode.workspace.getConfiguration('flutterArbWatcher');
            
            if (config.get('autoRun')) {
                runFlutterGen();
            }
        }
    });

    context.subscriptions.push(disposable);
}

function runFlutterGen() {
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;

    if (!workspaceFolder) {return;}

    // Mostra un messaggio nella status bar
    vscode.window.setStatusBarMessage('$(sync~spin) Rigenerazione l10n...', 2000);

    exec('flutter gen-l10n', { cwd: workspaceFolder }, (error: any, stdout: any, stderr: any) => {
        if (error) {
            vscode.window.showErrorMessage(`Errore gen-l10n: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });

	// const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Flutter L10n');
	// terminal.sendText('flutter gen-l10n');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};