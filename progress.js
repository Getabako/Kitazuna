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
    
    // 感情の色分け
    function applyEmotionColors() {
        // 感情のカテゴリー分けマップ
        const emotionColorMap = {
            // 喜び・嬉しさ系 - 黄色・オレンジ
            'joy': ['喜', '歓', '笑', '和', '安', '好'],
            // 悲しみ・憂い系 - 青色
            'sad': ['憂', '悲', '寂', '痛', '諦', '深'],
            // 怒り・緊張系 - 赤色
            'anger': ['怒', '恐', '危', '警', '熱', '燃'],
            // 困惑・驚き系 - オレンジ色
            'confused': ['困', '驚', '呆', '疑', '汗', '震'],
            // 決意・真剣系 - 紫色
            'determined': ['決', '真', '志', '意', '力', '重', '厳'],
            // 愛・思いやり系 - ピンク色
            'love': ['愛', '情', '思', '優', '懐', '託'],
            // 知識・理解系 - 緑色
            'knowledge': ['知', '理', '悟', '見', '察', '明', '探'],
            // 希望・信念系 - 水色
            'hope': ['希', '信', '誇', '賛', '認', '尊'],
            // 中性・その他 - グレー
            'neutral': ['淡', '気', '感', '止', '集', '軽']
        };
        
        // 色のマップ
        const colorStyles = {
            'joy': {
                background: 'linear-gradient(135deg, #ffd700, #ffb347)',
                borderColor: 'rgba(255, 215, 0, 0.7)',
                color: '#333'
            },
            'sad': {
                background: 'linear-gradient(135deg, #4a90e2, #7bb3f0)',
                borderColor: 'rgba(74, 144, 226, 0.7)',
                color: 'white'
            },
            'anger': {
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                borderColor: 'rgba(231, 76, 60, 0.7)',
                color: 'white'
            },
            'confused': {
                background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                borderColor: 'rgba(243, 156, 18, 0.7)',
                color: '#333'
            },
            'determined': {
                background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                borderColor: 'rgba(155, 89, 182, 0.7)',
                color: 'white'
            },
            'love': {
                background: 'linear-gradient(135deg, #e91e63, #ad1457)',
                borderColor: 'rgba(233, 30, 99, 0.7)',
                color: 'white'
            },
            'knowledge': {
                background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                borderColor: 'rgba(39, 174, 96, 0.7)',
                color: 'white'
            },
            'hope': {
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                borderColor: 'rgba(52, 152, 219, 0.7)',
                color: 'white'
            },
            'neutral': {
                background: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                borderColor: 'rgba(149, 165, 166, 0.7)',
                color: 'white'
            }
        };
        
        // 全ての感情要素を取得して色を適用
        const emotionElements = document.querySelectorAll('.emotion');
        emotionElements.forEach(element => {
            const emotionText = element.textContent.trim();
            
            // 感情文字に対応するカテゴリーを見つける
            let emotionCategory = 'neutral'; // デフォルト
            
            for (const [category, emotions] of Object.entries(emotionColorMap)) {
                if (emotions.includes(emotionText)) {
                    emotionCategory = category;
                    break;
                }
            }
            
            // スタイルを適用
            const style = colorStyles[emotionCategory];
            element.style.background = style.background;
            element.style.borderColor = style.borderColor;
            element.style.color = style.color;
            
            // data属性も追加（将来のカスタマイズ用）
            element.setAttribute('data-emotion', emotionText);
            element.setAttribute('data-emotion-category', emotionCategory);
        });
    }
    
    // ページ読み込み時に感情色を適用
    applyEmotionColors();
    
    // タブ切り替え時にも感情色を再適用
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(applyEmotionColors, 100);
        });
    });
});