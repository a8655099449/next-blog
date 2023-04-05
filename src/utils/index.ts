import { globby } from "globby";
import { promises as fsp } from "fs";
import fm from "front-matter";
import p from "path";
import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import dayjs from "dayjs";

loadLanguages(["go", "typescript", "ts", "go-module", "go-mod"]);
function createRandomString(
  length = 8,
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const md = new MarkdownIt({
  html: true,
  highlight: (code, lang) => {
    const grammar = Prism.languages[lang] || Prism.languages.markup;

    const uuid = createRandomString();

    return `<button class="copy-btn" data-uid="${uuid}">复制</button>${Prism.highlight(
      code,
      grammar,
      lang
    )}<textarea  id="${uuid}" style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" >${code}</textarea>`;
  },
});

// md.options.highlight = (code, lang) => {
//   const grammar = Prism.languages[lang] || Prism.languages.markup;
//   return Prism.highlight(code, grammar, lang);
// },

// md.use(htmlEntities, {
//   isDisabledOnFencedCodeBlocks: true,
//   isDisabledOnInlineCode: true,
// });

function absPath(dir: string) {
  return p.isAbsolute(dir) ? dir : p.resolve(process.cwd(), dir);
}

/**
 * @name 读取所有的md文件Path
 */
export const readPostListPath = async () => {
  const files2 = await globby(["docs/**/*.md"], {});
  return files2.map((s) => s.replace(".md", ""));
};

const parseHtmlContent = (content: string) => {
  // const reg = /:::(.*?)\s?\n([\s\S]*?)\n:::/g;

  // const reg2 = /```(.*?)\n([\s\S]*?)\n```/g;

  // let _content = content?.replace(reg, `<div class="$1">\n$2\n</div>`);

  return content;
};

/**
 * @name 根据路径读取MD的内容
 */
export const readMdContent = async (path: string) => {
  const _path = p.join(absPath(""), path + ".md");
  const data = await fsp.readFile(
    _path.replace(`\\docs\\docs`, "\\docs").replace(`/docs/docs/`, "/docs/"),
    "utf8"
  );
  const matter = fm(data) as any;
  const html = md.render(parseHtmlContent(matter.body));
  // const html = (await remark().use(remarkHtml).process(matter.body)).toString();
  matter.attributes.date = dayjs(matter.attributes.date).valueOf();
  return {
    html,
    ...matter.attributes,
    path,
  } as postItem;
};
/**
 * @name 根据路径读取MD的内容
 */
export const readAllMdContent = async () =>
  Promise.all((await readPostListPath()).map((path) => readMdContent(path)));
