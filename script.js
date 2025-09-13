// パーティクル生成
function createParticles() {
    const container = document.getElementById('particle-container');
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 15,
        left: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)]
    }));

    particles.forEach(particle => {
        const div = document.createElement('div');
        div.className = 'particle';
        div.style.width = `${particle.size}px`;
        div.style.height = `${particle.size}px`;
        div.style.background = particle.color;
        div.style.left = `${particle.left}%`;
        div.style.bottom = '-50px';
        div.style.animationDelay = `${particle.delay}s`;
        div.style.boxShadow = `0 0 20px ${particle.color}`;
        container.appendChild(div);
    });
}

// スクロール関数
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ストーリーセクション
const chapters = [
    {
        id: 1,
        number: "プロローグ",
        title: "新幹線での邂逅",
        description: "平凡な大学生・杉野健太が、祖父からの謎めいた依頼を受けて秋田へと向かう。車窓に流れる風景を眺めながら、彼はまだ知らない。この旅が、自分の人生を大きく変える冒険の始まりであることを...",
        teaseText: "果たして健太を待ち受ける運命とは？この旅の真の目的とは何なのか？"
    },
    {
        id: 2,
        number: "第一章",
        title: "男鹿の守護霊",
        description: "男鹿半島で出会った勇敢な少女ナギサ。彼女には秘められた願いがあった。古くからの伝統に挑戦する彼女の姿に、健太は心を揺さぶられる。神秘的なナマハゲの祠で、二人が目にしたものとは...",
        teaseText: "伝統の壁を越えて、ナギサの願いは叶うのか？祠に隠された秘密とは？"
    },
    {
        id: 3,
        number: "第二章",
        title: "湯沢の雅な出会い",
        description: "骨董品店で出会った謎めいた美女コマチ。平安時代から続く美の知識を持つ彼女は、現代社会で孤独を感じていた。しかし、ナギサの提案により、古き良きものと新しい技術が織りなす奇跡が...",
        teaseText: "千年の美意識が現代に甦る時、何が起こるのか？コマチの真の姿とは？"
    },
    {
        id: 4,
        number: "第三章",
        title: "稲庭の技と心",
        description: "稲庭うどんの老舗「令和耕助」で出会った職人親子。父イナニワの伝統への想いと、息子カントの革新への情熱。相容れないと思われた二つの道が交わる時、新たな可能性が生まれる...",
        teaseText: "伝統と革新、親子の絆の行方は？カントの挑戦が導く未来とは？"
    },
    {
        id: 5,
        number: "第四章",
        title: "三湖の恋歌",
        description: "田沢湖で起きた異変。美しい湖が氷に覆われ、その奥で嘆く龍の姿が。タツコの切ない想いと、八郎潟のハチロウとの運命的な出会い。純粋な愛の力が湖に奇跡をもたらすとき...",
        teaseText: "永遠の愛は氷を溶かすことができるのか？二人の恋の結末は？"
    },
    {
        id: 6,
        number: "第五章",
        title: "大館の秘密",
        description: "健太の実家で発見された驚くべき秘密。酒飲みと思われていた父の真の姿と、最先端技術で甦った忠実な相棒アキタ。家族の絆と、秋田を守る新たな力が明かされるとき...",
        teaseText: "父の隠された想いとは？アキタが秘める力の正体は？"
    },
    {
        id: 7,
        number: "第六章",
        title: "鹿角の大団円",
        description: "鹿角市で起きた比内地鶏とキリタンポの激しい対立。トリオとタンポの対立を通じて、秋田の分裂した心を統一する必要性が明らかになる。協力することで生まれる相乗効果を学び、秋田全体の絆を深める...",
        teaseText: "分裂から統一へ、秋田の真の力を結集できるのか？最後の戦いへの準備は整うのか？"
    },
    {
        id: 8,
        number: "最終章",
        title: "太平山の守護神",
        description: "ついに姿を現したスギノオウ。秋田県民の過度な真面目さが生んだ巨大な化身との最終決戦。健太と仲間たちは、これまでの旅で学んだ全ての教訓を胸に、太平山の頂でスギノオウと対峙する。破壊ではなく浄化による真の解決を目指して...",
        teaseText: "真面目さと柔軟性の調和は可能なのか？健太の成長の集大成となる最後の選択とは？"
    }
];

