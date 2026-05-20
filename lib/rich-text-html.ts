export const PREVIEW_HTML = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { box-sizing: border-box; }
  body {
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    overflow: hidden;
    padding: 0;
  }
  p, ul, ol { margin: 0 0 8px 0; }
  ul, ol { padding-left: 20px; }
  b, strong { font-weight: 700; }
  i, em { font-style: italic; }
</style>
</head>
<body>${content || '<p style="color:#9ca3af;font-style:italic;">Sin contenido</p>'}</body>
</html>
`;

export const EDITOR_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { box-sizing: border-box; }
  body {
    background: #fff;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 12px;
  }
  #toolbar {
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
  .btn {
    -webkit-tap-highlight-color: transparent;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 14px;
  }
  .btn:active { background: #e5e7eb; }
  #editor {
    color: #111827;
    font-size: 16px;
    line-height: 1.6;
    min-height: 300px;
    outline: none;
  }
  #editor p { margin: 0 0 12px 0; }
  #editor ul, #editor ol { margin: 0 0 12px 0; padding-left: 24px; }
  #editor li { margin-bottom: 4px; }
</style>
</head>
<body>
  <div id="toolbar">
    <button class="btn" data-cmd="bold" type="button"><b>B</b></button>
    <button class="btn" data-cmd="italic" type="button"><i>I</i></button>
    <button class="btn" data-cmd="insertUnorderedList" type="button">&bull; Lista</button>
    <button class="btn" data-cmd="insertOrderedList" type="button">1. Lista</button>
  </div>
  <div id="editor" contenteditable="true"></div>
  <script>
    const editor = document.getElementById('editor');
    document.getElementById('toolbar').addEventListener('click', function(e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      e.preventDefault();
      document.execCommand(btn.dataset.cmd, false, null);
      editor.focus();
    });

    function setInitialContent(html) { editor.innerHTML = html || '<p><br></p>'; }
    function getContent() {
      var html = editor.innerHTML;
      if (html === '<p><br></p>' || html === '<div><br></div>' || html === '<br>') return '';
      return html;
    }
    function post(msg) { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); }

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'setContent') setInitialContent(e.data.html);
      if (e.data && e.data.type === 'getContent') post({ type: 'content', html: getContent() });
    });
    post({ type: 'ready' });
  </script>
</body>
</html>
`;
