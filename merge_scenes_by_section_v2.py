#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
セリフ集.mdから直接、編ごとに統合したファイルを作成するスクリプト
シーンの順序を保持します
"""

import re
import os
from collections import defaultdict

def parse_and_merge_by_section(input_file, output_dir):
    """セリフ集.mdを読み込んで編ごとに統合"""

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 編ごとに分類（順序を保持するためにリストで保存）
    section_order = []  # 編の出現順序
    section_data = defaultdict(list)  # 編名 -> [(シーン名, セリフリスト)]

    current_section = None
    current_scene = None
    current_dialogues = []

    lines = content.split('\n')

    for line in lines:
        # セクションの判定（## で始まる行）
        if line.startswith('## ') and not line.startswith('## 概要'):
            section_name = line.replace('## ', '').strip()

            # セクション名を正規化
            if '最終章' in section_name:
                current_section = '最終章_-_スギノオウとの最終決戦'
            elif 'オープニング' in section_name or 'OP' in section_name:
                current_section = 'オープニング_OP_-_新幹線内'
            elif '注記' in section_name:
                current_section = '注記'
            else:
                current_section = section_name

            # 新しいセクションの記録
            if current_section not in section_data:
                section_order.append(current_section)

            continue

        # シーンの判定（### シーン： で始まる行）
        if line.startswith('### シーン：'):
            # 前のシーンを保存
            if current_scene and current_dialogues:
                scene_name = current_scene
                section_data[current_section].append((scene_name, current_dialogues.copy()))

            # 新しいシーンを開始
            current_scene = line.replace('### シーン：', '').strip()
            current_dialogues = []
            continue

        # セリフの抽出（表形式）
        if line.startswith('| ') and '|' in line:
            parts = [p.strip() for p in line.split('|')]
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

                # ト書きの（）内の「」を削除
                dialogue = re.sub(r'「([^」]*)」', r'\1', dialogue)

                current_dialogues.append({
                    'speaker': speaker,
                    'dialogue': dialogue
                })

    # 最後のシーンを保存
    if current_scene and current_dialogues:
        section_data[current_section].append((current_scene, current_dialogues.copy()))

    print(f"\n{len(section_order)}個の編が見つかりました。\n")

    # 出力ディレクトリを作成
    os.makedirs(output_dir, exist_ok=True)

    # 各編ごとに統合ファイルを作成（出現順序で）
    created_files = []
    for section in section_order:
        scenes = section_data[section]
        if not scenes:
            continue

        output_file = os.path.join(output_dir, f"{section}.md")

        # 各シーンのセリフを統合
        all_dialogues = []
        scene_count = 0
        for scene_name, dialogues in scenes:
            scene_count += 1
            for item in dialogues:
                speaker = item['speaker']
                dialogue = item['dialogue']
                all_dialogues.append(f"{speaker},{dialogue}")

        # 統合ファイルに書き込み（行番号を振り直し）
        with open(output_file, 'w', encoding='utf-8') as f:
            for idx, content in enumerate(all_dialogues, start=1):
                f.write(f"{idx}→{content}\n")

        created_files.append(output_file)
        print(f"作成: {os.path.basename(output_file)} ({len(all_dialogues)}個のセリフ, {scene_count}シーンを統合)")

    print(f"\n合計 {len(created_files)} 個のファイルを作成しました。")
    print(f"出力先: {output_dir}")

    return created_files

def main():
    input_file = '/home/user/Kitazuna/セリフ集.md'
    output_dir = '/home/user/Kitazuna/dialogue_scenes'

    print("セリフ集.mdから編ごとに統合ファイルを作成中...")
    parse_and_merge_by_section(input_file, output_dir)

if __name__ == '__main__':
    main()
