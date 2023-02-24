---
title: 在web中如何导出word文件
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
---

# 在web中如何导出word文件


最近在开发中接到了一个客户的需求，就是需要在一个富文本中编辑一些内容，然后导出成word来使用。

这种玩意也太简单了，不吹不黑，我大概**3分钟**就能完成这个需求。 于是就开始搞出了第一版，并且自信满满的交付了。 

后面的事情的进展并没有如我所愿，主要是客户又提出一些怪需求，今天就来说说我最近对于这方面的研究。


## 在html中如何导出word文件？ 3分钟的解决方案

我们如果要使用dom转换为word ， 如果只是普通的需求，那么有个库[html-docx-js](https://github.com/evidenceprime/html-docx-js)可以解决这个问题，这也是我之前为什么说3分钟可以搞定


**使用方法**

下载依赖 `npm i 'html-docx-js` ,然后直接封装成一个通用方法

```javascript
import { saveAs } from 'file-saver';
//
import htmlDocx from 'html-docx-js/dist/html-docx';
/**
 * @param {} dom 局部的html页面
 * @param {*} fileName 导出文件的名称
 * @param {*} title
 */
const exportDocx = (dom, fileName, config = {}, { title = document.title, width } = {}) => {
  if (!dom) return;
  let copyDom = document.createElement('span');
  // const styleDom = document.querySelectorAll('style, link, meta')
  const titleDom = document.createElement('title');
  titleDom.innerText = title;

  copyDom.appendChild(titleDom);
  // Array.from(styleDom).forEach(item => {
  //   copyDom.appendChild(item.cloneNode(true))
  // })
  const cloneDom = dom.cloneNode(true);
  if (width) {
    const domTables = cloneDom.getElementsByTagName('table');
    if (domTables.length) {
      for (const table of domTables) {
        table.style.width = width + 'px';
      }
    }
  }
  copyDom.appendChild(cloneDom);

  const htmlTemp = copyDom.innerHTML;
  copyDom = null;
  // console.log('htmlTemp=', htmlTemp)
  const iframeDom = document.createElement('iframe');
  const attrObj = {
    height: 0,
    width: 0,
    border: 0,
    wmode: 'Opaque',
  };
  const styleObj = {
    position: 'absolute',
    top: '-999px',
    left: '-999px',
  };
  Object.entries(attrObj).forEach(([key, value]) => {
    iframeDom.setAttribute(key, value);
  });
  Object.entries(styleObj).forEach(([key, value]) => {
    iframeDom.style[key] = value;
  });
  document.body.insertBefore(iframeDom, document.body.children[0]);
  const iframeWin = iframeDom.contentWindow; // 1.获取iframe中的window
  const iframeDocs = iframeWin.document; // 2.获取iframe中的document
  iframeDocs.write(`<!doctype html>`);
  iframeDocs.write(htmlTemp);

  const htmlDoc = `
  <!DOCTYPE html>
  <html lang="en">
  ${iframeDocs.documentElement.innerHTML}
  </html>
  `;

  var converted = htmlDocx.asBlob(htmlDoc, config);
  saveAs(converted, fileName + '.docx');
  document.body.removeChild(iframeDom);
};

export default exportDocx
```

这个方案轻松是轻松，但是也有很大的缺陷

1. 这个库上次更新前已经是6年前了，已经没有了维护
2. 这个库的扩展性不好，支持的参数不多，比如你要配置个性的页眉和页脚 ， 就无法实现。

后面卡住我的也是这个问题，客户一定要求要个页脚，而且必须要跟他所描述的样式长得一样。

大概是一条上边框，然后左边标题，右边当前页数这样。

然后我就开始翻阅文档了，想想在`html-docx-js`这个库上面能不能抢救一下。然后找到一个以前的版本，可以支持页脚和页眉，但并不能完美解决问题，如果想了解的，可以看看[这个仓库](https://github.com/forever-chen/html-docx)


## 解决页脚和页面的问题

真正解决页脚和页面的问题是看到了[这篇帖子 - HTML generated Microsoft Word document with header, footer and watermark](https://stackoverflow.com/questions/13340216/html-generated-microsoft-word-document-with-header-footer-and-watermark)。


大概的意思是，只需要把html的格式改一改，然后再保存成`.doc`后缀的文件，就可以在wps或者office的文件显示了

不废话，直接上我魔改之后的封装代码
```javascript
import { saveAs } from 'file-saver';
export const html2docx = ({
  content = '',
  head = '',
  height = '29.7cm',
  width = `21cm`,
  fileName = `file-${Date.now()}.docx`,
  showHead = false,
  justGetContent=false
}) => {
  let headContent = ''
  if (head && showHead) {
    headContent = ` <div style='mso-element:header' id=h1 >
    <!-- HEADER-tags -->
        <p class=MsoHeader style="text-align:center;color:#000;border-bottom:1px solid #000;" >
           ${head}
          </p>
    <!-- end HEADER-tags -->
    </div>`
  }
  if (typeof content !== 'string' && content.innerHTMl) {

    content = content.innerHTML
  }
  const pageContent = `<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title></title>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
w\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<style>
@page
{
    size:${width} ${height};     
    margin:3cm 2cm 2cm 2cm;
  
}

@page Section1 {
    mso-header-margin:1.5cm;
    mso-footer-margin:1.75cm;
    mso-header: h1;
    mso-footer: f1;
    mso-page-numbers:1;
}
@page FooterBox{
  
}
div.Section1 { page:Section1; }
div.MsoFooter { page:FooterBox; }
*{

}
table#hrdftrtbl
{
    margin:0in 0in 0in 900in;
    width:1px;
    height:1px;
    overflow:hidden;
}


.word-page-bottom-wrap {
  border-top: 1px solid #000;
  text-align: justify;
}
</style>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>

<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->

</head>

<body>
<div class="Section1">
    
    <table id='hrdftrtbl' border='0' cellspacing='0' cellpadding='0'>
    <tr>
      <td>      
      ${headContent}
      </td>
      <td >
          <div style='mso-element:footer' id=f1><span style='position:relative;z-index:-1;'> 
                  <div class=MsoFooter  >
                    <hr size=2  width="100%" align=center />
                    <div  style="text-align:justify;text-justify:distribute-all-lines;mso-pagination:none;" >
                      <span style="font-size:12px;font-family: 黑体;">
                      ${head}  
                      </span>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                      <span style="font-size:12px;font-family: 黑体;">
                        共<span style='mso-field-code: NUMPAGES'></span>页
                        第<span style="mso-field-code: PAGE "></span>页
                      </span>
                    </div>
                </div>
          </div>
       
        </td>
    </tr>
    </table>
</div>
${content}
</body></html>`
  if (justGetContent) {
    return content
  }
  var blob = new Blob([pageContent], {
    type: "application/doc;charset=utf-8"
  });
  // downloadFile(fileName, blob)
  saveAs(blob, `${fileName}.doc`);
}
```

亲测在wps 或者office中都能使用，讲讲在这中间遇到的一些问题和我所使用的解决方案

## 遇到的问题
### 1. 行高的问题

在上面版本的导出中，我发现文字的行高属性开始不生效了，比如`style="line-height:1.5;"` 这样的属性。

**解决方法：** 使用`150%`代替`1.5`这样 ， 比如原来是`style="line-height:1.5;"` 替换成 `style="line-height:150%;"`

 
### 2. 段落尾部自带一些边距的问题

众所周知，在html中像`h1` 、 `p` 这种标签，都自带一些边距，使用`*{ margin : 0 }` 这种方法在word中失效了。


**解决方法：** ，在所有style的属性中，使用正则加上`margin : 0;`的属性


### 3. 缩进问题，孤行控制问题

在word中，原本两个字节的缩进，会显示成不足两字节，看起来就有点怪，

**解决方法：**  使用正则将`text-indent: 2em;`替换成 `text-indent: 2.3em;`

孤行控制是word中的一个属性，使用孤行控制后，再office中会出现选中的怪异操作，

**解决方法：**  使用正则在所有的style标签中增加`mso-pagination:none;`属性


```javascript
const content = html.current.innerHTML
.replace(/line-height: 150%;/gis, `line-height: 150%;margin:0;`)
.replace(/text-indent: 2em;/gis, `text-indent: 2.3em;`)
.replace(/style="/gis, `style="mso-pagination:none;`)
```

### 4. 在页脚中的两边对齐问题
![](//image.woai996.com/picgo/20220616140850.png)

客户需求将页脚的内容如上图那样，需要左右两端对齐，但在word支持的样式中，并没有这种属性，要么就是左对齐，要么就是右对齐 ， 至于其他的什么`float`或者`flex`在word中根本不支持这种属性。

用table这种标签，倒是可以把内容分开在两端，但是在word中表格的边框无法使用样式取消，所以还是不行

我第一个版本使用的是空格将其隔开，看起来就像是在两边一样，但这种不完美，无法很好的控制在两边。

后面我找到了`text-align:justify;text-justify:distribute-all-lines;`这个属性，可以让文字分两端对齐，也算是解决这个问题了 ， 也可能word中存在这种属性，只是我不知道。



### 5. 在word中编辑，每次保存的时候，都会转回为web模式

在head的标签中加入加入这段代码

> 在上面代码中我已经加入这段了 ，所以其实可以不用管这个


```
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->
```


## 最后
最终客户算是心满意足了（不满足也没办法） ， 这个需求也算是过去了，3分钟的问题，我翻了几十篇文档，尝试了好几个库，最终还是使用自己的方案解决了。

将dom转换为word在前端中，目前还是没有很好使用的库，上面的两种方案也仅仅是可用，但不完美，而且优化的空间也有限。
