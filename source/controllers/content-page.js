import getExistingContent from "../utilities/get-existing-content.js";
import getComponent from "../utilities/get-component.js";
import replaceWithMap from "../utilities/replace-with-map.js";
import { localStorageKey } from "../configs/main.js";
import prolangsConfig from "../configs/prolangs.js";

export default new (class {
  run(app) {
    const existingContent = getExistingContent();
    const languages = Object.keys(existingContent);
    for (const lang of languages)
      for (const contentKey of existingContent[lang]) this.renderContent(app, contentKey, lang);
  }

  async renderContent(app, contentKey, lang) {
    const textData = {
      content: (await import(`../data/texts/${lang}/${contentKey}.c.js`)).default,
      general: (await import(`../data/texts/${lang}/contents.js`)).default,
    };
    const staticData = (await import(`../data/static-contents/${contentKey}.js`)).default;
    const data = {
      lang: lang,
      contentKey,
      ...textData.content.self,
      ...textData.general,
      config: this.getConfig(contentKey),
      Header: await this.getHeader(lang),
      InfoContents: await this.getInfoBoxContents(textData.content.children),
      ContentValues: await this.getControlBarContentValues(textData.content.children),
      ContentOptions: await this.getControlBarContentOptions(textData.content.children),
      MainCodes: await this.getMainCodes(staticData.codes, textData.content.children),
      UsageCodes: await this.getUsageCodes(staticData.codes),
      CopyCodeBtn: await this.getCopyCodeBtn(textData.general.copyCode),
      Prolangs: await this.getProlangs(staticData.codes),
    };
    app.get(`/${lang}/c/${contentKey}`, (req, res) => res.render("contents", data));
  }

  async getHeader(lang) {
    const textData = (await import(`../data/texts/${lang}/header.js`)).default;
    const data = {
      lang: lang,
      ...textData,
      HeaderRight: "",
    };
    return await getComponent("header", data);
  }

  getConfig(contentKey) {
    const config = {
      localStorageKey: localStorageKey,
      contentKey: contentKey,
    };
    return JSON.stringify(config);
  }

  async getInfoBoxContents(textData) {
    const keys = Object.keys(textData);
    const replaceMap = {
      "\n": "<br>",
      "\t": "&nbsp;&nbsp;&nbsp;&nbsp;",
    };
    const getContents = async (infos) => {
      const result = [];
      const headings = Object.keys(infos);
      for (const heading of headings) {
        const data = {
          heading: heading,
          content: replaceWithMap(infos[heading], replaceMap),
        };
        result.push(await getComponent("content/info-box/content-section", data));
      }
      return result.join("");
    };
    const result = [];
    for (const key of keys) {
      const data = {
        key: key,
        title: textData[key].name,
        infos: await getContents(textData[key].infos),
      };
      result.push(await getComponent("content/info-box/content", data));
    }
    return result.join("");
  }

  async getControlBarContentValues(textData) {
    const result = [];
    for (const key in textData) {
      const data = { key, name: textData[key].name };
      result.push(await getComponent("content/control-bar/content-value", data));
    }
    return result.join("");
  }

  async getControlBarContentOptions(textData) {
    const result = [];
    for (const key in textData) {
      const data = { key, name: textData[key].name };
      result.push(await getComponent("content/control-bar/content-option", data));
    }
    return result.join("");
  }

  codeReplaceMap = { "&tab;": "  " };

  async getMainCodes(codesData, textData) {
    const keys = Object.keys(codesData);
    const result = [];
    for (const key of keys) {
      const data = codesData[key];
      const langs = Object.keys(data);
      for (const prolang of langs) {
        const codeByLines = replaceWithMap(data[prolang].main.join("\n"), this.codeReplaceMap).split("\n");
        const linesOfCode = [];
        for (let i = 0; i < codeByLines.length; i++) {
          const lineCode = codeByLines[i];
          const commentText = textData[key]?.comments?.[prolang]?.[i];
          const Comment = commentText ? await getComponent("codebox/comment", { text: commentText }) : null;
          linesOfCode.push(await getComponent("codebox/line", { children: lineCode, order: i + 1, Comment }));
        }
        result.push(await getComponent("codebox/box", { key, prolang, children: linesOfCode.join("") }));
      }
    }
    return result.join("");
  }

  async getUsageCodes(codesData) {
    const keys = Object.keys(codesData);
    const result = [];
    for (const key of keys) {
      const data = codesData[key];
      const langs = Object.keys(data);
      for (const prolang of langs) {
        const codeByLines = replaceWithMap(data[prolang].usage.join("\n"), this.codeReplaceMap).split("\n");
        const linesOfCode = [];
        for (let order = 1; order <= codeByLines.length; order++) {
          const line = codeByLines[order - 1];
          linesOfCode.push(await getComponent("codebox/line", { children: line, order }));
        }
        result.push(await getComponent("codebox/box", { key, prolang, children: linesOfCode.join("") }));
      }
    }
    return result.join("");
  }

  async getCopyCodeBtn(title) {
    return await getComponent("content/copy-code-btn", { title });
  }

  async getProlangs(codesData) {
    const keys = Object.keys(codesData);
    const result = [];
    for (const key of keys) {
      const list = Object.keys(codesData[key]).sort();
      const Items = [];
      for (const prolang of list) {
        const { name, icon } = prolangsConfig[prolang];
        Items.push(await getComponent("content/prolangs-list/item", { title: name, icon, prolang }));
      }
      result.push(
        await getComponent("content/prolangs-list/list", { key, list: list.join(","), Items: Items.join("") }),
      );
    }
    return result.join("");
  }
})();
