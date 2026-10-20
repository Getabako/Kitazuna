// ===== 公開先リンク（決まったらここを書き換える。空なら「準備中」を案内） =====
// このサイトの内容は「ゲーム本体（ゲーム/ECRPG の ReleasePlan・Assets）」と「公式ファンブックの原稿（KindleMaker kitazuna-book）」を正とする。
// サイトの古い記述をもとに書き直さないこと（CONTENT-SOURCES.md 参照）。
const NOTE_URL = "https://note.com/ifjuku";      // 最新情報は note で発信（2026-10-19 LINE は使わない判断）
const BOOK_URL = "https://www.amazon.co.jp/dp/B0HMTVHVN9";      // Amazon の予約ページ（2026-10-13 予約開始・500円・Kindle Unlimited 対象）
const GAME_URL = "";      // 男鹿編の公開URL（2026-11-11 に設定）

function openNote(event) {
    if (event) event.preventDefault();
    window.open(NOTE_URL, "_blank", "noopener");
    return false;
}
function openBook(event) {
    if (event) event.preventDefault();
    if (BOOK_URL) { window.open(BOOK_URL, "_blank", "noopener"); return false; }
    alert("Amazonの予約ページは準備中です。公開されたらnoteでお知らせします。");
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
        title: "真面目の国に、影が目覚める",
        status: "2026年11月11日 公開",
        description: "秋田の子どもは真面目に学び、大人は真面目に働く。それ自体はこの土地の誇り。けれど度を越した真面目さが黒い念となって杉山へ吸い込まれ、封印の祠の縄が千切れる。かつて秋田を消滅の危機に落とした老木の精霊「スギノオウ」が目を覚ます。その頃、内向的な大学生・杉野健太は祖父・雅弘から「魂の提灯」と一通の紹介状を託され、新幹線で秋田へ向かっていた。",
        teaseText: "紹介状に記された名は「男鹿・海風源三郎」。行けば、答えが見つかる。"
    },
    {
        id: 2,
        number: "第一章",
        title: "男鹿編 ── ナギサと祠の試練",
        status: "2026年11月11日 公開",
        description: "男鹿で健太を迎えるのは、祖父の戦友・海風源三郎と、ナマハゲに憧れて自分で面を作った少女ナギサ。祠へ向かうのは「男だけ」の掟。それでもナギサは健太の代わりに参道を登る。真山神社の奥、ナマハゲの祠で待つのは、太鼓を叩いて祭に入る「祠の試練」。護摩餅のもてなしと口上の意味を知り、ナギサは最初の魂の提灯を受け取る。",
        teaseText: "そのものになれなくても、伝えられる。女のナマハゲ、ここに立つ。"
    },
    {
        id: 3,
        number: "第二章",
        title: "湯沢編 ── コマチ堂とバズる平安美人",
        status: "12月11日 公開予定",
        description: "雪と温泉の町、湯沢。閑古鳥が鳴く骨董品店「コマチ堂」で、小野小町の化身コマチと出会う。平安から続く美意識を、ナギサの提案でSNSという現代の手段につなぐ。古い価値に新しい居場所を作る物語。",
        teaseText: "二つ目の魂が目を覚ます。千年の美意識は、今の秋田に届くのか。"
    },
    {
        id: 4,
        number: "第三章",
        title: "秋田編 ── 令和耕助と足竿燈",
        description: "稲庭うどんの職人イナニワと、父の技から新技「足竿燈」を生み出そうとする息子カント。伝統と革新を父子の勝ち負けにしない。竿燈まつりの夜、二人の技が一本の竿の上で重なる。",
        teaseText: "追い出されたうどん屋と、一枚の写真。親子の絆の行方は。"
    },
    {
        id: 5,
        number: "第四章",
        title: "三湖編 ── 凍った田沢湖と三湖の恋歌",
        description: "龍の姿を受け入れられない田沢湖のタツコ、八郎潟を守るハチロウ、二人を試す十和田湖の南祖坊。秋田に伝わる三湖物語を、三人の声で。凍った湖を溶かすのは、愛の言葉。",
        teaseText: "永遠の愛は氷を溶かせるのか。三つの湖を結ぶ決意。"
    },
    {
        id: 6,
        number: "第五章",
        title: "大館編 ── 父とアキタ",
        description: "健太の実家で明かされる父・ひろしの本当の姿と、最先端の技術で甦った忠実な相棒・秋田犬アキタ。家族の絆と、秋田を守る新たな力。",
        teaseText: "酒飲みと思われていた父の、隠された想い。"
    },
    {
        id: 7,
        number: "第六章",
        title: "鹿角編 ── トリオとタンポ",
        description: "比内地鶏のトリオと、きりたんぽのタンポ。鹿角で起きた対立を通じて、分かれていた秋田の心をひとつに束ねる。協力することで生まれる力が、最後の戦いへの備えになる。",
        teaseText: "分裂から統一へ。秋田の象徴たちが束になる。"
    },
    {
        id: 8,
        number: "最終章",
        title: "太平山の守護神",
        description: "ついに姿を現したスギノオウ。秋田の過度な真面目さが生んだ巨大な化身との最終決戦。健太と守り神たちは、旅で結んだ絆を胸に太平山の頂へ。破壊ではなく浄化で、未来杉を守る。",
        teaseText: "真面目さと柔らかさは、ひとつになれるのか。"
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
        role: '主人公・平凡な大学生',
        description: '祖父・雅弘から「魂の提灯」と紹介状を託され、秋田へ。信じ切れないまま動くところから、守り神たちとの絆が始まる。',
        hasImage: true,
        imageIndex: 0,
        folderName: 'kenta',
        faceImages: ['1.png', '2.png', '3.png', '4.png']
    },
    {
        id: 2,
        name: 'ナギサ',
        inOga: true,
        role: '女のナマハゲ・最初の仲間',
        description: 'ナマハゲに憧れ、自分で面を作った少女。「男だけ」の掟に阻まれても諦めず、新しいナマハゲの形を作って世に出す。青い面が目印。作者の自画像でもある。',
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
        role: '男鹿の漁師・祖父の戦友',
        description: '海風源三郎。健太が最初に訪ねる男。真山神社へ続く参道と、ナマハゲの祠への道を示す。「信じた奴が動いて作る」が口癖。',
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
        role: '男鹿の来訪神',
        description: '祠の試練で待つ赤い面のナマハゲ。口上の意味、赤と青の面、護摩餅のもてなしを語り、ナギサに最初の魂の提灯を渡す。',
        hasImage: true,
        imageIndex: 11,
        folderName: 'namahage',
        faceImages: ['13.png', '14.png', '15.png']
    },
    {
        id: 15,
        name: '杉野雅弘',
        inOga: true,
        role: '健太の祖父',
        description: '健太に「魂の提灯」と、男鹿・海風源三郎への紹介状を託す。スギノオウの封印が弱まっていることを、誰より早く察していた。',
        hasImage: true,
        imageIndex: 14,
        folderName: 'masahiro',
        faceImages: ['5.png', '6.png', '7.png']
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
        role: '十和田湖の南祖坊',
        description: '三湖物語でタツコとハチロウを試す存在。秋田に伝わる辰子姫・八郎太郎・南祖坊の伝説が、第四章の土台になる。',
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
        { icon: '画', role: '緒方孝治', description: 'キャラクターデザイン（秋田の守り神たち）。くにおくんシリーズのデザイナー' },
        { icon: '画', role: '手塚屋', description: 'キャラクターデザイン（健太・ヒロシ・雅弘の杉野家）' },
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