let currentPage = 0;

function renderStoryPage() {
    const pagesDiv = document.getElementById('story-pages');
    const currentChapter = chapters[currentPage];
    
    pagesDiv.innerHTML = `
        <div class="page page-left">
            <div class="chapter-number">${currentChapter.number}</div>
            <h3 class="chapter-title">${currentChapter.title}</h3>
            <p class="chapter-description">${currentChapter.description}</p>
            <div class="tease-text">${currentChapter.teaseText}</div>
        </div>
        <div class="page page-right">
            <img class="chapter-image" src="images/story${currentPage}.png" alt="${currentChapter.title}">
            <div class="character-portrait-container">
                ${currentPage === 3 || currentPage === 4 || currentPage === 6 || currentPage === 7 ? `
                    <img class="character-portrait" src="images/dotchara${currentPage}a.png" alt="キャラクター">
                    <img class="character-portrait" src="images/dotchara${currentPage}b.png" alt="キャラクター">
                ` : `
                    <img class="character-portrait" src="images/dotchara${currentPage}.png" alt="キャラクター">
                `}
            </div>
        </div>
    `;
    
    updatePageIndicator();
    updateNavButtons();
}

function updatePageIndicator() {
    const dotsDiv = document.getElementById('page-dots');
    dotsDiv.innerHTML = '';
    
    chapters.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `page-dot ${index === currentPage ? 'active' : ''}`;
        dot.onclick = () => goToPage(index);
        dotsDiv.appendChild(dot);
    });
}

function updateNavButtons() {
    document.getElementById('prev-btn').disabled = currentPage === 0;
    document.getElementById('next-btn').disabled = currentPage === chapters.length - 1;
}

function nextPage() {
    if (currentPage < chapters.length - 1) {
        currentPage++;
        renderStoryPage();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderStoryPage();
    }
}

function goToPage(pageIndex) {
    currentPage = pageIndex;
    renderStoryPage();
}

