---
title: 日常开发中常使用的js片段
description: 文章描述
aside: false
date: 2023-02-07
tags:
	- javascript
---

# 日常开发中常使用的js片段

## 通过一个链接下载文件
```ts
export function download(link: string, name: string) {
  if (!name) {
    name = link.slice(link.lastIndexOf('/') + 1);
  }
  let eleLink = document.createElement('a');
  eleLink.download = name;
  eleLink.style.display = 'none';
  eleLink.href = link;
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}
```

## 图片链接转换为base64

```js
function image2base64(url) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = url;
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const mime = img.src
        .substring(img.src.lastIndexOf('.') + 1)
        .toLowerCase();

      const dataUrl = canvas.toDataURL('image/' + mime);
      resolve(dataUrl);
    });
    img.addEventListener('error', reject);
  });
}
```


## 下载一个图片链接
> 不能使用第一种方法 ，在谷歌浏览器下载后会直接在当前页面打开，先转换为base64在下载后就可以直接下载为文件
```js
async function downloadImgLink(link) {
  const base64 = await image2base64(link)
  download(base64, `xx.png`)
}

// 示例
downloadImgLink('https://pic2.zhimg.com/80/v2-3c97a28d50adae207cc95f0f96361894_720w.jpg?source=1940ef5c')
```


## 下载某些自定义的内容
> 这个下载指的是前端自定义的一些内容 比如一个json文件啥的，不依赖服务器

:::details
```js
export function downloadFile(name, content) {
  if (typeof name == 'undefined') {
    throw new Error('The first parameter name is a must');
  }
  if (typeof content == 'undefined') {
    throw new Error('The second parameter content is a must');
  }
  if (!(content instanceof Blob)) {
    if (typeof content !== 'string') {
      content = JSON.stringify(content, null, 2);
    }
    content = new Blob([content]);
  }
  const link = URL.createObjectURL(content);
  download(link, name);
}

// 使用示例

downloadFile(`test.json`, {
  a: 1,
  b: 2
})

```
:::

## 复制某个字符串

```js
export function copy2Clipboard(text) {
	// navigator clipboard 需要https等安全上下文
	if (navigator.clipboard && window.isSecureContext) {
		// navigator clipboard 向剪贴板写文本
		return navigator.clipboard.writeText(text)
	} else {
		// 创建text area
		let textArea = document.createElement('textarea')
		textArea.value = text
		// 使text area不在viewport，同时设置不可见
		textArea.style.position = 'absolute'
		textArea.style.left = '-999999px'
		textArea.style.top = '-999999px'
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		return new Promise<void>((res, rej) => {
			// 执行复制命令并移除文本框
			document.execCommand('copy') ? res() : rej()
			textArea.remove()
			document.body.removeChild(textArea)
		})
	}
}
```



## 延迟多少秒
```js
function wait(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## 生成随机字符串


```js
function createRandomString(length=8, chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  let result = ''
  for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
```

## 前端随机生成uuid

:::details
```js
export function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
```
:::


## 在整个字符串中加粗特定字符


```js
const boldKeyword = (keyword, str) => {
  let rex = new RegExp(keyword, 'is');
  return str.replace(rex, `<b>$&</b>`);
};
```

## 将时间转换为特定格式


```js
export const formatTime = (date, fmt) => {
  if (!date) return 'is not time';
  // 判断date是不是时间戳
  if (typeof date == 'number') {
    date = new Date(date);
  }
  //获取年份
  if (/(y+)/.test(fmt)) {
    let dateY = date.getFullYear() + '';
    //RegExp.$1 在判断中出现过，且是括号括起来的，所以 RegExp.$1 就是 "yyyy"
    fmt = fmt.replace(RegExp.$1, dateY.substr(4 - RegExp.$1.length));
  }

  //获取其他
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? str : ('00' + str).substr(str.length),
        //
      );
    }
  }
  return fmt;
};
      
// 使用示例
console.log(formatTime(Date.now(), 'yyyy-MM-dd hh:mm:ss'))
```


## 图片进行压缩

:::details

```ts
type CompressImg = {
  afterKB?: number;
  beforeKB?: number;
  afterSrc?: string;
  beforeSrc?: string;
  file?: File;
  origin?: File;
};


