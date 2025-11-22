const vscode = require('vscode');

function activate(context) {

  // ------------------------------
  // 説明の表示
  // ------------------------------

  // obj.関数
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'lua' },
      { provideSignatureHelp(document, position, token, context) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);
        const funcName = substring.match(/(obj\.\w+)\s*\([^)]*$/)?.[1];

        const helpMap = {
          'obj.mes': {
            label: 'obj.mes(text)',
            parameters: [
              { label: 'text', documentation: 'テキストオブジェクト内でのテキスト' }
            ]
          },
          'obj.effect': {
            label: 'obj.effect(name, param1, value1, param2, value2, ...)',
            parameters: [
              { label: 'name', documentation: 'エフェクト名' },
              { label: 'param1', documentation: 'パラメータ名' },
              { label: 'value1', documentation: 'パラメータ値' },
              { label: 'param2', documentation: 'パラメータ名' },
              { label: 'value2', documentation: 'パラメータ値' },
              { label: '...', documentation: 'param,value のペアを繰り返し指定可能' }
            ]
          },
          'obj.draw': {
            label: 'obj.draw([ox, oy, oz, zoom, alpha, rx, ry, rz])',
            parameters: [
              { label: 'ox', documentation: '相対座標X' },
              { label: 'oy', documentation: '相対座標Y' },
              { label: 'oz', documentation: '相対座標Z' },
              { label: 'zoom', documentation: '拡大率(1.0=等倍)' },
              { label: 'alpha', documentation: '不透明度(0.0=透明/1.0=不透明)' },
              { label: 'rx', documentation: 'X軸回転角度' },
              { label: 'ry', documentation: 'Y軸回転角度' },
              { label: 'rz', documentation: 'Z軸回転角度' }
            ]
          },
          'obj.drawpoly': {
            label: 'obj.drawpoly(params)',
            parameters: [
              { label: 'params', documentation: 'x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3[,u0,v0,u1,v1,u2,v2,u3,v3,alpha]\n{table}[,alpha]\n{table}[,vertex_num,alpha]'}
            ]
          },
          'obj.load': {
            label: 'obj.load(type, value)',
            parameters: [
              { label: 'type', documentation: 'ロードする種類' },
              { label: 'value', documentation: '値' }
            ]
          },
          'obj.setfont': {
            label: 'obj.setfont(name, size[, type, col1, col2])',
            parameters: [
              { label: 'name', documentation: 'フォント名' },
              { label: 'size', documentation: 'フォントサイズ' },
              { label: 'type', documentation: '文字の装飾(0-6,\n0=標準文字\n1=影付き\n2=影付き(薄)\n3=縁取り\n4=縁取り(細)\n5=縁取り(太)\n6=縁取り)' },
              { label: 'col1', documentation: '文字色' },
              { label: 'col2', documentation: '影・縁の色' }
            ]
          },
          'obj.rand': {
            label: 'obj.rand(st_num, ed_num[, seed, frame])',
            parameters: [
              { label: 'st_num', documentation: '乱数の最小値' },
              { label: 'ed_num', documentation: '乱数の最大値' },
              { label: 'seed', documentation: '乱数の種(プラス値→オブジェクト毎に異なる乱数/マイナス値→すべてのオブジェクトで同じ乱数)' },
              { label: 'frame', documentation: 'フレーム番号(省略時は現在のフレーム)' }
            ]
          },
          'obj.rand1': {
            label: 'obj.rand1([seed, frame])',
            parameters: [
              { label: 'seed', documentation: '乱数の種(プラス値→オブジェクト毎に異なる乱数/マイナス値→すべてのオブジェクトで同じ乱数)' },
              { label: 'frame', documentation: 'フレーム番号(省略時は現在のフレーム)' }
            ]
          },
          'obj.setoption': {
            label: 'obj.setoption(name, value)',
            parameters: [
              { label: 'name', documentation: 'オプション名(例:描画先変更→"drawtarget"/ 詳細はlua.txtを参照してください。)' },
              { label: 'value', documentation: 'オプション値(例:仮想バッファに描画先変更→"tempbuffer")' }
            ]
          },
          'obj.getoption': {
            label: 'obj.getoption(name)',
            parameters: [
              { label: 'name', documentation: 'オプション名' }
            ]
          },
          'obj.getvalue': {
            label: 'obj.getvalue(target[, time, section])',
            parameters: [
              { label: 'target', documentation: '設定種別' },
              { label: 'time', documentation: 'どの時点の値を取得するか(秒)' },
              { label: 'section', documentation: '時間の基準となる区間番号(0=開始点/1=最初の中間点/2=2個目の中間点/-1=終了点)' }
            ]
          },
          'obj.setanchor': {
            label: 'obj.setanchor(name, num[, option, ...])',
            parameters: [
              { label: 'name', documentation: '--value,--dialogで定義されている座標を格納する変数名' },
              { label: 'num', documentation: 'アンカーポイントの数' },
              { label: 'option', documentation: '各種オプション(例："line"=アンカーポイントを線で結ぶ,"loop"=線で結び一周させる)' },
              { label: '...', documentation: 'オプションを続けて書く' },
            ]
          },
          'obj.getpixel': {
            label: 'obj.getpixel(x, y[, type])',
            parameters: [
              { label: 'x', documentation: '取得するピクセルのX座標' },
              { label: 'y', documentation: '取得するピクセルのY座標' },
              { label: 'type', documentation: 'ピクセル情報のタイプ("col","rgb")' }
            ]
          },
          'obj.putpixel': {
            label: 'obj.putpixel(x, y, ...)',
            parameters: [
              { label: 'x', documentation: '書き換えるピクセルの座標' },
              { label: 'y', documentation: '書き換えるピクセルの座標' },
              { label: '...', documentation: 'オプションを続けて書く' }
            ]
          },
          'obj.copypixel': {
            label: 'obj.copypixel(dst_x, dst_y, src_x, src_y)',
            parameters: [
              { label: 'dst_x', documentation: 'コピー先の座標' },
              { label: 'dst_y', documentation: 'コピー先の座標' },
              { label: 'src_x', documentation: 'コピー元の座標' },
              { label: 'src_y', documentation: 'コピー元の座標' }
            ]
          },
          'obj.pixeloption': {
            label: 'obj.pixeloption(name, value)',
            parameters: [
              { label: 'name', documentation: 'オプション名(ピクセル情報タイプ→"type",ピクセル情報の読み出し先を指定→"get")' },
              { label: 'value', documentation: 'オプション値' }
            ]
          },
          'obj.getpixeldata': {
            label: 'obj.getpixeldata(target[, format])',
            parameters: [
              { label: 'target', documentation: '読み込む画像バッファ' },
              { label: 'format', documentation: '画像データのフォーマット(rgba/bgra) ※デフォルトはRGBA32bit' }
            ]
          },
          'obj.putpixeldata': {
            label: 'obj.putpixeldata(target, data, w, h[, format])',
            parameters: [
              { label: 'target', documentation: '書き込む画像バッファ' },
              { label: 'data', documentation: '画像データのポインタ(ユーザーデータ)' },
              { label: 'w', documentation: '横のピクセル数' },
              { label: 'h', documentation: '縦のピクセル数' },
              { label: 'format', documentation: '画像データのフォーマット(rgba/bgra) ※デフォルトはRGBA32bit' }
            ]
          },
          'obj.getaudio': {
            label: 'obj.getaudio(buf, file, type, size)',
            parameters: [
              { label: 'buf', documentation: 'データを受け取るテーブルを指定' },
              { label: 'file', documentation: '音声ファイル名\n（"audiobuffer"で編集中の音声データが取得できる）' },
              { label: 'type', documentation: '取得データの種類' },
              { label: 'size', documentation: '取得したデータ数,サンプリングレート' }
            ]
          },
          'obj.copybuffer': {
            label: 'obj.copybuffer(dst, src)',
            parameters: [
              { label: 'dst', documentation: 'コピー先のバッファ' },
              { label: 'src', documentation: 'コピー元のバッファ' }
            ]
          },
          'obj.clearbuffer': {
            label: 'obj.clearbuffer(target[, color])',
            parameters: [
              { label: 'target', documentation: 'クリアするバッファ名' },
              { label: 'color', documentation: '色(未指定なら透明色)' }
            ]
          },
          'obj.pixelshader': {
            label: 'obj.pixelshader(name, target, {resource, ...}[, {constant, ...}, blend, sampler])',
            parameters: [
              { label: 'name', documentation: 'シェーダーの登録名' },
              { label: 'target', documentation: '出力先のバッファ名' },
              { label: 'resource', documentation: '参照するバッファ名の配列' },
              { label: 'constant', documentation: '参照する定義の配列' },
              { label: 'blend', documentation: '出力先へのブレンド方法' },
              { label: 'sampler', documentation: 'サンプラーの種別' }
            ]
          },
          'obj.computeshader': {
            label: 'obj.computeshader(name, {target}, {resource, ...}[, {constant, ...}, countX, countY, countZ, sampler])',
            parameters: [
              { label: 'name', documentation: 'シェーダーの登録名' },
              { label: 'target', documentation: '出力先のバッファ名' },
              { label: 'resource', documentation: '参照するバッファ名の配列' },
              { label: 'constant', documentation: '参照する定義の配列' },
              { label: 'countX', documentation: 'X軸スレッドグループ数' },
              { label: 'countY', documentation: 'Y軸スレッドグループ数' },
              { label: 'countZ', documentation: 'Z軸スレッドグループ数' },
              { label: 'sampler', documentation: 'サンプラーの種別'},
            ]
          },
          'obj.getpoint': {
            label: 'obj.getpoint(target[, option])',
            parameters: [
              { label: 'target', documentation: '取得対象' },
              { label: 'option', documentation: '取得する値の種別' }
            ]
          },
          'obj.getinfo': {
            label: 'obj.getinfo(name, ...)',
            parameters: [
              { label: 'name', documentation: '取得する情報の名前' }
            ]
          },
          'obj.data': {
            label: 'obj.data(name)',
            parameters: [
              {label: 'name', documentation: '汎用データ領域の登録名'}
            ]
          },
          'obj.module': {
            label: 'obj.module(name)',
            parameters: [
              { label: 'name', documentation: 'モジュール名(スクリプトモジュールのファイル名本体)' }
            ]
          },
          'obj.interpolation': {
            label: 'obj.interpolation(time, x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3)',
            parameters: [
              { label: 'time', documentation: '時間' },
              { label: 'x0', documentation: '開始点X座標' },
              { label: 'y0', documentation: '開始点Y座標' },
              { label: 'z0', documentation: '開始点Z座標' },
              { label: 'x1', documentation: '制御点1,X座標' },
              { label: 'y1', documentation: '制御点1,Y座標' },
              { label: 'z1', documentation: '制御点1,Z座標' },
              { label: 'x2', documentation: '制御点2,X座標' },
              { label: 'y2', documentation: '制御点2,Y座標' },
              { label: 'z2', documentation: '制御点2,Z座標' },
              { label: 'x3', documentation: '終了点X座標' },
              { label: 'y3', documentation: '終了点Y座標' },
              { label: 'z3', documentation: '終了点Z座標' }
            ]
          },
        };
        if (!funcName in helpMap) return null;

        let info = helpMap[funcName];
        if (funcName === 'obj.load') {
          const type = line.match(/obj\.load\s*\(\s*["'](.+?)["']/)?.[1];
          const func = (type) => {
            switch (type) {
              case 'movie':
                return {
                  label: 'obj.load("movie", file[, time])',
                  parameters: [
                    { label: '"movie"', documentation: '' },
                    { label: 'file', documentation: '動画ファイルパス' },
                    { label: 'time', documentation: '表示する画像の時間(秒)(省略可)' }
                  ]
                };
              case 'image':
                return {
                  label: 'obj.load("image", file)',
                  parameters: [
                    { label: 'file', documentation: '画像ファイルパス' }
                  ]
                };
              case 'text':
                return {
                  label: 'obj.load("text", text[, speed, time])',
                  parameters: [
                    { label: '"text"', documentation: '' },
                    { label: 'text', documentation: '読み込むテキスト' },
                    { label: 'speed', documentation: 'timeパラメータの1秒間で表示する文字数' },
                    { label: 'time', documentation: 'speedパラメータに対する経過時間' }
                  ]
                };
              case 'figure':
                return {
                  label: 'obj.load("figure", name[, color, size, line, round])',
                  parameters: [
                    { label: '"figure"', documentation: '' },
                    { label: 'name', documentation: '図形名、SVGファイル名' },
                    { label: 'color', documentation: '色(カラーコード)' },
                    { label: 'size', documentation: '図形のサイズ' },
                    { label: 'line', documentation: '図形のライン幅' },
                    { label: 'round', documentation: '角丸にするか(true=する,false=しない<default>)' }
                  ]
                };
              case 'framebuffer':
                return {
                  label: 'obj.load("framebuffer"[, x, y, w, h][, alpha])',
                  parameters: [
                    { label: '"framebuffer"', documentation: '' },
                    { label: 'x, y, w, h', documentation: 'フレームバッファから取得する範囲(省略時全体)' },
                    { label: 'alpha', documentation: 'アルファチャンネルを維持(true=する,false=しない<default>)' }
                  ]
                };
              case 'tempbuffer':
                return {
                  label: 'obj.load("tempbuffer"[, x, y, w, h])',
                  parameters: [
                    { label: 'x, y, w, h', documentation: 'フレームバッファから取得する範囲(省略時全体)' }
                  ]
                };
              case 'layer':
                return {
                  label: 'obj.load("layer", no[, effect])',
                  parameters: [
                    { label: '"layer"', documentation: '' },
                    { label: 'no', documentation: 'レイヤー番号(1～)' },
                    { label: 'effect', documentation: '追加エフェクトの実行(true=する,false=しない<default>)' }
                  ]
                };
              default:
                return null;
            }
          }
          info = func(type);
        } else if (funcName=='obj.setoption') {
          const type = line.match(/obj\.setoption\s*\(\s*["'](.+?)["']/)?.[1];
          const func = (type) => {
            switch(type) {
              case 'culling':
                return {
                  label: 'obj.setoption("culling", value)',
                  parameters: [
                    {label: '"culling"', documentation: ''},
                    {label: 'value', documentation: '0=表示 / 1=非表示'},
                  ]
                };
              case 'billboard':
                return {
                  label: 'obj.setoption("billboard", value)',
                  parameters: [
                    {label: '"billboard"', documentation: ''},
                    {label: 'value', documentation: '0=向かない / 1=横方向のみ / 2=縦方向のみ / 3=向く'}
                  ]
                };
              case 'blend':
                return {
                  label: 'obj.setoption("blend", value[, option])',
                  parameters: [
                    {label: '"blend"', documentation: ''},
                    {label: 'value', documentation: ''}
                  ]
                };
              case 'drawtarget':
                if (/["']drawtarget["']\s*,\s*["']tempbuffer/.test(line)) {
                  return {
                    label: 'obj.setoption("drawtarget", "tempbuffer"[, w, h])',
                    parameters: [
                      {label: '"drawtarget"', documentation:''},
                      {label: '"tempbuffer"', documentation:''},
                      {label: 'w', documentation:'仮想バッファのサイズ（省略時は初期化しません）'},
                      {label: 'h', documentation:'仮想バッファのサイズ（省略時は初期化しません）'},
                    ]
                  };
                } else if (line.test(/["']drawtarget["']\s*,\s*["']framebuffer/)) {
                  return {
                    label: 'obj.setoption("drawtarget","framebuffer")',
                    parameters: [
                      {label: '"drawtarget"', documentation:''},
                      {label: '"framebuffer"', documentation:''},
                    ]
                  }
                } else return null;
              case 'draw_state':
                return {
                  label: 'obj.setoption("draw_state",flag)',
                  parameters: [
                    {label: '"draw_state"', documentation: ''},
                    {label: 'flag', documentation: 'true：描画済み / false：未描画'}
                  ]
                };
              case 'focus_mode':
                return {
                  label: 'obj.setoption("focus_mode",value)',
                  parameters: [
                    {label: '"focus_mode"', documentation: ''},
                    {label: 'value', documentation: ''}
                  ]
                };
              case 'camera_params':
                return {
                  label: 'obj.setoption("camera_param",cam)',
                  parameters: [
                    {label: '"camera_param"', documentation: ''},
                    {label: 'cam', documentation: 'カメラのパラメータ（テーブル）'}
                  ]
                };
              case 'sampler':
                return {
                  label: 'obj.setoption("sampler",value)',
                  parameters: [
                    {label: '"sampler"', documentation: ''},
                    {label: 'value', documentation: ''},
                  ]
                };
              default:
                return null;
            }
          }
          info = func(type);
        }
        return sigHelpFromInfo(info, calculateActiveParameter(substring));
      }},
      '(', ',', ' '
    )
  );

  // 関数(not obj.***)
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'lua' },
      { provideSignatureHelp(document, position) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);
        const funcName = substring.match(/(\w+)\s*\([^)]*$/)?.[1];

        const helpMap = {
          'RGB': {
            label: 'RGB(r, g, b)',
            parameters: [
              { label: 'r', documentation: '赤' },
              { label: 'g', documentation: '緑' },
              { label: 'b', documentation: '青/このあと続けて同じようにr2,g2,b2指定で時間経過に応じて色変化' },
            ]
          },
          'HSV': {
            label: 'HSV(h, s, v)',
            parameters: [
              { label: 'h', documentation: '色相' },
              { label: 's', documentation: '彩度' },
              { label: 'v', documentation: '明度/このあと同じようにr2,g2,b2指定で時間経過に応じて色変化' },
            ]
          },
          'OR': {
            label: 'OR(a, b)',
            parameters: [
              { label: 'a', documentation: '' },
              { label: 'b', documentation: '' },
            ]
          },
          'AND': {
            label: 'AND(a, b)',
            parameters: [
              { label: 'a', documentation: '' },
              { label: 'b', documentation: '' },
            ]
          },
          'XOR': {
            label: 'XOR(a, b)',
            parameters: [
              { label: 'a', documentation: '' },
              { label: 'b', documentation: '' },
            ]
          },
          'SHIFT': {
            label: 'SHIFT(a, shift)',
            parameters: [
              { label: 'a', documentation: '' },
              { label: 'shift', documentation: '(正の数→左シフト、負の数→右シフト)' },
            ]
          },
          'rotation': {
            label: 'rotation(x0, y0, x1, y1, x2, y2, x3, y3, zoom, r)',
            parameters: [
              { label: 'x0', documentation: '頂点0のX座標' },
              { label: 'y0', documentation: '頂点0のY座標' },
              { label: 'x1', documentation: '頂点1のX座標' },
              { label: 'y1', documentation: '頂点1のY座標' },
              { label: 'x2', documentation: '頂点2のX座標' },
              { label: 'y2', documentation: '頂点2のY座標' },
              { label: 'x3', documentation: '頂点3のX座標' },
              { label: 'y3', documentation: '頂点3のY座標' },
              { label: 'zoom', documentation: '拡大率(1.0=等倍)' },
              { label: 'r', documentation: '回転角度' }
            ]
          },
        };
        if (!funcName in helpMap) return null;
        const info = helpMap[funcName];
        return sigHelpFromInfo(info, calculateActiveParameter(substring));
      }},
      '(', ',', ' '
    )
  );

  // math,string,table.関数
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      {scheme:'file', language:'lua'},
      {provideSignatureHelp(document, position, token, context) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);
        const funcName = substring.match(/(?<funcName>(?:math|string|table)\.\w+)\s*\(/)?.[1];

        const helpMap = {
          'math.atan2': {
            label: 'math.atan2(y, x)',
            parameters: [
              {label:'y', documentation:''},
              {label:'x', documentation:''},
            ]
          },
          'math.pow': {
            label: 'math.pow(x, y)',
            parameters: [
              {label:'x', documentation:'底'},
              {label:'y', documentation:'指数'},
            ]
          },
          'math.log': {
            label: 'math.log(x[, base])',
            parameters: [
              {label:'x', documentation:''},
              {label:'base', documentation:'底（省略時は自然対数）'},
            ]
          },
        };
        if (!funcName in helpMap) return null;
        return sigHelpFromInfo(helpMap[funcName], calculateActiveParameter(substring));
      }},
      '(', ',', ' '
    )
  )

  // 設定項目
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      { scheme: 'file', language: 'lua' },
      { provideSignatureHelp(document, position, token, ctx) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);
        const triggerRegex = /^--(track|check|col|file|font|figure|select|value|text)@/;
        const kind = line.match(triggerRegex)?.[1];

        const helpMap = {
          'track': {
            label: '--track@変数名:項目名,最小値,最大値,デフォルト値[,移動単位]',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: '最小値', documentation: '' },
              { label: '最大値', documentation: '' },
              { label: 'デフォルト値', documentation: '' },
              { label: '[,移動単位]', documentation: '1 or 0.1 or 0.01 or 0.001' }
            ]
          },
          'check': {
            label: '--check@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: '0/1 or true/false' },
            ]
          },
          'col': {
            label: '--col@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: 'カラーコード' },
            ]
          },
          'file': {
            label: '--file@変数名:項目名',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
            ]
          },
          'font': {
            label: '--font@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: '' },
            ]
          },
          'figure': {
            label: '--figure@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: '' },
            ]
          },
          'select': {
            label: '--select@変数名:項目名=デフォルト値,選択肢=値,選択肢=値,...',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: '選択肢', documentation: '' }
            ]
          },
          'value': {
            label: '--value@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: '数値 → 0\n文字列 → "あ"\n配列 → {0,0,0}' },
            ]
          },
          'text': {
            label: '--text@変数名:項目名,デフォルト値',
            parameters: [
              { label: '変数名', documentation: '' },
              { label: '項目名', documentation: '' },
              { label: 'デフォルト値', documentation: '' },
            ]
          },
        };
        if (!kind in helpMap) return null;
        const info = helpMap[kind];
        let i = substring.search(':');
        const count = i==-1 ? 0 : substring.substring(i).split(',').length;
        return sigHelpFromInfo(info, count);
      }},
      '@', ':', ','
    )
  );


  // ------------------------------
  // 補完候補の提示
  // ------------------------------

  // CompletionItem:
  // label: 登録名（下に出てくる名前）
  // kind: 左のアイコン
  // insertText: 入力される文字列。Falsyだとlabel
  // filterText: アイテムのフィルタリングに使われる文字列。Falsyだとlabel
  // detail: 右に出てくる説明
  // documentation: 上に同じく。md形式が使える


  // obj.関数名
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'lua' },
      { provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const text = line.substring(0, position.character);
        const typed = text.match(/obj\.(\w*)$/)?.[1];
        if (typed==undefined) return null;

        const candidates = [
          {
            label:'mes', 
            detail:'テキストオブジェクトの中で指定のテキストを追加する',
            documentation:'テキストオブジェクトのテキスト内のみ使用可\n※obj.を省略してmes()のみでも使用可'
          },
          {
            label:'effect', 
            detail:'指定のフィルタ効果を実行する', 
            documentation:'メディアオブジェクトのみ使用可\n引数なしで呼ぶとスクリプト以降のフィルタ効果を実行する'
          },
          {
            label:'draw', 
            detail:'現在のオブジェクトを描画する', 
            documentation:'※obj.draw()を使用した場合スクリプト以降のフィルタ効果は実行されない\n※obj.effect()を引数なしで呼ぶことで事前にスクリプト以降のフィルタ効果を実行できる'
          },
          {
            label:'drawpoly', 
            detail:'現在のオブジェクトの任意部分/指定色を任意の三角形/四角形で描画する', 
            documentation:'記述方法が複数あるため、詳細は公式ドキュメントを参照'
          },
          {
            label:'load', 
            detail:'現在のオブジェクトの画像を読み込む', 
            documentation:'typeを省略した場合は自動的に判別する\n※読み込まれていた画像は破棄される'
          },
          {
            label:'setfont', 
            detail:'obj.load()のテキストで使うフォントを指定する', 
            documentation:'※スクリプトの呼び出し毎に指定する必要がある'
          },
          {
            label:'rand', 
            detail:'乱数を発生させる', 
            documentation:'通常の乱数と異なり、同一時間のフレームで常に同じ値が出るように乱数を発生させる\nobj.を省略してrand()のみでも使用可'
          },
          {
            label:'rand1', 
            detail:'0.0以上1.0未満の乱数を発生させる', 
            documentation:'通常の乱数と異なり、同一時間のフレームで常に同じ値が出るように乱数を発生させる\nobj.を省略してrand1()のみでも使用可'
          },
          {
            label:'setoption', 
            detail:'現在のオブジェクトの各種オプションを設定する', 
            documentation:'※スクリプトの呼び出し毎に指定する必要がある'
          },
          {
            label:'getoption', 
            detail:'現在のオブジェクトの各種オプションを取得する'
          },
          {
            label:'getvalue', 
            detail:'現在のオブジェクトの設定値を取得する'
          },
          {
            label:'setanchor', 
            detail:'アンカーポイントを表示する', 
            documentation:'この関数を呼び出した時にアンカーポイントの表示設定とアンカーが移動していた場合の変数への反映を行う\n呼び出し順序や回数を変更すると正しく反映されない場合がある'
          },
          {
            label:'getpixel', 
            detail:'現在のオブジェクトのピクセル情報を取得する。引数なしで呼ぶとオブジェクトのピクセル数を取得できる', 
            documentation:'※VRAMアクセスを低減する為にキャッシュしたものから値を返却する\n状況によってキャッシュが更新されずに正しい値が取得出来ない場合がある（draw,pixel系の描画関連）\n`obj.pixeloption("get",xxx)`を処理することで能動的にキャッシュを破棄することができる'
          },
          {
            label:'putpixel', 
            detail:'現在のオブジェクトのピクセル情報を書き換える。引数なしで呼ぶとオブジェクトのピクセル数を取得できる', 
            documentation:'受け渡すピクセル情報のタイプは obj.pixeloption("type") で指定したタイプになる\n※ピクセル毎にコンピュートシェーダーで実行するので処理は速くない'
          },
          {
            label:'copypixel', 
            detail:'現在のオブジェクトのピクセル情報をコピーする', 
            documentation:'※ピクセル毎にコンピュートシェーダーで実行するので処理は速くない'
          },
          {
            label:'pixeloption', 
            detail:'`obj.getpixel()`,`obj.putpixel()`,`obj.copypixel()`の処理オプションを設定する', 
            documentation:'※スクリプトの呼び出し毎に指定する必要がある'
          },
          {
            label:'getpixeldata', 
            detail:'画像バッファからRGBA(32bit)形式でデータを読み出す', 
            documentation:'スクリプトモジュールやDLLを利用して画像処理をする為のもの\n※VRAMからデータを取得するので処理は速くない'
          },
          {
            label:'putpixeldata', 
            detail:'RGBA(32bit)形式のデータを画像バッファへ書き込む', 
            documentation:'スクリプトモジュールやDLLを利用して画像処理をする為のもの\n※VRAMへデータを書き込むので処理は速くない'
          },
          {
            label:'getaudio', 
            detail:'音声ファイルからオーディオデータを取得する', 
            documentation:'オブジェクトの時間を基準とした位置のデータを取得する'
          },
          {
            label:'copybuffer', 
            detail:'画像バッファをコピーする'
          },
          {
            label:'clearbuffer', 
            detail:'画像バッファをクリアする'
          },
          {
            label:'pixelshader', 
            detail:'ピクセルシェーダーを実行する'
          },
          {
            label:'computeshader', 
            detail:'コンピュートシェーダーを実行する'
          },
          {
            label:'getpoint', 
            detail:'トラックバーの値を取得する', 
            documentation:'トラックバー移動スクリプトのみ使用'
          },
          {
            label:'getinfo', 
            detail:'各種環境情報を取得する'
          },
          {
            label:'data', 
            detail:'汎用データ領域を取得する', 
            documentation:'※スクリプトモジュールやDLL向け'
          },
          {
            label:'module', 
            detail:'スクリプトモジュール（.mod2）の関数を取得する'
          },
          {
            label:'interpolation', 
            detail:'連続した点p0,p1,p2,p3から時間time(0～1)に応じたp1,p2間の座標を計算する'
          },
        ];
        return candidates.map(dic => {
            const item = new vscode.CompletionItem(`obj.${dic.label}`, vscode.CompletionItemKind.Function);
            item.insertText = dic.label;
            item.filterText = dic.label;
            item.detail = dic.detail;
            if (dic.documentation) item.documentation = dic.documentation;
            return item;
          });
      }},
      '.', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
      'v', 'w', 'x', 'y', 'z'
    )
  );

  // obj.関数()の変数部分
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      {scheme: 'file', language: 'lua'},
      {provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);

        const match = substring.match(/obj\.(?<funcName>\w+?)(?<innerText>\(.*)/);
        if (!match) return null;
        const {funcName, innerText} = match.groups;

        // obj.func()が閉じている時→何も表示しない
        if (innerText.split('(').length==innerText.split(')').length) return null;
        
        const activeParamNum = calculateActiveParameter(innerText);
        let candidates = [];
        if (funcName=='load') {
          if (activeParamNum==0) {
            candidates = [
              {label: '"movie"', detail: '動画ファイルの指定時間の画像'},
              {label: '"image"', detail: '画像ファイル'},
              {label: '"text"', detail: 'テキスト', documentation: '※テキストオブジェクトには使用不可'},
              {label: '"figure"', detail: '図形, SVGファイル'},
              {label: '"framebuffer"', detail: 'フレームバッファ'},
              {label: '"tempbuffer"', detail: '仮想バッファ'},
              {label: '"layer"', detail: '指定レイヤー上のオブジェクト'},
              {label: '"before"', detail: '直前オブジェクト', documentation: '※カスタムオブジェクトで他のオブジェクトを読み込む前の時のみ使える'},
            ];
          } else if (activeParamNum==1) {
            if (/obj.load\s*\(\s*["']figure["']/.test(substring)) {
              candidates = [
                {label:'"背景"'},
                {label:'"円"'},
                {label:'"三角形"'},
                {label:'"四角形"'},
                {label:'"五角形"'},
                {label:'"六角形"'},
                {label:'"星形"'},
                {label:'"ハート"'},
                {label:'"（SVGファイル名）"'},
              ];
            }
          }

        } else if (funcName=='setoption') {
          if (activeParamNum==0) {
            candidates = [
              {label: '"culling"', detail: '裏面を表示しない'},
              {label: '"billboard"', detail: 'カメラの方向を向く'},
              {label: '"blend"', detail: '合成モード'},
              {label: '"drawtarget"', detail: '描画先を変更'},
              {label: '"draw_state"', detail: 'スクリプト内でフレームバッファに描画されたかのステータスを変更する'},
              {label: '"focus_mode"', detail: 'オブジェクトのフォーカス枠モード'},
              {label: '"camera_param"', detail: 'カメラのパラメータ', documentation: '※カメラがエディットモードの時は反映されない\n※カメラ効果のみ使用可'},
              {label: '"sampler"', detail: 'サンプラーモード'},
            ];
          } else if (activeParamNum==1) {
            const name = innerText.match(/["'](.+?)["']/)?.[1];
            candidates = ((name) => {
              switch (name) {
                case 'blend':
                  return [
                    {label:'"none"', detail:'通常'},
                    {label:'"add"', detail:'加算'},
                    {label:'"sub"', detail:'減算'},
                    {label:'"mul"', detail:'乗算'},
                    {label:'"screen"', detail:'スクリーン'},
                    {label:'"overlay"', detail:'オーバーレイ'},
                    {label:'"light"', detail:'比較（明）'},
                    {label:'"dark"', detail:'比較（暗）'},
                    {label:'"brightness"', detail:'輝度'},
                    {label:'"chroma"', detail:'色差'},
                    {label:'"shadow"', detail:'陰影'},
                    {label:'"light_dark"', detail:'明暗'},
                    {label:'"diff"', detail:'差分'},
                    {label:'"alpha_add"', detail:'色情報は加重平均してアルファ値は加算', documentation:'仮想バッファ専用'},
                    {label:'"alpha_max"', detail:'色情報は加重平均してアルファ値は大きい方を採用', documentation:'仮想バッファ専用'},
                    {label:'"alpha_sub"', detail:'色情報は何もせずにアルファ値を減算', documentation:'仮想バッファ専用'},
                    {label:'"alpha_add2"', detail:'色情報は重ね合わせしてアルファ値は加算', documentation:'仮想バッファ専用'},
                  ];
                case 'drawtarget':
                  return [
                    {label:'"framebuffer"', detail:'フレームバッファ'},
                    {label:'"tempbuffer"', detail:'仮想バッファ'},
                  ];
                case 'draw_state':
                  return [
                    {label:'true', detail:'描画済み'},
                    {label:'false', detail:'未描画'},
                  ];
                case 'focus_mode':
                  return [{label:'"fixed_size"', detail:'大きさ固定の枠にする'}];
                case 'camera_param':
                  return [
                    {label:'cam.x', detail:'カメラの座標X'},
                    {label:'cam.y', detail:'カメラの座標Y'},
                    {label:'cam.z', detail:'カメラの座標Z'},
                    {label:'cam.tx', detail:'カメラの目標座標X'},
                    {label:'cam.ty', detail:'カメラの目標座標Y'},
                    {label:'cam.tz', detail:'カメラの目標座標Z'},
                    {label:'cam.rz', detail:'カメラの傾き'},
                    {label:'cam.ux', detail:'カメラの上方向単位ベクトルX'},
                    {label:'cam.uy', detail:'カメラの上方向単位ベクトルY'},
                    {label:'cam.uz', detail:'カメラの上方向単位ベクトルZ'},
                    {label:'cam.d', detail:'カメラからスクリーンまでの距離（焦点距離）'},
                  ];
                case 'sampler':
                  return [
                    {label:'"clip"', detail:'領域外は透明色'},
                    {label:'"clamp"', detail:'領域外は一番外側の色'},
                    {label:'"loop"', detail:'領域外はループ'},
                    {label:'"mirror"', detail:'領域外は領域を反転しながらループ'},
                    {label:'"dot"', detail:'拡大縮小補間をしない（領域外は透明色）'},      
                  ];
              }
            })(name);
          }

        } else if (funcName=='getoption') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"track_mode"', detail:'トラックバーの移動モード'},
              {label:'"section_num"', detail:'オブジェクトの区間の数'},
              {label:'"script_name"', detail:'スクリプト名'},
              {label:'"gui"', detail:'GUIの表示状態', documentation:'true:表示 / false:非表示'},
              {label:'"camera_mode"', detail:'カメラ制御状態', documentation:'true:カメラ制御対象 / false:カメラ制御対象外'},
              {label:'"camera_param"', detail:'カメラのパラメータ'},
              {label:'"multi_object"', detail:'個別オブジェクトが有効か'},
            ];
          }

        } else if (funcName=='getvalue') {
          if (activeParamNum==0) {
            candidates = [
              {label:'0', detail:'トラックバー0の値'},
              {label:'1', detail:'トラックバー1の値'},
              {label:'2', detail:'トラックバー2の値'},
              {label:'3', detail:'トラックバー3の値'},
              {label:'"x"', detail:'基準座標X'},
              {label:'"y"', detail:'基準座標Y'},
              {label:'"z"', detail:'基準座標Z'},
              {label:'"rx"', detail:'基準X軸回転角度'},
              {label:'"ry"', detail:'基準Y軸回転角度'},
              {label:'"rz"', detail:'基準Z軸回転角度'},
              {label:'"cx"', detail:'基準中心座標X'},
              {label:'"cy"', detail:'基準中心座標Y'},
              {label:'"cz"', detail:'基準中心座標Z'},
              {label:'"sx"', detail:'基準拡大率X（1.0=等倍）'},
              {label:'"sy"', detail:'基準拡大率Y（1.0=等倍）'},
              {label:'"sz"', detail:'基準拡大率Z（1.0=等倍）'},
              {label:'"zoom"', detail:'基準拡大率（100=等倍）', documentation:'※obj.zoom（1.0=等倍）と異なっているので注意\n※互換対応'},
              {label:'"aspect"', detail:'基準アスペクト比(-1.0～1.0)', documentation:'プラス=横縮小 / マイナス縦縮小）'},
              {label:'"alpha"', detail:'基準不透明度(0.0～1.0)', documentation:'0.0=透明 / 1.0=不透明）'},
              {label:'"time"', detail:'オブジェクト基準の時間'},
              {label:'"layer7.x"', detail:'別レイヤーのオブジェクトの値、有無', documentation:'※layer[レイヤー番号].[設定種別]:別レイヤーのオブジェクトの値\n※layer[レイヤー番号]:オブジェクトの有無(true/false)'},
            ]
          } else if (activeParamNum==2) {
            candidates = [
              {label:'0',  detail:'開始点'},
              {label:'1',  detail:'最初の中間点'},
              {label:'2',  detail:'2個目の中間点'},
              {label:'-1', detail:'終了点'},
            ]
          }

        } else if (funcName=='setanchor') {
          if (activeParamNum==2) {
            candidates = [
              {label:'"line"', detail:'アンカーポイントを線で結ぶ'},
              {label:'"loop"', detail:'アンカーポイントを線で結び一周させる'},
              {label:'"star"', detail:'アンカーポイントをオブジェクトの中心とそれぞれ線で結ぶ'},
              {label:'"arm"', detail:'アンカーポイントとオブジェクトの中心を線で結ぶ'},
              {label:'"color"', detail:'上記オプションの線の色を変更する', documentation:'後続の引数に色(0x000000～0xffffff)を指定する'},
              {label:'"inout"', detail:'上記オプションの線の表示をIN,OUT側の2個として表示する（※アンカー数は半々になる）'},
              {label:'"xyz"', detail:'アンカーポイントを3D座標で制御する', documentation:'※デフォルトは2D座標\n※カメラ制御+シャドーで使用する場合にプレビューで影部分が少しずれる場合がある'},
            ];
          }

        } else if (funcName=='getpixel') {
          if (activeParamNum==2) {
            candidates = [
              {label:'"col"', documentation:'戻り値：\n色情報(0x000000～0xffffff),\n不透明度（0.0=透明 / 1.0=不透明）'},
              {label:'"rgb"', documentation:'戻り値：\n各8bit(0～255)のRGBA情報(r,g,b,a)'},
              {label:'"yc"', documentation:'戻り値：\nYCbCr旧内部形式(y,cb,cr,a)'},
              {label:'(引数なし)', documentation:'戻り値：\n横,縦のピクセル数'}
            ];
          }

        } else if (funcName=='pixeloption') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"type"', detail:'ピクセル情報タイプ'},
              {label:'"get"', detail:'ピクセル情報の読み出し先'},
              {label:'"put"', detail:'ピクセル情報の書き込み先'},
              {label:'"blend"', detail:'書き込む時の合成モード'},
            ];
          } else if (activeParamNum==1) {
            const name = innerText.match(/["'](.+?)["']/)?.[1];
            candidates = ((name)=>{
              switch(name) {
                case 'type':
                  return [
                    {label:'"col"'},
                    {label:'"rgb"'},
                    {label:'"yc"'},
                  ];
                case 'get':
                  return [
                    {label:'"object"', detail:'オブジェクト'},
                    {label:'"framebuffer"', detail:'フレームバッファ'}
                  ];
                case 'put':
                  return [
                    {label:'"object"', detail:'オブジェクト'},
                    {label:'"framebuffer"', detail:'フレームバッファ'}
                  ];
                case 'blend':
                  return [
                    {label:'（引数なし）', detail:'置き換え'},
                    {label:'0', detail:'通常'},
                    {label:'1', detail:'加算'},
                    {label:'2', detail:'減算'},
                    {label:'3', detail:'乗算'}
                  ];
              }
            })(name);
          }
          
        } else if (funcName=='getpixeldata') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:***"', detail:'キャッシュバッファ（***は任意の名前）'}
            ];
          } else if (activeParamNum==1) {
            candidates = [
              {label:'"rgba"', detail:'RGBA32bit'},
              {label:'"bgra"', detail:'BGRA32bit'}
            ];
          }

        } else if (funcName=='putpixeldata') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'}
            ];
          } else if (activeParamNum==4) {
            candidates = [
              {label:'"rgba"', detail:'RGBA32bit'},
              {label:'"bgra"', detail:'BGRA32bit'}
            ];
          }

        } else if (funcName=='getaudio') {
          if (activeParamNum==2) {
            candidates = [
              {label:"pcm", detail:'PCMサンプリングデータ（16bitモノラルのスケール基準）'},
              {label:"spectrum", detail:'周波数毎の音量データ'},
              {label:"fourier", detail:'音声を離散フーリエ変換したデータ（sizeの指定は不要）', documentation:'※元周波数の1/2048～1/2まで1/2048刻みの1024個のデータ'},
              {label:"xxx.l", detail:'左チャンネルの音声で取得（xxxは取得データ種別）'},
              {label:"xxx.r", detail:'右チャンネルの音声で取得（xxxは取得データ種別）'},
            ];
          }
        } else if (funcName=='copybuffer') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'}
            ];
          } else if (activeParamNum==1) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'},
              {label:'"image:xxx"', detail:'画像ファイル（xxxはスクリプトフォルダからの相対パスの画像ファイル名）'}
            ];
          }

        } else if (funcName=='clearbuffer') {
          if (activeParamNum==0) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'}
            ];
          }

        } else if (funcName=='pixelshader') {
          if (activeParamNum==1 || activeParamNum==2) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'}
            ];
          } else if (activeParamNum==4) {
            candidates = [
              {label:'"copy"', detail:'出力をそのままコピーする'},
              {label:'"mask"', detail:'α値のみを乗算する ※RGB値は利用しない'},
              {label:'"draw"', detail:'出力をアルファブレンドする'},
              {label:'"add"', detail:'出力を加算合成する'}
            ];
          } else if (activeParamNum==5) {
            candidates = [
              {label:'"clip"', detail:'領域外（0.0～1.0の範囲外）は透明色'},
              {label:'"clamp"', detail:'領域外は境界の色'},
              {label:'"loop"', detail:'領域外は領域をループ'},
              {label:'"mirror"', detail:'領域外は領域を反転しながらループ'},
              {label:'"dot"', detail:'拡大縮小補間をしない（領域外は透明色）'},
            ];
          }

        } else if (funcName=='computeshader') {
          if (activeParamNum==1 || activeParamNum==2) {
            candidates = [
              {label:'"object"', detail:'オブジェクト'},
              {label:'"tempbuffer"', detail:'仮想バッファ'},
              {label:'"framebuffer"', detail:'フレームバッファ'},
              {label:'"cache:xxx"', detail:'キャッシュバッファ（xxxは任意の名前）'}
            ];
          } else if (activeParamNum==7) {
            candidates = [
              {label:'"clip"', detail:'領域外（0.0～1.0の範囲外）は透明色'},
              {label:'"clamp"', detail:'領域外は境界の色'},
              {label:'"loop"', detail:'領域外は領域をループ'},
              {label:'"mirror"', detail:'領域外は領域を反転しながらループ'},
              {label:'"dot"', detail:'拡大縮小補間をしない（領域外は透明色）'},
            ];
          }

        } else if (funcName=='getpoint') {
          if (activeParamNum==0) {
            candidates = [
              {label:'（整数）', detail:'各区間でのトラックバー値', documentation:'0=開始点 / 1=最初の中間点 / 2=2個目の中間点 / ...\noptionで取得する関連トラックの相対位置を指定できる', preselect:true},
              {label:'"index"', detail:'現在の区間での位置', documentation:'開始点と最初の中間点の間の場合は0.5等の少数で表される'},
              {label:'"num"', detail:'開始終了中間点の総数'},
              {label:'"time"', detail:'現在の時間', documentation:'optionで時間を取得する区間を指定できる'},
              {label:'"accelerate"', detail:'加速度が設定されているか', documentation:'戻り値： true=有効 / false=無効'},
              {label:'"decelerate"', detail:'減速度が設定されているか', documentation:'戻り値： true=有効 / false=無効'},
              {label:'"param"', detail:'トラックバーの設定値'},
              {label:'"link"', detail:'関連トラックでのインデックスと総数', documentation:'関連トラックは座標等で他のトラックの値を取得する為に使用する\nX座標での戻り値：0,3 / Y座標での戻り値：1,3 / Z座標での戻り値：2,3'},
              {label:'"framerate"', detail:'フレームレート'},
              {label:'"timecontrol"', detail:'時間制御を反映した現在の値'}
            ];
          } else if (activeParamNum==1) {
            candidates = [
              {label:'"index"', detail:'時間制御を反映した区間での位置'},
              {label:'"time"', detail:'時間制御を反映した時間'}
            ];
          }

        } else if (funcName=='getinfo') {
          candidates = [
            {label:'"script_path"', detail:'スクリプトフォルダのパス'},
            {label:'"saving"', detail:'動画の出力中か', documentation:'true:出力中 / false:非出力中'},
            {label:'"image_max"', detail:'最大画像サイズ(w,h)'},
            {label:'"clock"', detail:'アプリ起動からの経過時間(s)', documentation:'※パフォーマンスカウンターで計測'},
            {label:'"script_time"', detail:'スクリプトの処理時間(ms)', documentation:'※パフォーマンスカウンターで計測'},
            {label:'"version"', detail:'本体のバージョン情報'},
          ];
        }
        
        const items = candidates.map(dic=>{
          const item = new vscode.CompletionItem(dic.label, vscode.CompletionItemKind.EnumMember);
          if (/^["'].*["']$/.test(dic.label)) {
            const bef = substring.match(/[^(){},]*$/i)[0].length;
            const af  = line.substring(position.character).match(/^[^(){},]*/i)[0].length;
            item.range = new vscode.Range(position.line, substring.length-bef, position.line, substring.length+af);
          }
          if (dic.detail) item.detail = dic.detail;
          if (dic.documentation) item.documentation=dic.documentation;
          return item;
        });
        return items;
      }},
      '(', '{', ',', ' ', '"', "'",
      '.', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
      'v', 'w', 'x', 'y', 'z'
    )
  )

  // 関数名(not obj.***), Luaライブラリ, obj
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'lua', scheme: 'file' },
      { provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const text = line.substring(0, position.character);
        const typed = text.match(/\b(\w*)$/)?.[1];
        if(typed==undefined) return null;

        const functions = [
          'RGB',
          'HSV',
          'OR',
          'AND',
          'XOR',
          'SHIFT',
          'rotation',
          'debug_print',
          'rand',
          'rand1',
          'mes',
        ];
        const items = functions.map(name => {
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
          item.detail = 'AviUtl2 独自関数';
          return item;
        });

        ['math', 'table', 'string'].forEach(name=>{
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
          item.insertText = name+'.';
          item.detail = 'Lua標準ライブラリ';
          item.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
          items.push(item);
        });

        let item = new vscode.CompletionItem('obj', vscode.CompletionItemKind.Variable);
        item.insertText='obj.';
        item.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
        items.push(item);

        return items;
      }},
      ''
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      {scheme:'file', language:'lua'},
      {provideCompletionItems(document,position) {
        const line = document.lineAt(position.line).text;
        const substring = line.substring(0, position.character);

        const match = substring.match(/(?<library>math|string|table)\.(?<typed>\w*)$/);
        if (!match) return null;
        const {library, typed} = match.groups;

        let candidates = [];
        if (library=='math') {
          candidates = [
            {label:'pi', kind: vscode.CompletionItemKind.Variable, preselect:true},
            {label:'huge', detail:'+∞', kind: vscode.CompletionItemKind.Variable},
            {label:'deg'},
            {label:'rad'},
            {label:'sin'},
            {label:'cos'},
            {label:'tan'},
            {label:'asin'},
            {label:'acos'},
            {label:'atan'},
            {label:'atan2', detail:'atan(y/x)'},
            {label:'sinh'},
            {label:'cosh'},
            {label:'tanh'},
            {label:'pow'},
            {label:'exp'},
            {label:'log'},
            {label:'sqrt'},
            {label:'ldexp', detail:'m * 2^e'},
            {label:'frexp', detail:'x = m * 2^e となる {m(0.5≦m<1), e(∉ℤ)} を返す'},
            {label:'abs'},
            {label:'ceil', detail:'小数点以下切り上げ'},
            {label:'floor', detail:'小数点以下切り捨て'},
            {label:'fmod', detail:'xをyで割った余り'},
            {label:'max'},
            {label:'min'},
            {label:'modf', detail:'xの整数部と小数部を返す'},
            {label:'random'},
            {label:'randomseed', detail:'乱数のシード値をxに設定する'},
          ];
        } else if (library=='string') {
          candidates = [
            {label:'byte'},
            {label:'char'},
            {label:'find'},
            {label:'format', preselect:true},
            {label:'match'},
            {label:'gmatch'},
            {label:'sub'},
            {label:'gsub'},
            {label:'len'},
            {label:'lower'},
            {label:'rep'},
            {label:'reverse'},
            {label:'upper'},
          ];
        } else if (library=='table') {
          candidates = [
            {label: 'insert', preselect:true},
            {label: 'concat'},
            {label: 'remove'},
            {label: 'sort'},
          ];
        }
        
        return candidates.map(dic=>{
          const item = new vscode.CompletionItem(`${library}.${dic.label}`, dic.kind||vscode.CompletionItemKind.Function);
          item.insertText = dic.label;
          item.filterText = dic.label;
          if (dic.detail) item.detail = dic.detail;
          if (dic.documentation) item.documentation = dic.documentation;
          if (dic.preselect) item.preselect=true;
          return item;
        });
      }},
      '.', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
      'v', 'w', 'x', 'y', 'z'
    )
  )

  // obj.変数名
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'lua' },
      { provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const text = line.substring(0, position.character);
        const typed = text.match(/obj\.(\w*)$/)?.[1];
        if (typed==undefined) return;

        const candidates = [
          {label:'ox', detail:'基準座標からの相対座標X'},
          {label:'oy', detail:'基準座標からの相対座標Y'},
          {label:'oz', detail:'基準座標からの相対座標Z'},
          {label:'rx', detail:'X軸回転角度（360.0で一回転）'},
          {label:'ry', detail:'Y軸回転角度（360.0で一回転）'},
          {label:'rz', detail:'Z軸回転角度（360.0で一回転）'},
          {label:'cx', detail:'中心の相対座標X'}, 
          {label:'cy', detail:'中心の相対座標Y'}, 
          {label:'cz', detail:'中心の相対座標Z'},
          {label:'sx', detail:'X座標の拡大率（1.0=等倍）'}, 
          {label:'sy', detail:'Y座標の拡大率（1.0=等倍）'}, 
          {label:'sz', detail:'Z座標の拡大率（1.0=等倍）'},
          {label:'zoom', detail:'拡大率（1.0=等倍）'},
          {label:'aspect', detail:'アスペクト比(-1.0～1.0)',documentation: 'プラス=横縮小 / マイナス=縦縮小'},
          {label:'alpha', detail:'不透明度(0.0～1.0)',documentation: '0.0=透明 / 1.0=不透明'},
          {label:'x', detail:'表示基準座標X',documentation: 'read only'}, 
          {label:'y', detail:'表示基準座標Y',documentation: 'read only'}, 
          {label:'z', detail:'表示基準座標Z',documentation: 'read only'},
          {label:'w', detail:'画像サイズW',documentation: 'read only'},
          {label:'h', detail:'画像サイズH',documentation: 'read only'},
          {label:'screen_w', detail:'スクリーンサイズW',documentation: 'read only'},
          {label:'screen_h', detail:'スクリーンサイズH',documentation: 'read only'},
          {label:'framerate', detail:'フレームレート',documentation: 'read only'},
          {label:'frame', detail:'オブジェクト基準での現在のフレーム番号',documentation: 'read only'},
          {label:'time', detail:'オブジェクト基準での現在の時間（秒）',documentation: 'read only'},
          {label:'totalframe', detail:'オブジェクトの総フレーム数', documentation: 'read only'},
          {label:'totaltime', detail:'オブジェクトの総時間（秒）', documentation: 'read only'},
          {label:'layer', detail:'オブジェクトが配置されているレイヤー', documentation: '※描画対象のオブジェクトのレイヤー位置\nread only'},
          {label:'index', detail:'複数オブジェクト時の番号', documentation: '※個別オブジェクト用\nread only'},
          {label:'num', detail:'複数オブジェクト時の数', documentation: '0=不定 / 1=単体オブジェクト\n※個別オブジェクト用\nread only'},
          {label:'id', detail:'オブジェクトのID', documentation: '※アプリ起動毎の固有ID\nread only'},
          {label:'effect_id', detail:'オブジェクトの内の対象エフェクトのID', documentation: '※アプリ起動毎の固有ID\n※処理対象のフィルタ効果、オブジェクト入出力の固有ID\nread only'},
        ];
        return candidates
          .map(dic => {
            const item = new vscode.CompletionItem(`obj.${dic.label}`, vscode.CompletionItemKind.Variable);
            item.insertText = dic.label;
            item.filterText = dic.label;
            item.detail = dic.detail;
            if(dic.documentation) item.documentation = dic.documentation;
            return item;
          });
      }},
      '.', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
      'v', 'w', 'x', 'y', 'z'
    )
  );

  // 設定項目
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'lua', scheme: 'file' },
      { provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const text = line.substring(0, position.character);

        if(!/--\w*$/.test(text)) return;

        const tags = [
          'track@',
          'check@',
          'color@',
          'file@',
          'font@',
          'figure@',
          'select@',
          'value@',
          'text@',
          'data@',
          'label:',
          'script:',
          'information:',
          'speed:',
          'param:',
        ];

        return tags.map(tag => {
          const item = new vscode.CompletionItem(`--${tag}`, vscode.CompletionItemKind.Snippet);
          item.insertText = `${tag}`;
          item.detail = 'AviUtl2 設定項目';
          return item;
        });
      }},
      '-'
    )
  );

  // シンボルの追加
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: 'lua', scheme: 'file' },
      { provideDocumentSymbols(document) {
        const symbols = [];

        let target = symbols;
        for (let i=0; i<document.lineCount; i++) {
          const line = document.lineAt(i).text;
          if (line.startsWith("@")) {
            // name, detail, kind, range, selectionRange
            const symbol = new vscode.DocumentSymbol(
              line.substring(1),
              null,
              vscode.SymbolKind.File,
              new vscode.Range(i,1, i,line.length),
              new vscode.Range(i,1, i,line.length)
            );
            symbols.push(symbol);
            target = symbol.children;

          } else if (/--.+@.+:/.test(line)) {
            let symbol;
            if (line.indexOf('--[[')==-1) {
              const {type, variable, name} = line.match(/--(?<type>.+)@(?<variable>.+):(?<name>[^,=]*)/).groups;
              const returnKind = (line,type) => {
                switch (type) {
                  case 'track':
                    return vscode.SymbolKind.Number;
                  case 'color':
                  case 'file':
                  case 'font':
                  case 'text':
                    return vscode.SymbolKind.String;
                  case 'check':
                    return /(true|false)$/.test(line) ? vscode.SymbolKind.Boolean : vscode.SymbolKind.Number;
                  case 'value':
                    return line.endsWith('}') ? vscode.SymbolKind.Array :
                           /\d$/.test(line) ? vscode.SymbolKind.Number : vscode.SymbolKind.String;
                  default :
                    return vscode.SymbolKind.Variable;
                }
              };
              symbol = new vscode.DocumentSymbol(
                variable,
                type + ' : ' + name,
                returnKind(line, type),
                new vscode.Range(i, type.length+3, i, type.length+variable.length+3),
                new vscode.Range(i, type.length+3, i, type.length+variable.length+3)
              );

            } else {
              const {type, name} = line.match(/--\[\[(?<type>.+)@(?<name>.+):/).groups;
              symbol = new vscode.DocumentSymbol(
                name,
                type,
                vscode.SymbolKind.Class,
                new vscode.Range(i, type.length+5, i, type.length+name.length+5),
                new vscode.Range(i, type.length+5, i, type.length+name.length+5)
              );
            }
            target.push(symbol);
          }
        }
        return symbols;
      }}
    )
  );
}

