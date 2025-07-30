# AviUtl2-IntelliSense
AviUtl2のスクリプトファイル作成を補助するVScode用の拡張機能です。<br>
Snippets,SignatureHelp,候補表示などのコード補完機能があります。
> [!IMPORTANT]
> この拡張機能はいまのところベータ版として公開しています。<br>
まだマーケットプレイスには公開していません<br>
不具合などを見かけられましたら、このリポジトリのissuesもしくはDMにてお知らせください。

## 機能紹介
### Snippets
設定項目(`--value@`)などの入力を補助するものです。<br>
`--`を省略して項目を入力しTabキーを押すと、設定項目のひな形が生成されます。
!["SnippetsImage"](images/snippets.gif)
### SignatureHelp
設定や関数の各項目の形式を表示します。<br>
関数入力時には現在入力中の項目がハイライト表示され、説明も出てきます。
!["SnippetsImage"](images/signaturehelp.gif)<br>
### 候補表示
入力した文字によって設定項目や関数の予測候補が表示されます。<br>
!["SnippetsImage"](images/kouho.gif)<br>

> [!TIP]
> これらの機能は特定の文字(`@,--,.`)などを入力することにより作動する仕組みになっています。<br>
入力時以外に表示させたり、万が一表示されなかったりする場合は、`Ctrl+Shift+Space`で手動で表示させることもできます。
## 導入方法
1.Releasesから最新のバージョンの`.vsix`をダウンロードしてください。<br>
2.VScodeを立ち上げ、拡張機能メニューの上部にあるボタンを押し、「VSIXからのインストール」を選択してください。<br>
!["SnippetsImage"](images/install1.png)<br>
3.ダイアログでダウンロードしたvsixファイルを選択してください。<br>
**これで完了です。お疲れさまでした！**