//  传入文件对象 和 压缩比例 其中 0.2 为最佳压缩比例
function compressImg(file: File, quality: number): Promise<CompressImg> {
  let qualitys = quality || 0.2;
  if (Array.isArray(file)) {
    // @ts-ignore
    return Promise.all(
      // @ts-ignore
      Array.from(file).map((e) => compressImg(e, qualitys))
    ); // 如果是 file 数组返回 Promise 数组
  }


  return new Promise((resolve) => {
    const reader = new FileReader(); // 创建 FileReader
    reader.onload = ({ target: { result: src } }) => {
      const image = new Image(); // 创建 img 元素
      image.onload = async () => {
        const canvas = document.createElement("canvas"); // 创建 canvas 元素
        const context = canvas.getContext("2d");
        var targetWidth = image.width;
        var targetHeight = image.height;
        var originWidth = image.width;
        var originHeight = image.height;

        const sizeKb = parseInt((file.size / 1024).toFixed(2));
        //  1m ~ 10m
        if (1 * 1024 <= sizeKb && sizeKb <= 10 * 1024) {
          var maxWidth = 1600;
          var maxHeight = 1600;
          targetWidth = originWidth;
          targetHeight = originHeight;
          // 图片尺寸超过的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(
                maxWidth * (originHeight / originWidth)
              );
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(
                maxHeight * (originWidth / originHeight)
              );
            }
          }
        }
        // >10m
        if (10 * 1024 <= sizeKb && sizeKb <= 20 * 1024) {
          maxWidth = 1400;
          maxHeight = 1400;
          targetWidth = originWidth;
          targetHeight = originHeight;
          // 图片尺寸超过的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(
                maxWidth * (originHeight / originWidth)
              );
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(
                maxHeight * (originWidth / originHeight)
              );
            }
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(image, 0, 0, targetWidth, targetHeight); // 绘制 canvas
        const canvasURL = canvas.toDataURL(`image/jpeg`, qualitys);
        const buffer = atob(canvasURL.split(",")[1]);
        let length = buffer.length;
        const bufferArray = new Uint8Array(new ArrayBuffer(length));
        while (length--) {
          bufferArray[length] = buffer.charCodeAt(length);
        }
        const miniFile = new File([bufferArray], file.name, {
          type: `image/jpeg`,
        });

        resolve({
          file: miniFile,
          origin: file,
          // @ts-ignore
          beforeSrc: src,
          afterSrc: canvasURL,
          beforeKB: Number((file.size / 1024).toFixed(2)),
          afterKB: Number((miniFile.size / 1024).toFixed(2)),
        });
      };
      // @ts-ignore
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
}
```

:::





## 前端调用浏览器打印


:::details
```js
export const printWithBrowser = ({
	bodyClass = '',
	content = document.body,
	copyStyles = true,
	fonts = false,
	pageStyle = '@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }',
	nonce = null,
	onAfter = () => {},
} = {}) =>
	new Promise((resolve, reject) => {
		{
			const contentEl = content

			const logMessages = (messages, level = 'error') => {
				if (level === 'error') {
					console.error(messages) // eslint-disable-line no-console
				} else if (level === 'warning') {
					console.warn(messages) // eslint-disable-line no-console
				}
				reject(messages)
			}

			if (contentEl === undefined) {
				logMessages([
					'To print a functional component ensure it is wrapped with `React.forwardRef`, and ensure the forwarded ref is used. See the README for an example: https://github.com/gregnb/react-to-print#examples',
				]) // eslint-disable-line max-len
				return
			}

			if (contentEl === null) {
				logMessages(['There is nothing to print because the "content" prop returned "null". Please ensure "content" is renderable before allowing "react-to-print" to be called.']) // eslint-disable-line max-len
				return
			}

			const printWindow = document.createElement('iframe')
			printWindow.style.position = 'absolute'
			printWindow.style.top = '-1000px'
			printWindow.style.left = '-1000px'
			printWindow.id = 'printWindow'
			// Ensure we set a DOCTYPE on the iframe's document
			// https://github.com/gregnb/react-to-print/issues/459
			printWindow.srcdoc = '<!DOCTYPE html>'
			const contentNodes = contentEl.cloneNode(true)
			const clonedContentNodes = contentNodes.cloneNode(true)
			const isText = clonedContentNodes instanceof Text

			const globalStyleLinkNodes = document.querySelectorAll("link[rel='stylesheet']")
			const renderComponentImgNodes = isText ? [] : clonedContentNodes.querySelectorAll('img')
			const renderComponentVideoNodes = isText ? [] : clonedContentNodes.querySelectorAll('video')

			let linkTotal = globalStyleLinkNodes.length + renderComponentImgNodes.length + renderComponentVideoNodes.length
			let linksLoaded = []
			let linksErrored = []
			let fontsLoaded = []
			let fontsErrored = []
			const triggerPrint = target => {
				startPrint(target)
			}
			const startPrint = target => {
				setTimeout(() => {
					target.contentWindow.print()
					resolve()
					onAfter()
				}, 100)
			}
			const markLoaded = (linkNode, loaded) => {
				if (loaded) {
					linksLoaded.push(linkNode)
				} else {
					logMessages([
						'"react-to-print" was unable to load a linked node. It may be invalid. "react-to-print" will continue attempting to print the page. The linked node that errored was:',
						linkNode,
					]) // eslint-disable-line max-len
					linksErrored.push(linkNode)
				}

				// We may have errors, but attempt to print anyways - maybe they are trivial and the
				// user will be ok ignoring them
				const numResourcesManaged = linksLoaded.length + linksErrored.length + fontsLoaded.length + fontsErrored.length

				if (numResourcesManaged === linkTotal) {
					triggerPrint(printWindow)
				}
			}

			printWindow.onload = () => {
				// Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
				// `onload` callback. This ensures that it is only called once.
				printWindow.onload = null

				const domDoc = printWindow.contentDocument || printWindow.contentWindow?.document

				if (domDoc) {
					domDoc.body.appendChild(clonedContentNodes)

					if (fonts) {
						// @ts-ignore
						if (printWindow.contentDocument?.fonts && printWindow.contentWindow?.FontFace) {
							fonts.forEach(font => {
								const fontFace = new FontFace(font.family, font.source)
								printWindow.contentDocument.fonts.add(fontFace)
								fontFace.loaded
									.then(loadedFontFace => {
										fontsLoaded.push(loadedFontFace)
									})
									.catch(error => {
										fontsErrored.push(fontFace)
										logMessages([
											'"react-to-print" was unable to load a font. "react-to-print" will continue attempting to print the page. The font that failed to load is:',
											fontFace,
											'The error from loading the font is:',
											error,
										]) // eslint-disable-line max-len
									})
							})
						} else {
							logMessages(['"react-to-print" is not able to load custom fonts because the browser does not support the FontFace API']) // eslint-disable-line max-len
						}
					}

					const defaultPageStyle = typeof pageStyle === 'function' ? pageStyle() : pageStyle

					if (typeof defaultPageStyle !== 'string') {
						logMessages([`"react-to-print" expected a "string" from \`pageStyle\` but received "${typeof defaultPageStyle}". Styles from \`pageStyle\` will not be applied.`]) // eslint-disable-line max-len
					} else {
						const styleEl = domDoc.createElement('style')
						if (nonce) {
							styleEl.setAttribute('nonce', nonce)
							domDoc.head.setAttribute('nonce', nonce)
						}
						styleEl.appendChild(domDoc.createTextNode(defaultPageStyle))
						domDoc.head.appendChild(styleEl)
					}

					if (bodyClass) {
						domDoc.body.classList.add(...bodyClass.split(' '))
					}

					if (!isText) {
						// Copy canvases
						// NOTE: must use data from `contentNodes` here as the canvass elements in
						// `clonedContentNodes` will not have been redrawn properly yet
						const srcCanvasEls = isText ? [] : contentNodes.querySelectorAll('canvas')
						const targetCanvasEls = domDoc.querySelectorAll('canvas')

						for (let i = 0; i < srcCanvasEls.length; ++i) {
							const sourceCanvas = srcCanvasEls[i]

							const targetCanvas = targetCanvasEls[i]
							const targetCanvasContext = targetCanvas.getContext('2d')

							if (targetCanvasContext) {
								targetCanvasContext.drawImage(sourceCanvas, 0, 0)
							}
						}

						// Pre-load images
						for (let i = 0; i < renderComponentImgNodes.length; i++) {
							const imgNode = renderComponentImgNodes[i]
							const imgSrc = imgNode.getAttribute('src')

							if (!imgSrc) {
								logMessages(['"react-to-print" encountered an <img> tag with an empty "src" attribute. It will not attempt to pre-load it. The <img> is:', imgNode], 'warning') // eslint-disable-line
								markLoaded(imgNode, false)
							} else {
								// https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
								const img = new Image()
								img.onload = markLoaded.bind(null, imgNode, true)
								img.onerror = markLoaded.bind(null, imgNode, false)
								img.src = imgSrc
							}
						}

						// Pre-load videos
						for (let i = 0; i < renderComponentVideoNodes.length; i++) {
							const videoNode = renderComponentVideoNodes[i]
							videoNode.preload = 'auto' // Hint to the browser that it should load this resource

							const videoPoster = videoNode.getAttribute('poster')
							if (videoPoster) {
								// If the video has a poster, pre-load the poster image
								// https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
								const img = new Image()
								img.onload = markLoaded.bind(null, videoNode, true)
								img.onerror = markLoaded.bind(null, videoNode, false)
								img.src = videoPoster
							} else {
								if (videoNode.readyState >= 2) {
									// Check if the video has already loaded a frame
									markLoaded(videoNode, true)
								} else {
									videoNode.onloadeddata = markLoaded.bind(null, videoNode, true)

									// TODO: if one if these is called is it possible for another to be called? If so we
									// need to add guards to ensure `markLoaded` is only called once for the node
									// TODO: why do `onabort` and `onstalled` seem to fire all the time even if
									// there is no issue?
									// videoNode.onabort = () => { console.log('Video with no poster abort'); markLoaded.bind(null, videoNode, false)(); }
									videoNode.onerror = markLoaded.bind(null, videoNode, false)
									// videoNode.onemptied = () => { console.log('Video with no poster emptied'); markLoaded.bind(null, videoNode, false)(); }
									videoNode.onstalled = markLoaded.bind(null, videoNode, false)
								}
							}
						}

						// Copy input values
						// This covers most input types, though some need additional work (further down)
						const inputSelector = 'input'
						const originalInputs = contentNodes.querySelectorAll(inputSelector) // eslint-disable-line max-len
						const copiedInputs = domDoc.querySelectorAll(inputSelector)
						for (let i = 0; i < originalInputs.length; i++) {
							copiedInputs[i].value = originalInputs[i].value
						}

						// Copy checkbox, radio checks
						const checkedSelector = 'input[type=checkbox],input[type=radio]'
						const originalCRs = contentNodes.querySelectorAll(checkedSelector) // eslint-disable-line max-len
						const copiedCRs = domDoc.querySelectorAll(checkedSelector)
						for (let i = 0; i < originalCRs.length; i++) {
							copiedCRs[i].checked = originalCRs[i].checked
						}

						// Copy select states
						const selectSelector = 'select'
						const originalSelects = contentNodes.querySelectorAll(selectSelector) // eslint-disable-line max-len
						const copiedSelects = domDoc.querySelectorAll(selectSelector)
						for (let i = 0; i < originalSelects.length; i++) {
							copiedSelects[i].value = originalSelects[i].value
						}
					}

					if (copyStyles) {
						const headEls = document.querySelectorAll("style, link[rel='stylesheet']")
						for (let i = 0, headElsLen = headEls.length; i < headElsLen; ++i) {
							const node = headEls[i]
							if (node.tagName === 'STYLE') {
								// <style> nodes
								const newHeadEl = domDoc.createElement(node.tagName)
								const sheet = node.sheet
								if (sheet) {
									let styleCSS = ''
									// NOTE: for-of is not supported by IE
									try {
										// Accessing `sheet.cssRules` on cross-origin sheets can throw
										// security exceptions in some browsers, notably Firefox
										// https://github.com/gregnb/react-to-print/issues/429
										const cssLength = sheet.cssRules.length
										for (let j = 0; j < cssLength; ++j) {
											if (typeof sheet.cssRules[j].cssText === 'string') {
												styleCSS += `${sheet.cssRules[j].cssText}\r\n`
											}
										}
									} catch (error) {
										logMessages(
											[
												`A stylesheet could not be accessed. This is likely due to the stylesheet having cross-origin imports, and many browsers block script access to cross-origin stylesheets. See https://github.com/gregnb/react-to-print/issues/429 for details. You may be able to load the sheet by both marking the stylesheet with the cross \`crossorigin\` attribute, and setting the \`Access-Control-Allow-Origin\` header on the server serving the stylesheet. Alternatively, host the stylesheet on your domain to avoid this issue entirely.`,
												node,
											],
											'warning'
										)
									}

									newHeadEl.setAttribute('id', `react-to-print-${i}`)
									if (nonce) {
										newHeadEl.setAttribute('nonce', nonce)
									}
									newHeadEl.appendChild(domDoc.createTextNode(styleCSS))
									domDoc.head.appendChild(newHeadEl)
								}
							} else {
								// <link> nodes, and any others
								// Many browsers will do all sorts of weird things if they encounter an
								// empty `href` tag (which is invalid HTML). Some will attempt to load
								// the current page. Some will attempt to load the page"s parent
								// directory. These problems can cause `react-to-print` to stop without
								// any error being thrown. To avoid such problems we simply do not
								// attempt to load these links.
								if (node.getAttribute('href')) {
									const newHeadEl = domDoc.createElement(node.tagName)

									// Manually re-create the node
									// TODO: document why cloning the node won't work? I don't recall
									// the reasoning behind why we do it this way
									// NOTE: node.attributes has NamedNodeMap type that is not an Array
									// and can be iterated only via direct [i] access
									for (let j = 0, attrLen = node.attributes.length; j < attrLen; ++j) {
										// eslint-disable-line max-len
										const attr = node.attributes[j]
										if (attr) {
											newHeadEl.setAttribute(attr.nodeName, attr.nodeValue || '')
										}
									}

									newHeadEl.onload = markLoaded.bind(null, newHeadEl, true)
									newHeadEl.onerror = markLoaded.bind(null, newHeadEl, false)
									if (nonce) {
										newHeadEl.setAttribute('nonce', nonce)
									}
									domDoc.head.appendChild(newHeadEl)
								} else {
									logMessages(
										[
											'"react-to-print" encountered a <link> tag with an empty "href" attribute. In addition to being invalid HTML, this can cause problems in many browsers, and so the <link> was not loaded. The <link> is:',
											node,
										],
										'warning'
									)
									// `true` because we"ve already shown a warning for this
									markLoaded(node, true)
								}
							}
						}
					}
				}

				if (linkTotal === 0 || !copyStyles) {
					triggerPrint(printWindow)
				}
			}
			const handleRemoveIframe = force => {
				if (force) {
					// The user may have removed the iframe in `onAfterPrint`
					const documentPrintWindow = document.getElementById('printWindow')
					if (documentPrintWindow) {
						document.body.removeChild(documentPrintWindow)
					}
				}
			}

			handleRemoveIframe(true)
			document.body.appendChild(printWindow)
		}
	})
```


:::

## await-to-js

一种优雅的捕捉异步函数错误的方式

代码直接借鉴了这个库[await-to-js](https://github.com/scopsy/await-to-js)

```ts
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error> (
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}
export default to;

//使用示例
const [err,res] = await to(request())

// 当err有值的时候，说明异步函数报错了
```

## 前端导出word

[在web中如何导出word文件](./html2doc.md)


## 判断是否为json字符串

```js
export const isJSON = (s: string) => {
  try {
    JSON.parse(s);
    return true
  } catch (error) {
    return false
  }
};
```


## 在ts中，导入其他类型文件保存如何解决？


在某个`.d.ts`的文件中声明

```ts
declare module '*.hdr' {
  const src: string;
  export default src;
}
```

