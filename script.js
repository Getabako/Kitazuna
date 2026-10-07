// ===== 公開先リンク（決まったらここを書き換える。空なら「準備中」を案内） =====
const LINE_URL = "";      // LINE公式アカウントの友だち追加URL（LINE Studio で作成後に設定）
const BOOK_URL = "";      // Amazon の予約ページURL（KDP 予約登録後に設定）
const GAME_URL = "";      // 男鹿編の公開URL（2026-11-11 に設定）

function openLine(event) {
    if (event) event.preventDefault();
    if (LINE_URL) { window.open(LINE_URL, "_blank", "noopener"); return false; }
    alert("LINEの受付は準備中です。もう少しだけお待ちください。");
    return false;
}
function openBook(event) {
    if (event) event.preventDefault();
    if (BOOK_URL) { window.open(BOOK_URL, "_blank", "noopener"); return false; }
    alert("Amazonの予約ページは準備中です。公開されたらLINEでお知らせします。");
    return false;
}

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
        status: "2026年11月11日 公開",
        description: "平凡な大学生・杉野健太が、祖父からの謎めいた依頼を受けて秋田へと向かう。車窓に流れる風景を眺めながら、彼はまだ知らない。この旅が、自分の人生を大きく変える冒険の始まりであることを...",
        teaseText: "果たして健太を待ち受ける運命とは？この旅の真の目的とは何なのか？"
    },
    {
        id: 2,
        number: "第一章",
        title: "男鹿編",
        status: "2026年11月11日 公開",
        description: "祖父の戦友・海風源三郎を訪ねて男鹿へ。そこで出会ったのは、ナマハゲになりたいと願う少女ナギサ。本来ナマハゲは男しかなれない。それでも諦めない彼女と共に、健太はナマハゲの祠で「祠の試練」に挑む。太鼓を叩き、祭の中へ...",
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
            <div class="chapter-status ${currentChapter.status ? 'is-open' : ''}">${currentChapter.status || '順次公開'}</div>
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
        inOga: true,
        role: '主人公・真のKitazuna',
        description: '内向的な大学生が、秋田での出会いを通じて真のリーダーへと成長する物語の主人公。',
        hasImage: true,
        imageIndex: 0,
        folderName: 'kenta',
        faceImages: ['1.png', '2.png', '3.png', '4.png']
    },
    {
        id: 2,
        name: 'ナギサ',
        inOga: true,
        role: '真のナマハゲ精神の継承者',
        description: '性別の壁を越えてナマハゲの真の精神を習得。伝統を守りながらも革新する勇敢な少女。',
        hasImage: true,
        imageIndex: 1,
        folderName: 'nagisa',
        faceImages: ['8.png', '9.png', '10.png']
    },
    {
        id: 3,
        name: 'コマチ',
        role: '伝統と現代を繋ぐインフルエンサー',
        description: '小野小町の化身。平安時代からの美の知識をSNSで現代に伝える革新的な存在。',
        hasImage: true,
        imageIndex: 2,
        folderName: 'komachi',
        faceImages: ['16.png', '17.png', '18.png']
    },
    {
        id: 4,
        name: 'イナニワ',
        role: '伝統を守る稲庭うどん職人',
        description: '稲庭うどんの老舗店主。息子カントとの世代間の葛藤を乗り越え、伝統と革新の融合を学ぶ。',
        hasImage: true,
        imageIndex: 3,
        folderName: 'inaniwa',
        faceImages: ['19.png', '20.png']
    },
    {
        id: 5,
        name: 'カント',
        role: '革新を求める竿燈士',
        description: 'イナニワの息子。父の稲庭うどんの技術を竿燈に活かし、新技「足竿燈」を完成させる。',
        hasImage: true,
        imageIndex: 4,
        folderName: 'kanto',
        faceImages: ['21.png', '22.png', '23.png', '24.png']
    },
    {
        id: 6,
        name: 'タツコ',
        role: '田沢湖の美しき龍神',
        description: '美を求めて龍になった田沢湖の守り神。ハチロウとの純愛を通じて真の美しさを知る。',
        hasImage: true,
        imageIndex: 5,
        folderName: 'tatsuko',
        faceImages: ['25.png', '26.png', '27.png']
    },
    {
        id: 7,
        name: 'ハチロウ',
        role: '八郎潟の優しき守護者',
        description: '八郎潟に住む心優しい男性。タツコへの純粋な愛で、凍った田沢湖を溶かす奇跡を起こす。',
        hasImage: true,
        imageIndex: 6,
        folderName: 'hachiro',
        faceImages: ['28.png', '29.png', '30.png']
    },
    {
        id: 8,
        name: 'アキタ',
        role: '技術と伝統を融合したAI秋田犬',
        description: 'サイボーグ化された秋田犬。最先端技術と忠誠心を兼ね備えた秋田の守護者。',
        hasImage: true,
        imageIndex: 7,
        folderName: 'akita',
        faceImages: ['31.png', '32.png', '33.png']
    },
    {
        id: 9,
        name: 'トリオ',
        role: '比内地鶏の誇り高きギャング',
        description: 'アメリカかぶれのギャング風比内地鶏。タンポとの料理対決を通じて協力の大切さを学ぶ。',
        hasImage: true,
        imageIndex: 9,
        folderName: 'torio',
        faceImages: ['40.png', '41.png']
    },
    {
        id: 10,
        name: 'タンポ',
        role: 'きりたんぽ魂を持つヤンキー',
        description: '秋田の米文化を愛するきりたんぽの化身。トリオとの和解により秋田統一への道を開く。',
        hasImage: true,
        imageIndex: 8,
        folderName: 'tanpo',
        faceImages: ['37.png', '38.png', '39.png']
    },
    {
        id: 11,
        name: '源三郎',
        inOga: true,
        role: '杉野家の祖父・真のリーダー',
        description: '健太の祖父。秋田県の未来を見据え、孫に使命を託す。長年の経験と知恵で導く。',
        hasImage: true,
        imageIndex: 10,
        folderName: 'genzaburo',
        faceImages: ['11.png', '12.png'],
        idleImage: 'genzaburoidle/genzaburoidle1.png'
    },
    {
        id: 12,
        name: 'ナマハゲ',
        inOga: true,
        role: '男鹿の伝統を守る精霊',
        description: '「悪い子はいねがー」の掛け声で知られる男鹿の守護精霊。伝統文化の象徴的存在。',
        hasImage: true,
        imageIndex: 11,
        folderName: 'namahage',
        faceImages: ['13.png', '14.png', '15.png']
    },
    {
        id: 13,
        name: 'ひろし',
        role: '杉野健太の父・技術者',
        description: '健太の父。表向きは酒飲みだが、実は最先端技術で秋田を守る重要人物。',
        hasImage: true,
        imageIndex: 12,
        folderName: 'hiroshi',
        faceImages: ['34.png', '35.png', '36.png']
    },
    {
        id: 14,
        name: '南祖坊',
        role: '太平山の守護神',
        description: '太平山に住む神秘的な存在。山の自然と秋田の精神性を守護する。',
        hasImage: true,
        imageIndex: 13,
        folderName: 'minamisobo',
        faceImages: ['43.png']
    }
];

