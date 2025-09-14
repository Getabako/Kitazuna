// アニメーション管理用JavaScript
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.basePath = 'images/kitazunasozai/';
    }

    // 画像を事前読み込み
    async preloadImages(folder, subfolder = '', count = null) {
        const images = [];
        let index = 1;
        
        while (true) {
            try {
                const img = new Image();
                let path = '';
                
                if (folder === 'logo') {
                    path = `${this.basePath}${folder}/logo${index}.png`;
                } else if (folder.startsWith('character/')) {
                    // キャラクターアニメーションのパス
                    const charName = folder.replace('character/', '');
                    path = `${this.basePath}character/${charName}/${charName}${subfolder}/${charName}${subfolder}${index}.png`;
                } else if (folder.startsWith('map/')) {
                    // マップアイコンのパス
                    const iconName = folder.replace('map/', '');
                    path = `${this.basePath}map/${iconName}/${iconName}${index}.png`;
                }
                
                console.log(`Trying to load: ${path}`);
                
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = path;
                });
                
                images.push(img);
                index++;
                
                // 最大50枚まで試行
                if (index > 50) break;
            } catch (error) {
                // 画像が見つからない場合は終了
                break;
            }
        }
        
        return images;
    }

    // キャラクターアニメーションを開始
    async startCharacterAnimation(canvas, character, animation) {
        const ctx = canvas.getContext('2d');
        
        // アニメーション名の正規化（実際のフォルダ名に合わせる）
        const animationMap = {
            'komachi': {
                'idle': 'idle',
                'walk': 'walk', // komaciwalk フォルダ
                'shop': 'shop'
            },
            'kanto': {
                'idle': 'idle', // kantidle フォルダ
                'walk': 'walk',
                'gameidle': 'gameidle',
                'gamewalk': 'gamewalk'
            }
        };
        
        let normalizedAnimation = animation;
        if (animationMap[character] && animationMap[character][animation]) {
            normalizedAnimation = animationMap[character][animation];
        }
        
        const images = await this.preloadImages(`character/${character}`, normalizedAnimation);
        
        if (images.length === 0) {
            // 画像が見つからない場合のフォールバック
            ctx.fillStyle = '#4ecdc4';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('画像未読み込み', canvas.width / 2, canvas.height / 2);
            console.log(`Failed to load images for ${character} ${normalizedAnimation}`);
            return;
        }

        let frameIndex = 0;
        const animationId = `${character}_${animation}`;
        
        // 既存のアニメーションがあれば停止
        if (this.animations.has(animationId)) {
            clearInterval(this.animations.get(animationId));
        }

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const img = images[frameIndex];
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            frameIndex = (frameIndex + 1) % images.length;
        }, 200); // 200msごとにフレーム更新

        this.animations.set(animationId, interval);
        console.log(`Started animation for ${character} ${normalizedAnimation} with ${images.length} frames`);
    }

    // マップアイコンアニメーションを開始
    async startMapIconAnimation(canvas, iconType) {
        const ctx = canvas.getContext('2d');
        const images = await this.preloadImages(`map/${iconType}`, '');
        
        if (images.length === 0) {
            // 画像が見つからない場合のフォールバック
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('未読み込み', canvas.width / 2, canvas.height / 2);
            console.log(`Failed to load images for map icon ${iconType}`);
            return;
        }

        let frameIndex = 0;
        const animationId = `map_${iconType}`;
        
        // 既存のアニメーションがあれば停止
        if (this.animations.has(animationId)) {
            clearInterval(this.animations.get(animationId));
        }

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const img = images[frameIndex];
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            frameIndex = (frameIndex + 1) % images.length;
        }, 300); // 300msごとにフレーム更新

        this.animations.set(animationId, interval);
        console.log(`Started map animation for ${iconType} with ${images.length} frames`);
    }

    // ロゴアニメーションを開始
    async startLogoAnimation(canvas) {
        const ctx = canvas.getContext('2d');
        const images = await this.preloadImages('logo');
        
        if (images.length === 0) {
            // 画像が見つからない場合のフォールバック
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('KITAZUNA', canvas.width / 2, canvas.height / 2);
            return;
        }

        let frameIndex = 0;
        const animationId = 'logo';
        
        // 既存のアニメーションがあれば停止
        if (this.animations.has(animationId)) {
            clearInterval(this.animations.get(animationId));
        }

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const img = images[frameIndex];
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            frameIndex = (frameIndex + 1) % images.length;
        }, 150); // 150msごとにフレーム更新

        this.animations.set(animationId, interval);
    }

    // アニメーションを停止
    stopAnimation(animationId) {
        if (this.animations.has(animationId)) {
            clearInterval(this.animations.get(animationId));
            this.animations.delete(animationId);
        }
    }

    // 立ち絵ギャラリーを表示
    async displayStandingArt(container, character) {
        let standFolder = '';
        
        // 特殊ケースのフォルダパス設定
        if (character === 'kenta-face') {
            standFolder = `character/kenta/kentaface`;
        } else if (character === 'kenta-op') {
            standFolder = `character/kenta/kentaop`;
        } else if (character === 'komachi-shop') {
            standFolder = `character/komachi/komachishop`;
        } else if (character === 'all') {
            standFolder = `character/all`;
        } else if (character === 'masahiro') {
            standFolder = `character/masahiro`;
        } else if (character === 'hiroshi') {
            standFolder = `character/hiroshi`;
        } else {
            standFolder = `character/${character}/${character}stand`;
        }
        
        try {
            // まず、どのような画像があるかを試行して確認
            const images = [];
            let index = 1;
            
            // コンテ画像（キャラ名0-数字形式）
            while (index <= 20) { // 最大20枚まで試行
                try {
                    const img = new Image();
                    let baseName = character;
                    
                    // 特殊ケースの命名規則
                    if (character === 'kenta-face') {
                        baseName = 'kentaface';
                    } else if (character === 'kenta-op') {
                        baseName = 'kentaop';
                    } else if (character === 'komachi-shop') {
                        baseName = 'komachishop';
                    } else if (character === 'all') {
                        baseName = 'all';
                    } else if (character === 'masahiro') {
                        baseName = 'masahiroface';
                    } else if (character === 'hiroshi') {
                        baseName = 'hiroshiface';
                    }
                    
                    const path = `${this.basePath}${standFolder}/${baseName}0-${index}.jpg`;
                    
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            images.push({
                                type: 'conte',
                                src: path,
                                index: index,
                                img: img
                            });
                            resolve();
                        };
                        img.onerror = reject;
                        img.src = path;
                    });
                    index++;
                } catch (error) {
                    // JPGでダメならPNGも試行
                    try {
                        const img = new Image();
                        let baseName = character;
                        
                        // 特殊ケースの命名規則
                        if (character === 'kenta-face') {
                            baseName = 'kentaface';
                        } else if (character === 'kenta-op') {
                            baseName = 'kentaop';
                        } else if (character === 'komachi-shop') {
                            baseName = 'komachishop';
                        } else if (character === 'all') {
                            baseName = 'all';
                        } else if (character === 'masahiro') {
                            baseName = 'masahiroface';
                        } else if (character === 'hiroshi') {
                            baseName = 'hiroshiface';
                        }
                        
                        const path = `${this.basePath}${standFolder}/${baseName}0-${index}.png`;
                        
                        await new Promise((resolve, reject) => {
                            img.onload = () => {
                                images.push({
                                    type: 'conte',
                                    src: path,
                                    index: index,
                                    img: img
                                });
                                resolve();
                            };
                            img.onerror = reject;
                            img.src = path;
                        });
                        index++;
                    } catch (error2) {
                        break; // どちらも失敗したら終了
                    }
                }
            }
            
            // 完成立ち絵
            try {
                const img = new Image();
                let path = '';
                
                // 特殊ケース: kenta-face, kenta-op, komachi-shop, all, masahiro, hiroshi
                if (character === 'kenta-face') {
                    path = `${this.basePath}character/kenta/kentaface/kentafacenormal.png`;
                } else if (character === 'kenta-op') {
                    path = `${this.basePath}character/kenta/kentaop/kentaop.png`;
                } else if (character === 'komachi-shop') {
                    path = `${this.basePath}character/komachi/komachishop/komachishopexterior.png`;
                } else if (character === 'all') {
                    path = `${this.basePath}character/all/allstand.jpg`;
                } else if (character === 'masahiro') {
                    path = `${this.basePath}character/masahiro/masahirofacenormal.png`;
                } else if (character === 'hiroshi') {
                    path = `${this.basePath}character/hiroshi/hiroshifacenormal.png`;
                } else {
                    path = `${this.basePath}${standFolder}/${character}stand.png`;
                }
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        images.push({
                            type: 'final',
                            src: path,
                            img: img
                        });
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = path;
                });
            } catch (error) {
                console.log(`Final standing art not found for ${character}`);
            }
            
            // コマチの店の内装も追加
            if (character === 'komachi-shop') {
                try {
                    const img = new Image();
                    const interiorPath = `${this.basePath}character/komachi/komachishop/komachishopbackground.png`;
                    
                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            images.push({
                                type: 'final',
                                src: interiorPath,
                                img: img,
                                isInterior: true
                            });
                            resolve();
                        };
                        img.onerror = reject;
                        img.src = interiorPath;
                    });
                } catch (error) {
                    console.log(`Shop interior not found for ${character}`);
                }
            }
            
            // 画像を表示
            container.innerHTML = '';
            
            if (images.length > 0) {
                // コンテ画像を表示
                const conteImages = images.filter(img => img.type === 'conte').sort((a, b) => a.index - b.index);
                if (conteImages.length > 0) {
                    const conteSection = document.createElement('div');
                    conteSection.innerHTML = '<h6>絵コンテ（制作過程）</h6>';
                    conteSection.className = 'standing-art-section';
                    
                    const conteGrid = document.createElement('div');
                    conteGrid.className = 'standing-art-grid';
                    
                    conteImages.forEach(imgData => {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'standing-art-item';
                        
                        const img = document.createElement('img');
                        img.src = imgData.src;
                        img.alt = `${character} コンテ ${imgData.index}`;
                        img.className = 'standing-art-image';
                        
                        const label = document.createElement('span');
                        label.textContent = `コンテ${imgData.index}`;
                        label.className = 'standing-art-label';
                        
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(label);
                        conteGrid.appendChild(imgContainer);
                    });
                    
                    conteSection.appendChild(conteGrid);
                    container.appendChild(conteSection);
                }
                
                // 完成立ち絵を表示
                const finalImages = images.filter(img => img.type === 'final');
                if (finalImages.length > 0) {
                    const finalSection = document.createElement('div');
                    finalSection.innerHTML = '<h6>完成立ち絵</h6>';
                    finalSection.className = 'standing-art-section';
                    
                    const finalGrid = document.createElement('div');
                    finalGrid.className = 'standing-art-grid';
                    
                    finalImages.forEach(imgData => {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'standing-art-item final-art';
                        
                        const img = document.createElement('img');
                        img.src = imgData.src;
                        img.alt = `${character} 完成立ち絵`;
                        img.className = 'standing-art-image final-image';
                        
                        const label = document.createElement('span');
                        if (imgData.isInterior) {
                            label.textContent = '店内装';
                        } else {
                            label.textContent = '完成版';
                        }
                        label.className = 'standing-art-label final-label';
                        
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(label);
                        finalGrid.appendChild(imgContainer);
                    });
                    
                    finalSection.appendChild(finalGrid);
                    container.appendChild(finalSection);
                }
            } else {
                container.innerHTML = '<p class="no-standing-art">立ち絵素材なし</p>';
            }
            
        } catch (error) {
            console.error(`Error loading standing art for ${character}:`, error);
            container.innerHTML = '<p class="no-standing-art">立ち絵読み込みエラー</p>';
        }
    }

    // 全アニメーションを停止
    stopAllAnimations() {
        this.animations.forEach((interval) => clearInterval(interval));
        this.animations.clear();
    }
}