// キャラクターセクション
const characters = [
    {
        id: 1,
        name: '杉野健太',
        role: '主人公・真のKitazuna',
        emoji: '🌱',
        description: '内向的な大学生が、秋田での出会いを通じて真のリーダーへと成長する物語の主人公。',
        hasImage: true,
        imageIndex: 0
    },
    {
        id: 2,
        name: 'ナギサ',
        role: '真のナマハゲ精神の継承者',
        emoji: '👹',
        description: '性別の壁を越えてナマハゲの真の精神を習得。伝統を守りながらも革新する勇敢な少女。',
        hasImage: true,
        imageIndex: 1
    },
    {
        id: 3,
        name: 'コマチ',
        role: '伝統と現代を繋ぐインフルエンサー',
        emoji: '🌸',
        description: '小野小町の化身。平安時代からの美の知識をSNSで現代に伝える革新的な存在。',
        hasImage: true,
        imageIndex: 2
    },
    {
        id: 4,
        name: 'イナニワ',
        role: '伝統を守る稲庭うどん職人',
        emoji: '🍜',
        description: '稲庭うどんの老舗店主。息子カントとの世代間の葛藤を乗り越え、伝統と革新の融合を学ぶ。',
        hasImage: true,
        imageIndex: 3
    },
    {
        id: 5,
        name: 'カント',
        role: '革新を求める竿燈士',
        emoji: '🏮',
        description: 'イナニワの息子。父の稲庭うどんの技術を竿燈に活かし、新技「足竿燈」を完成させる。',
        hasImage: true,
        imageIndex: 4
    },
    {
        id: 6,
        name: 'タツコ',
        role: '田沢湖の美しき龍神',
        emoji: '💙',
        description: '美を求めて龍になった田沢湖の守り神。ハチロウとの純愛を通じて真の美しさを知る。',
        hasImage: true,
        imageIndex: 5
    },
    {
        id: 7,
        name: 'ハチロウ',
        role: '八郎潟の優しき守護者',
        emoji: '🌊',
        description: '八郎潟に住む心優しい男性。タツコへの純粋な愛で、凍った田沢湖を溶かす奇跡を起こす。',
        hasImage: true,
        imageIndex: 6
    },
    {
        id: 8,
        name: 'アキタ',
        role: '技術と伝統を融合したAI秋田犬',
        emoji: '🤖',
        description: 'サイボーグ化された秋田犬。最先端技術と忠誠心を兼ね備えた秋田の守護者。',
        hasImage: true,
        imageIndex: 7
    },
    {
        id: 9,
        name: 'トリオ',
        role: '比内地鶏の誇り高きギャング',
        emoji: '🐓',
        description: 'アメリカかぶれのギャング風比内地鶏。タンポとの料理対決を通じて協力の大切さを学ぶ。',
        hasImage: true,
        imageIndex: 9
    },
    {
        id: 10,
        name: 'タンポ',
        role: 'きりたんぽ魂を持つヤンキー',
        emoji: '🍢',
        description: '秋田の米文化を愛するきりたんぽの化身。トリオとの和解により秋田統一への道を開く。',
        hasImage: true,
        imageIndex: 8
    }
];

let currentCharacterIndex = 0;

function renderCharacterCard() {
    const card = document.getElementById('character-card');
    const character = characters[currentCharacterIndex];
    
    let imageHtml = '';
    if (character.hasImage) {
        const imageName = character.imageIndex === 9 ? 'chara8' : 
                         character.imageIndex === 8 ? 'chara9' : 
                         `chara${character.imageIndex}`;
        imageHtml = `<img class="character-image-display" src="images/${imageName}.png" alt="${character.name}">`;
    } else {
        imageHtml = `<div class="character-emoji">${character.emoji}</div>`;
    }
    
    card.innerHTML = `
        ${imageHtml}
        <h3 class="character-name">${character.name}</h3>
        <p class="character-role">${character.role}</p>
        <p class="character-description">${character.description}</p>
    `;
    
    updateCharacterIndicator();
}

function updateCharacterIndicator() {
    const dotsDiv = document.getElementById('character-dots');
    dotsDiv.innerHTML = '';
    
    characters.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `indicator ${index === currentCharacterIndex ? 'active' : ''}`;
        dot.onclick = () => goToCharacter(index);
        dotsDiv.appendChild(dot);
    });
}

function nextCharacter() {
    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
    renderCharacterCard();
}

function prevCharacter() {
    currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
    renderCharacterCard();
}

function goToCharacter(index) {
    currentCharacterIndex = index;
    renderCharacterCard();
}

// 秋田県地図の背景生成
function generateAkitaMaps() {
    const container = document.getElementById('akita-maps');
    const colors = [0, 60, 120, 180, 240, 300];
    
    for (let i = 0; i < 18; i++) {
        const map = document.createElement('div');
        map.className = 'akita-map';
        map.style.left = `${Math.random() * 90 + 5}%`;
        map.style.top = `${Math.random() * 80 + 10}%`;
        map.style.width = `${Math.random() * 80 + 60}px`;
        map.style.height = `${Math.random() * 80 + 60}px`;
        const color = colors[Math.floor(Math.random() * colors.length)];
        map.style.background = `radial-gradient(ellipse 80% 60% at center, 
            hsl(${color}, 70%, 60%) 0%, 
            hsl(${color}, 80%, 50%) 40%, 
            transparent 100%)`;
        const animationType = Math.floor(Math.random() * 3) + 1;
        const delay = Math.random() * 4;
        map.style.animation = `akitaFloat${animationType} ${8 + delay}s ease-in-out infinite`;
        map.style.animationDelay = `${delay * 0.5}s`;
        container.appendChild(map);
    }
}

