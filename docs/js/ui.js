class UIManager {
  constructor() {
    this.searchManager = new SearchManager();
    this.searchQuery = '';
    this.suggestions = [];
    this.searchResult = null;
    this.showSuggestions = false;
    this.suggestionTimeout = null;
    
    this.initializeElements();
    this.bindEvents();
    this.initialize();
  }

  initializeElements() {
    this.elements = {
      searchInput: document.getElementById('searchInput'),
      searchButton: document.getElementById('searchButton'),
      suggestionsList: document.getElementById('suggestionsList'),
      result: document.getElementById('result'),
      error: document.getElementById('error'),
      jsClass: document.getElementById('jsClass'),
      filePath: document.getElementById('filePath'),
      rpcClass: document.getElementById('rpcClass'),
      rpcName: document.getElementById('rpcName'),
      loadingIndicator: document.getElementById('loading')
    };
    
    // copyButtonは動的に生成されるため、存在しない場合がある
    this.elements.copyButton = document.getElementById('copyButton');
  }

  bindEvents() {
    // 検索ボタンクリック
    this.elements.searchButton.addEventListener('click', () => {
      this.handleSearch(this.elements.searchInput.value);
    });

    // エンターキーで検索
    this.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch(this.elements.searchInput.value);
        this.hideSuggestions();
      }
    });

    // 入力変更でサジェスト
    this.elements.searchInput.addEventListener('input', (e) => {
      this.handleInputChange(e.target.value);
    });

    // フォーカスアウトでサジェスト非表示（遅延）
    this.elements.searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.hideSuggestions();
      }, 200);
    });

    // フォーカスインでサジェスト表示
    this.elements.searchInput.addEventListener('focus', () => {
      if (this.suggestions.length > 0) {
        this.showSuggestionsDropdown();
      }
    });

    // コピーボタン（存在する場合のみ）
    if (this.elements.copyButton) {
      this.elements.copyButton.addEventListener('click', () => {
        this.copyToClipboard();
      });
    }

    // 外側クリックでサジェスト非表示
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideSuggestions();
      }
    });
  }

  async initialize() {
    try {
      console.log('Starting UI initialization...');
      this.showLoading();
      await this.searchManager.initialize();
      this.hideLoading();
      console.log('UI initialized successfully');
    } catch (error) {
      this.hideLoading();
      this.showError('アプリケーションの初期化に失敗しました');
      console.error('UI initialization failed:', error);
    }
  }

  async handleSearch(query) {
    if (!query || !query.trim()) {
      this.hideResult();
      return;
    }

    try {
      this.showLoading();
      this.hideError();
      const result = await this.searchManager.search(query);
      this.showResult(result);
    } catch (error) {
      this.showError(error.message);
      this.hideResult();
    } finally {
      this.hideLoading();
    }
  }

  async handleInputChange(value) {
    console.log('handleInputChange called with:', value);
    this.searchQuery = value;
    
    // CSVデータが読み込まれていない場合は何もしない
    if (this.searchManager.getDataLoading()) {
      console.log('CSV data still loading, skipping suggestions');
      return;
    }
    
    // 既存のタイムアウトをクリア
    if (this.suggestionTimeout) {
      clearTimeout(this.suggestionTimeout);
    }

    if (value.trim().length > 0) {
      console.log('Input length > 0, setting timeout for suggestions');
      // デバウンス処理
      this.suggestionTimeout = setTimeout(async () => {
        try {
          console.log('Fetching suggestions for:', value);
          const suggestions = await this.searchManager.getSuggestions(value);
          console.log('Got suggestions:', suggestions);
          this.suggestions = suggestions;
          if (suggestions.length > 0) {
            this.showSuggestionsDropdown();
          } else {
            console.log('No suggestions found, hiding dropdown');
            this.hideSuggestions();
          }
        } catch (error) {
          console.error("Failed to get suggestions:", error);
          this.suggestions = [];
          this.hideSuggestions();
        }
      }, 300);
    } else {
      console.log('Input empty, hiding suggestions');
      this.suggestions = [];
      this.hideSuggestions();
      this.hideResult();
    }
  }

  showSuggestionsDropdown() {
    console.log('showSuggestionsDropdown called with suggestions:', this.suggestions);
    if (this.suggestions.length === 0) return;

    const html = this.suggestions.map(suggestion => 
      `<div class="suggestion-item" onclick="window.uiManager.selectSuggestion('${suggestion}')">${suggestion}</div>`
    ).join('');
    
    console.log('Setting suggestions HTML:', html);
    this.elements.suggestionsList.innerHTML = html;
    this.elements.suggestionsList.style.display = 'block';
    this.showSuggestions = true;
  }

  hideSuggestions() {
    this.elements.suggestionsList.style.display = 'none';
    this.showSuggestions = false;
  }

  selectSuggestion(suggestion) {
    this.elements.searchInput.value = suggestion;
    this.searchQuery = suggestion;
    this.hideSuggestions();
    this.handleSearch(suggestion);
  }

  showResult(result) {
    // RPC情報を表示
    this.elements.rpcClass.textContent = result.rpcClass;
    this.elements.rpcName.textContent = result.rpcName;
    
    // 複数のJavaScriptクラスを表示
    const jsClassContainer = document.getElementById('jsClassContainer');
    jsClassContainer.innerHTML = '';
    
    result.jsMappings.forEach((mapping, index) => {
      const jsItem = document.createElement('div');
      jsItem.className = 'js-mapping-item';
      jsItem.innerHTML = `
        <div class="js-class-header">
          <span class="js-class-number">#${index + 1}</span>
          <span class="js-class-name">${mapping.jsClass}.js</span>
        </div>
        <div class="file-path-container">
          <div class="result-label">FILE PATH</div>
          <div class="result-value file-path-value">${mapping.filePath}</div>
          <button class="copy-btn" onclick="uiManager.copySpecificPath('${mapping.filePath}')">パスをコピー</button>
        </div>
      `;
      jsClassContainer.appendChild(jsItem);
    });
    
    this.elements.result.classList.add('show');
    this.searchResult = result;
  }

  hideResult() {
    this.elements.result.classList.remove('show');
    this.searchResult = null;
  }

  showError(message) {
    this.elements.error.textContent = message;
    this.elements.error.classList.add('show');
  }

  hideError() {
    this.elements.error.classList.remove('show');
  }

  showLoading() {
    this.elements.loadingIndicator.style.display = 'block';
  }

  hideLoading() {
    this.elements.loadingIndicator.style.display = 'none';
  }

  async copyToClipboard() {
    if (!this.searchResult || !this.searchResult.jsMappings || this.searchResult.jsMappings.length === 0) return;
    
    try {
      // 最初のファイルパスをコピー（後方互換性のため）
      await navigator.clipboard.writeText(this.searchResult.jsMappings[0].filePath);
      
      // 一時的にボタンテキストを変更
      const originalText = this.elements.copyButton.textContent;
      this.elements.copyButton.textContent = 'コピーしました！';
      this.elements.copyButton.style.backgroundColor = '#4caf50';
      
      setTimeout(() => {
        this.elements.copyButton.textContent = originalText;
        this.elements.copyButton.style.backgroundColor = '';
      }, 2000);
    } catch (error) {
      this.showError('コピーに失敗しました');
    }
  }

  async copySpecificPath(filePath) {
    try {
      await navigator.clipboard.writeText(filePath);
      
      // 成功メッセージを表示
      this.showTemporaryMessage('パスをコピーしました！');
    } catch (error) {
      this.showError('コピーに失敗しました');
    }
  }

  showTemporaryMessage(message) {
    // 既存のメッセージがあれば削除
    const existingMessage = document.querySelector('.temp-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // メッセージ要素を作成
    const messageEl = document.createElement('div');
    messageEl.className = 'temp-message';
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
    `;

    document.body.appendChild(messageEl);

    // 2秒後に削除
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 2000);
  }
}

// ページ読み込み時に初期化
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
  uiManager = new UIManager();
  // グローバルに公開（サジェスト選択用）
  window.uiManager = uiManager;
});