// グローバルアニメーションマネージャー
const animationManager = new AnimationManager();

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
    // マップアイコンアニメーションを開始
    const mapCanvases = document.querySelectorAll('.map-icon-canvas');
    mapCanvases.forEach(canvas => {
        const folder = canvas.getAttribute('data-folder');
        if (folder) {
            animationManager.startMapIconAnimation(canvas, folder);
        }
    });

    // キャラクターアニメーションを開始（後で各章に追加予定）
    const characterCanvases = document.querySelectorAll('.character-canvas');
    characterCanvases.forEach(canvas => {
        const character = canvas.getAttribute('data-character');
        const animation = canvas.getAttribute('data-animation');
        if (character && animation) {
            animationManager.startCharacterAnimation(canvas, character, animation);
        }
    });

    // ロゴアニメーションを開始
    const logoCanvas = document.querySelector('.logo-canvas');
    if (logoCanvas) {
        animationManager.startLogoAnimation(logoCanvas);
    }

    // 立ち絵ギャラリーを表示
    const standingArtContainers = document.querySelectorAll('.standing-art-container');
    standingArtContainers.forEach(container => {
        const character = container.getAttribute('data-character');
        if (character) {
            animationManager.displayStandingArt(container, character);
        }
    });

    // タブ切り替え時にアニメーションを再開
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                // 現在アクティブなタブ内のキャンバスをチェック
                const activeTab = document.querySelector('.tab-pane.active');
                if (activeTab) {
                    const canvases = activeTab.querySelectorAll('canvas');
                    canvases.forEach(canvas => {
                        if (canvas.classList.contains('map-icon-canvas')) {
                            const folder = canvas.getAttribute('data-folder');
                            if (folder) {
                                animationManager.startMapIconAnimation(canvas, folder);
                            }
                        } else if (canvas.classList.contains('character-canvas')) {
                            const character = canvas.getAttribute('data-character');
                            const animation = canvas.getAttribute('data-animation');
                            if (character && animation) {
                                animationManager.startCharacterAnimation(canvas, character, animation);
                            }
                        }
                    });
                }
            }, 100);
        });
    });
});