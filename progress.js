// 進捗ページのタブ切り替え機能
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // タブ切り替え機能
    function switchTab(targetTab) {
        // すべてのタブボタンとペインからactiveクラスを削除
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // クリックされたタブボタンにactiveクラスを追加
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // 対応するタブペインにactiveクラスを追加
        const activePane = document.getElementById(targetTab);
        if (activePane) {
            activePane.classList.add('active');
        }
    }

    // タブボタンにクリックイベントを追加
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // URLハッシュに基づいてタブを切り替え
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetTab = hash.replace('tab-', '');
            if (document.getElementById(targetTab)) {
                switchTab(targetTab);
            }
        }
    }

    // ページ読み込み時とハッシュ変更時にタブを切り替え
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // タブボタンクリック時にURLハッシュを更新
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            window.history.pushState(null, null, `#tab-${targetTab}`);
        });
    });

    // 進捗バーのアニメーション
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = width;
            }, index * 100);
        });
    }

    // 概要タブが表示された時に進捗バーをアニメーション
    const overviewTab = document.querySelector('[data-tab="overview"]');
    if (overviewTab) {
        overviewTab.addEventListener('click', () => {
            setTimeout(animateProgressBars, 100);
        });
    }

    // 初期表示時に進捗バーをアニメーション（概要タブがアクティブな場合）
    if (document.querySelector('.tab-pane.active').id === 'overview') {
        setTimeout(animateProgressBars, 500);
    }

    // スクロール位置を保存・復元
    let scrollPosition = 0;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            scrollPosition = window.pageYOffset;
        });
    });

    // ページ内リンクのスムーススクロール
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // レスポンシブなタブナビゲーション
    function handleResponsiveTabs() {
        const tabNavigation = document.querySelector('.tab-navigation');
        const tabButtons = document.querySelectorAll('.tab-button');
        
        if (window.innerWidth <= 768) {
            tabNavigation.classList.add('mobile-tabs');
        } else {
            tabNavigation.classList.remove('mobile-tabs');
        }
    }

    // ウィンドウリサイズ時にレスポンシブ対応
    window.addEventListener('resize', handleResponsiveTabs);
    handleResponsiveTabs(); // 初期実行

    // キーボードナビゲーション
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeButton = document.querySelector('.tab-button.active');
            if (!activeButton) return;

            const buttons = Array.from(tabButtons);
            const currentIndex = buttons.indexOf(activeButton);
            let nextIndex;

            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }

            const nextButton = buttons[nextIndex];
            if (nextButton) {
                nextButton.click();
                nextButton.focus();
            }
        }
    });

    // フォーカス管理
    tabButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.setAttribute('tabindex', '0');
        });
        
        button.addEventListener('blur', function() {
            this.setAttribute('tabindex', '-1');
        });
    });

    // 最初のタブボタンにフォーカス可能にする
    const firstTabButton = tabButtons[0];
    if (firstTabButton) {
        firstTabButton.setAttribute('tabindex', '0');
    }
});