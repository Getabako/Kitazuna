#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
セリフ集.mdを各シーン毎に分割し、
「行番号→発話者,会話内容」形式のmdファイルを作成するスクリプト
"""

import re
import os

def parse_dialogue_file(input_file):
    """セリフ集.mdを読み込んでシーン毎に分割"""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # シーン毎に分割
    scenes = {}
    current_section = None
    current_scene = None
    current_dialogues = []

    lines = content.split('\n')

    for line in lines:
        # セクションの判定（## で始まる行）
        if line.startswith('## ') and not line.startswith('## 概要'):
            current_section = line.replace('## ', '').strip()
            continue

        # シーンの判定（### シーン： で始まる行）
        if line.startswith('### シーン：'):
            # 前のシーンを保存
            if current_scene and current_dialogues:
                scene_key = f"{current_section}_{current_scene}"
                scenes[scene_key] = current_dialogues.copy()

            # 新しいシーンを開始
            current_scene = line.replace('### シーン：', '').strip()
            current_dialogues = []
            continue

        # セリフの抽出（表形式）
        # | 話者 | セリフ | の形式
        if line.startswith('| ') and '|' in line:
            parts = [p.strip() for p in line.split('|')]
            # parts[0]は空、parts[1]が話者、parts[2]がセリフ、parts[3]は空
            if len(parts) >= 3 and parts[1] and parts[2]:
                speaker = parts[1]
                dialogue = parts[2]

                # ヘッダー行をスキップ
                if speaker == '話者' or speaker == '------':
                    continue

                # セリフの前後の「」を削除
                dialogue = dialogue.strip()
                if dialogue.startswith('「') and dialogue.endswith('」'):
                    dialogue = dialogue[1:-1]
                elif dialogue.startswith('（') and dialogue.endswith('）'):
                    # ト書きはそのまま
                    pass

                current_dialogues.append({
                    'speaker': speaker,
                    'dialogue': dialogue
                })

    # 最後のシーンを保存
    if current_scene and current_dialogues:
        scene_key = f"{current_section}_{current_scene}"
        scenes[scene_key] = current_dialogues.copy()

    return scenes

def create_scene_file(scene_name, dialogues, output_dir):
    """各シーン用のmdファイルを作成"""
    # ファイル名を生成（安全な名前に変換）
    safe_name = scene_name.replace('/', '_').replace('\\', '_').replace(':', '_')
    safe_name = safe_name.replace('（', '_').replace('）', '_').replace(' ', '_')
    safe_name = safe_name.replace('　', '_').replace('－', '_').replace('?', '_')
    safe_name = safe_name.replace('？', '_').replace('!', '_').replace('！', '_')

    output_file = os.path.join(output_dir, f"{safe_name}.md")

    # ファイルに書き込み
    with open(output_file, 'w', encoding='utf-8') as f:
        for idx, item in enumerate(dialogues, start=1):
            speaker = item['speaker']
            dialogue = item['dialogue']

            # セリフの前後の「」を削除（まだ残っている場合）
            while dialogue.startswith('「') and dialogue.endswith('」'):
                dialogue = dialogue[1:-1].strip()

            # ト書きの（）内の「」を削除
            dialogue = re.sub(r'「([^」]*)」', r'\1', dialogue)

            f.write(f"{idx}→{speaker},{dialogue}\n")

    return output_file

def main():
    input_file = '/home/user/Kitazuna/セリフ集.md'
    output_dir = '/home/user/Kitazuna/dialogue_scenes'

    # 出力ディレクトリを作成
    os.makedirs(output_dir, exist_ok=True)

    # セリフ集を解析
    print("セリフ集.mdを解析中...")
    scenes = parse_dialogue_file(input_file)

    print(f"\n{len(scenes)}個のシーンが見つかりました。\n")

    # 各シーンをファイルに出力
    created_files = []
    for scene_name, dialogues in scenes.items():
        output_file = create_scene_file(scene_name, dialogues, output_dir)
        created_files.append(output_file)
        print(f"作成: {os.path.basename(output_file)} ({len(dialogues)}個のセリフ)")

    print(f"\n合計 {len(created_files)} 個のファイルを作成しました。")
    print(f"出力先: {output_dir}")

if __name__ == '__main__':
    main()