let currentCharacterIndex = 0;

function renderCharacterCard() {
    const card = document.getElementById('character-card');
    const character = characters[currentCharacterIndex];

    let imageHtml = '';
    if (character.hasImage) {
        // Use idle image if available for new characters
        if (character.idleImage) {
            const idleImagePath = `images/kitazunasozai/character/${character.folderName}/${character.idleImage}`;
            imageHtml = `<img class="character-image-display" src="${idleImagePath}" alt="${character.name}">`;
        } else if (character.imageIndex < 10) {
            // Use existing character images for original characters
            const imageName = character.imageIndex === 9 ? 'chara8' :
                             character.imageIndex === 8 ? 'chara9' :
                             `chara${character.imageIndex}`;
            const mainImagePath = `images/${imageName}.png`;
            imageHtml = `<img class="character-image-display" src="${mainImagePath}" alt="${character.name}" onerror="this.src='images/kitazunasozai/character/${character.folderName}/${character.folderName}.png'">`;
        } else {
            // For new characters without idle images, use face image as fallback
            if (character.faceImages && character.faceImages.length > 0) {
                const fallbackImage = `images/kitazunasozai/character/${character.folderName}/${character.folderName}face/${character.faceImages[0]}`;
                imageHtml = `<img class="character-image-display" src="${fallbackImage}" alt="${character.name}">`;
            } else {
                imageHtml = `<div class="character-emoji">${character.name}</div>`;
            }
        }
    } else {
        imageHtml = `<div class="character-emoji">${character.name}</div>`;
    }

    // Create face images HTML
    let faceImagesHtml = '';
    if (character.faceImages && character.faceImages.length > 0) {
        faceImagesHtml = `
            <div class="character-faces">
                <h4>表情バリエーション</h4>
                <div class="face-images-grid">
                    ${character.faceImages.map(face =>
                        `<img class="face-image" src="images/kitazunasozai/character/${character.folderName}/${character.folderName}face/${face}" alt="${character.name} 表情">`
                    ).join('')}
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        ${imageHtml}
        <h3 class="character-name">${character.name}</h3>
        <p class="character-badge">${character.inOga ? '第1章 男鹿編に登場' : '続く章で登場'}</p>
        <p class="character-role">${character.role}</p>
        <p class="character-description">${character.description}</p>
        ${faceImagesHtml}
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
function renderTeamMembers() {
    const teamMembers = [
        { icon: '画', role: '緒方孝治', description: 'キャラクターデザイン。くにおくんシリーズのデザイナー' },
        { icon: '作', role: '高崎翔太', description: '企画・物語・開発。秋田で if(塾) を運営' },
        { icon: 'AI', role: 'AI（Codex ほか）', description: '台本・背景・効果音・コードの相棒。作り方は公式ファンブックに' },
        { icon: '塾', role: 'if(塾)の生徒たち', description: 'テストプレイと秋田の取材に協力' },
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
            heart.textContent = '';
            heartContainer.appendChild(heart);
        }
        
        // キラキラ生成
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.style.left = `${Math.random() * 90 + 5}%`;
            sparkle.style.top = `${Math.random() * 80 + 10}%`;
            sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
            sparkle.textContent = '';
            heartContainer.appendChild(sparkle);
        }
        
        // 5秒後に非表示
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 5000);
    }, 3000);
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