// ECセクション
const features = [
    {
        id: 1,
        title: 'ゲーム内EC機能',
        description: 'ゲーム内で秋田の特産品を購入できる革新的なシステム',
        fullText: [
            'いらっしゃいませ！\nコマチですわ。革新的なゲーム内ECシステムのご案内をいたします。',
            'ゲームを楽しみながら、秋田の素晴らしい\n特産品をお買い求めいただけますのよ。',
            '24時間365日、世界中からアクセス可能で、\nリアルタイム在庫管理も完備しておりますわ。',
            '手ぶらで観光を楽しみ、気に入った商品を\n自宅で受け取る新しいスタイルですの。',
            '秋田の事業者様にとって、\n前例のない販路拡大の機会となりますわ。'
        ]
    },
    {
        id: 2,
        title: '二次創作自由化',
        description: 'キャラクターを自由に活用したオリジナル商品開発',
        fullText: [
            'コマチですわ！素晴らしいお知らせがございます。\nKITAZUNA\'sキャラクターが完全自由化されましたの！',
            '秋田の事業者の皆様が、独自のオリジナル商品を\n自由に開発・販売できるようになりますわ。',
            'キャラクター商用利用は完全無料ですのよ！\nプロデザイナー監修のテンプレートもご用意しております。',
            '最新AIツールによる商品デザイン支援で、\n創造的な商品展開が可能になりますわ。',
            '地域の子どもたちも商品開発に参加でき、\n次世代が故郷への誇りを持てる素敵な仕組みですの！'
        ]
    },
    {
        id: 3,
        title: '地域経済循環',
        description: '秋田に還元される持続可能な経済システム',
        fullText: [
            'コマチですわ。\n地域経済循環システムについてご説明いたしますね。',
            'KITAZUNA\'sのすべての経済活動が、\n愛する秋田の地に確実に還元されますの。',
            'ゲーム売上の一定比率を地域事業者に直接還元し、\n広告収益も県内プロモーションに再投資いたしますわ。',
            '観光客増加により宿泊・飲食・交通業界にも\n大きな波及効果をもたらしますの。',
            'バーチャル空間から始まる新しい経済が、\n現実の秋田を確実に活気づけるのですわ。'
        ]
    }
];

let selectedFeature = null;
let currentTextIndex = 0;
let displayedText = '';
let isTyping = false;
let typeInterval = null;

function selectFeature(index) {
    selectedFeature = features[index];
    currentTextIndex = 0;
    displayedText = '';
    isTyping = false;
    
    // キャラクター画像表示
    const wrapper = document.getElementById('character-image-wrapper');
    const image = document.getElementById('ec-character-image');
    const tab = wrapper.querySelector('.character-tab');
    
    wrapper.style.display = 'block';
    image.src = 'images/komachi-shop.png'; // 適切な画像を設定
    tab.textContent = selectedFeature.title;
    
    // 対話エリア表示
    document.getElementById('dialogue-area').style.display = 'block';
    
    typeText(selectedFeature.fullText[0]);
}

function typeText(text) {
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
    }
    
    isTyping = true;
    displayedText = '';
    let index = 0;
    
    typeInterval = setInterval(() => {
        if (index <= text.length) {
            displayedText = text.substring(0, index);
            updateDialogueDisplay();
            index++;
        } else {
            clearInterval(typeInterval);
            typeInterval = null;
            isTyping = false;
            updateContinuePrompt();
        }
    }, 50);
}

function updateDialogueDisplay() {
    const content = document.getElementById('dialogue-content');
    content.innerHTML = displayedText.split('\n').map(line => `<div>${line || '\u00A0'}</div>`).join('');
}

