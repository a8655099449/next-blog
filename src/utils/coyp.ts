export function copy2Clipboard(text: string) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(text);
  } else {
    // 创建text area
    let textArea = document.createElement("textarea");
    textArea.value = text;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
      document.body.removeChild(textArea);
    });
  }
}
