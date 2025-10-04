# AviUtl2-IntelliSense-Fork

Hirokawa-beachさんの[AviUtl2-IntelliSense-0.3.0](https://github.com/hirokawa-beach/AviUtl2-IntelliSense)のフォーク版です。<br>
主にSyntax Highlight部分を変更しています。

## 機能紹介
元の機能に加えて、ソースコードが以下のように着色されます。

<img src="images/syntaxhighlight.png" width="500">

**↓VScodeの設定(settings.json)を編集する方法(フォーク元と同様)**

<img src="images/syntaxhighlight.gif">

> [!IMPORTANT]
> Syntax Highlightの導入にはVScodeそのものの環境設定も変更する必要があります。
> 上のアニメーションgifも参考に、下記の手順に従って変更してください。
> VScodeを開き、設定マーク(左下)→設定、もしくは`Ctrl+,`で設定を表示したのち、
> ユーザー(vscode全体)の設定かワークスペースの設定の、編集したい方を選択し
> 右上にある「設定(JSONを開く)」を押してください。
> 開いたjsonファイルに下記のコードを追加してください。
```json
"editor.tokenColorCustomizations": {
  "textMateRules": [
    {
      "scope": "aul2.settings.lua", //設定項目(--check@など)への着色
      "settings": {
        "foreground": "#FF8800"
      }
    },
    {
      "scope": "aul2.variable.lua", //変数(obj.oxなど)への着色
      "settings": {
        "foreground": "#87CEFA"
      }
    },
    {
      "scope": "aul2.type.lua", //型("figure"など)への着色
      "settings": {
        "foreground": "#228B22"
      }
    }
  ]
}
```
>"foreground":につづくカラーコードを変更することで、ご自身でお好みの色に変更可能です。

## 導入方法(フォーク元と同様)
1.Releasesから最新のバージョンの`.vsix`をダウンロードしてください。<br>
2.VScodeを立ち上げ、拡張機能メニューの上部にあるボタンを押し、「VSIXからのインストール」を選択してください。<br>
<img src="images/install1.png" width="600"><br>
3.ダイアログでダウンロードしたvsixファイルを選択してください。<br>
**これで完了です。お疲れさまでした！**<br>

> [!TIP]
> VScodeのターミナルからも導入ができます。
> `cd`でvsixがダウンロードされている場所に飛んだあと、
> `code --install-extension aul2-intellisense-fork-x.x.x.vsix`を実行してください。
> バージョンを戻す時には、上記のコマンドに`--force`を足して実行してください

## アンインストール方法(フォーク元と同様)
ほかの拡張機能と同様に、拡張機能のメニューからAviUtl2 IntelliSense Forkを選び、「アンインストール」を選択してください。

## 機能詳細

### 追加した主なSyntax Highlight
- `local`, `function`, `if`文, `for`文
- `math`, `string`, `table`ライブラリ
- `pixelshader`, `computeshader`の定義部分, `{変数}.cdef`部分
- `obj.{関数}`以外の追加関数(ex:`RGB()`)
- ブロックコメント
- 旧スクリプト形式の一部(`--track0,1,2,3`, `--check0`, `--dialog`)
- 文字列, 数値, `obj.{変数}`以外の変数(アルファベット&数字&_で構成された単語)

### 変更点・修正点
- `--label`, `--script`, `--information`が着色されるように修正
- 変数(ex:`obj.ox`), 関数内の型(ex:`"figure"`)の着色対象範囲をファイル全体に変更
- `obj.setoption`, `obj.pixelshader`, `obj.computeshader`を着色対象に追加
- `obj.rotation`,`obj.degug_print`を`rotation`,`debug_print`に修正
- `obj.{変数}`の色をやや濃い青色に変更
- VScodeのsetting.jsonで設定する項目を`aul2.settings.lua`, `aul2.variable.lua`, `aul2.type.lua`の3つに削減

### その他
- AviUtl2 Beta8 の公開に伴い、SignatureHelp, SyntaxHighlightに`obj.putpixel`, `obj.copypixel`を追加
- AviUtl2 Beta12の公開に伴い、Snippets, SignatureHelp, SyntaxHighlightに`--text@`の項目を追加
- AviUtl2 Beta13の公開に伴い、SignatureHelp, SyntaxHighlightに`obj.getpixeldata`, `obj.putpixeldata`を追加