// info: {label, documentation?, parameters:[label, documentation]}
function sigHelpFromInfo(info, activeParameter) {
  if (!info) return null;

  const sigInfo = new vscode.SignatureInformation(info.label);
  sigInfo.parameters = info.parameters.map(p=>new vscode.ParameterInformation(p.label, p.documentation));
  if (info.documentation) sigInfo.documentation = info.documentation

  const sigHelp = new vscode.SignatureHelp();
  sigHelp.signatures = [sigInfo];
  sigHelp.activeSignature = 0;
  sigHelp.activeParameter = Math.min(activeParameter, info.parameters.length-1);
  return sigHelp;
}

function calculateActiveParameter(text) {
  const openParenIndex = text.indexOf('(');
  // const openParenIndex = text.lastIndexOf('(');
  if (openParenIndex === -1) return 0;

  const afterParen = text.substring(openParenIndex + 1);

  let commaCount = 0;
  let inString = false;
  let stringChar = '';
  let parenDepth = 0;
  let curlyDepth = 0;

  for (let i = 0; i < afterParen.length; i++) {
    const char = afterParen[i];

    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && afterParen[i - 1] !== '\\') {
      inString = false;
      stringChar = '';
    }

    if (!inString) {
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        parenDepth--;
      } else if (char === '{') {
        curlyDepth++;
      } else if (char === '}') {
        curlyDepth--;
      } else if (char === ',' && parenDepth === 0 && curlyDepth === 0) {
        commaCount++;
      }
    }
  }

  return commaCount;
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};