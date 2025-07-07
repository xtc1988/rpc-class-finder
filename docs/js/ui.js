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
      copyButton: document.getElementById('copyButton'),
      loadingIndicator: document.getElementById('loading')
    };
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

    // コピーボタン
    this.elements.copyButton.addEventListener('click', () => {
      this.copyToClipboard();
    });

    // 外側クリックでサジェスト非表示
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideSuggestions();
      }
    });
  }

  async initialize() {
    try {
      this.showLoading();
      await this.searchManager.initialize();
      this.hideLoading();
      console.log('UI initialized');
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
    this.searchQuery = value;
    
    // 既存のタイムアウトをクリア
    if (this.suggestionTimeout) {
      clearTimeout(this.suggestionTimeout);
    }

    if (value.trim().length > 0) {
      // デバウンス処理
      this.suggestionTimeout = setTimeout(async () => {
        try {
          const suggestions = await this.searchManager.getSuggestions(value);
          console.log('Got suggestions:', suggestions);
          this.suggestions = suggestions;
          if (suggestions.length > 0) {
            this.showSuggestionsDropdown();
          } else {
            this.hideSuggestions();
          }
        } catch (error) {
          console.error("Failed to get suggestions:", error);
          this.suggestions = [];
          this.hideSuggestions();
        }
      }, 300);
    } else {
      this.suggestions = [];
      this.hideSuggestions();
      this.hideResult();
    }
  }

  showSuggestionsDropdown() {
    if (this.suggestions.length === 0) return;

    const html = this.suggestions.map(suggestion => 
      `<div class="suggestion-item" onclick="uiManager.selectSuggestion('${suggestion}')">${suggestion}</div>`
    ).join('');
    
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
    this.elements.jsClass.textContent = result.jsClass + '.js';
    this.elements.filePath.textContent = result.filePath;
    this.elements.rpcClass.textContent = result.rpcClass;
    this.elements.rpcName.textContent = result.rpcName;
    
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
    if (!this.searchResult) return;
    
    try {
      await navigator.clipboard.writeText(this.searchResult.filePath);
      
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
}

// ページ読み込み時に初期化
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
  uiManager = new UIManager();
});

// グローバルに公開（サジェスト選択用）
window.uiManager = uiManager;