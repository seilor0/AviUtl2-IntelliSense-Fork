# AviUtl2-IntelliSense
AviUtl2のスクリプトファイル作成を補助するVScode用の拡張機能です。<br>
Snippets,SignatureHelp,候補表示などのコード補完機能があります。

## 機能紹介
#### Snippets
設定項目(`--value@`)などの入力を補助するものです。<br>
`--`を省略して項目を入力しTabキーを押すと、設定項目のひな形が生成されます。
!["SnippetsImage"]("images/snippets.gif")
#### SignatureHelp
設定や関数の各項目の形式を表示します。<br>
関数入力時には現在入力中の項目がハイライト表示され、説明も出てきます。
!["SnippetsImage"]("images/signaturehelp.gif")
#### 候補表示
入力した文字によって設定項目や関数の予測候補が表示されます。<br>
!["SnippetsImage"]("images/signaturehelp.gif")
:::note warn
注意
これらの機能は特定の文字(`@,--,.`)などを入力することにより作動する仕組みになっています。<br>
入力時以外に表示させたり、万が一表示されなかったりする場合は、`Ctrl+Shift+Space`で手動で表示させることもできます。
:::