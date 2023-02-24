import { globby } from "globby";
import { promises as fsp } from "fs";
import fm from "front-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import p from "path";

import dayjs from "dayjs";
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

/**
 * @name 根据路径读取MD的内容
 */
export const readMdContent = async (path: string) => {
  const _path = p.join(absPath(""), path + ".md");
  const data = await fsp.readFile(
    _path.replace(`\\docs\\docs`, "\\docs").replace(`/docs/docs/`,'/docs/'),
    "utf8"
  );
  const matter = fm(data) as any;
  const html = (await remark().use(remarkHtml).process(matter.body)).toString();
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