function updateContinuePrompt() {
    const prompt = document.getElementById('continue-prompt');
    if (!isTyping && currentTextIndex < selectedFeature.fullText.length - 1) {
        prompt.textContent = '▼ クリックで続きを読む';
    } else if (!isTyping && currentTextIndex === selectedFeature.fullText.length - 1) {
        prompt.textContent = '▼ クリックで終了';
    } else {
        prompt.textContent = '';
    }
}

function handleNextText() {
    if (isTyping) {
        // タイピング中なら即座に完了
        if (typeInterval) {
            clearInterval(typeInterval);
            typeInterval = null;
        }
        displayedText = selectedFeature.fullText[currentTextIndex];
        updateDialogueDisplay();
        isTyping = false;
        updateContinuePrompt();
        return;
    }
    
    if (currentTextIndex < selectedFeature.fullText.length - 1) {
        currentTextIndex++;
        typeText(selectedFeature.fullText[currentTextIndex]);
    } else {
        // 終了
        document.getElementById('dialogue-area').style.display = 'none';
        document.getElementById('character-image-wrapper').style.display = 'none';
        selectedFeature = null;
        currentTextIndex = 0;
        displayedText = '';
    }
}

// チームメンバー表示
function renderTeamMembers() {
    const teamMembers = [
        {
            icon: '🎨',
            role: '緒方孝治',
            description: 'くにおくんシリーズキャラクターデザイナー'
        },
        {
            icon: '👨‍💼',
            role: '高崎翔太',
            description: 'if(塾)塾頭、if(DELIC)代表'
        },
        {
            icon: '👥',
            role: '秋田の高校生',
            description: 'if(塾)の生徒たち。地域の魅力を発信'
        },
        {
            icon: '🤖',
            role: 'AI技術',
            description: 'ストーリー・アニメーション・3D化をサポート'
        },
        {
            icon: '🌍',
            role: '地域パートナー',
            description: '秋田県の事業者・自治体との連携'
        }
    ];
    
    const track = document.querySelector('.team-scroll-track');
    
    // 2セット作成（無限スクロール用）
    for (let i = 0; i < 2; i++) {
        teamMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <div class="team-icon">${member.icon}</div>
                <h5 class="team-member-role">${member.role}</h5>
                <p class="team-description">${member.description}</p>
            `;
            track.appendChild(card);
        });
    }
}

// 感謝演出
function showGratitude() {
    setTimeout(() => {
        const overlay = document.getElementById('gratitude-overlay');
        overlay.style.display = 'flex';
        
        // ハート生成
        const heartContainer = document.getElementById('heart-container');
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.style.left = `${Math.random() * 90 + 5}%`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heart.textContent = '❤️';
            heartContainer.appendChild(heart);
        }
        
        // キラキラ生成
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.left = `${Math.random() * 90 + 5}%`;
            sparkle.style.top = `${Math.random() * 80 + 10}%`;
            sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
            sparkle.textContent = '✨';
            heartContainer.appendChild(sparkle);
        }
        
        // 5秒後に非表示
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 5000);
    }, 3000);
}

// ニュースレター送信
function handleNewsletterSubmit(event) {
    event.preventDefault();
    alert('ニュースレター購読ありがとうございます！');
}

// モバイル対応
function checkMobile() {
    const isMobile = window.innerWidth <= 768;
    const videoElement = document.querySelector('.video-background source');
    if (videoElement) {
        videoElement.src = isMobile ? 'videos/topmoviesp.mp4' : 'videos/topmoviepc.mp4';
        videoElement.parentElement.load();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderStoryPage();
    renderCharacterCard();
    generateAkitaMaps();
    renderTeamMembers();
    showGratitude();
    checkMobile();
    
    // レスポンシブ対応
    window.addEventListener('resize', checkMobile);
});