const vscode = require('vscode');

class VialCustomEditorProvider {
  static viewType = 'vialViewer.editor';

  constructor(context) {
    this.context = context;
  }

  async resolveCustomTextEditor(document, webviewPanel) {
    webviewPanel.webview.options = {
      enableScripts: true
    };

    const updateWebview = () => {
      webviewPanel.webview.html = this._getHtmlForWebview(webviewPanel.webview, document.getText());
    };

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    updateWebview();
  }

  _getHtmlForWebview(webview, textContent) {
    const escapedContent = textContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const nonce = getNonce();
    const csp = `default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <style>
    body {
      font-family: var(--vscode-font-family);
      padding: 16px;
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .search-row input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid var(--vscode-input-border);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
    }

    .search-row button {
      padding: 6px 12px;
      cursor: pointer;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: var(--vscode-progressBar-background);
      border-right-color: var(--vscode-progressBar-background);
      border-radius: 50%;
      display: none;
      animation: spin 0.8s linear infinite;
    }

    .spinner.active {
      display: inline-block;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .search-result {
      min-height: 20px;
      margin-bottom: 12px;
    }

    .tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }

    .tab-button {
      border: 1px solid var(--vscode-button-border);
      padding: 4px 10px;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: pointer;
    }

    .tab-button.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }

    .tab-panel {
      display: none;
    }

    .tab-panel.active {
      display: block;
    }

    .content {
      border: 5px solid red;
      padding: 12px;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 160px;
    }

    .placeholder {
      opacity: 0.8;
      padding: 8px 0;
    }
  </style>
</head>
<body>
  <div class="search-row">
    <input id="search-input" type="text" placeholder="Search..." />
    <button id="search-button" type="button">Search</button>
    <span id="spinner" class="spinner" aria-label="Loading"></span>
  </div>
  <div id="search-result" class="search-result"></div>

  <div class="tabs">
    <button class="tab-button active" data-tab="raw" type="button">Raw</button>
    <button class="tab-button" data-tab="table" type="button">Table</button>
    <button class="tab-button" data-tab="graph" type="button">Graph</button>
  </div>

  <div id="tab-raw" class="tab-panel active">
    <div class="content">${escapedContent}</div>
  </div>
  <div id="tab-table" class="tab-panel">
    <div class="placeholder">Table view placeholder (future iteration).</div>
  </div>
  <div id="tab-graph" class="tab-panel">
    <div class="placeholder">Graph view placeholder (future iteration).</div>
  </div>

  <script nonce="${nonce}">
    (function () {
      const input = document.getElementById('search-input');
      const button = document.getElementById('search-button');
      const spinner = document.getElementById('spinner');
      const result = document.getElementById('search-result');
      const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
      const panels = {
        raw: document.getElementById('tab-raw'),
        table: document.getElementById('tab-table'),
        graph: document.getElementById('tab-graph')
      };

      tabButtons.forEach((tabButton) => {
        tabButton.addEventListener('click', () => {
          tabButtons.forEach((tb) => tb.classList.remove('active'));
          Object.values(panels).forEach((panel) => panel.classList.remove('active'));

          const selectedTab = tabButton.getAttribute('data-tab');
          tabButton.classList.add('active');
          panels[selectedTab].classList.add('active');
        });
      });

      button.addEventListener('click', () => {
        const query = input.value || '';
        spinner.classList.add('active');
        result.textContent = '';

        setTimeout(() => {
          spinner.classList.remove('active');
          result.textContent = 'HELLO ' + query;
        }, 3000);
      });
    })();
  </script>
</body>
</html>`;
  }
}

function getNonce() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {
  VialCustomEditorProvider
};
