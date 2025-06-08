import { _updater as moduleUpdater, Visualizer, InputManager } from "../modules/visualizer.js";

await Visualizer._loading;

class Manager {
  getConfig() {
    const configRaw = document.getElementById("config").innerText;
    this.config = JSON.parse(configRaw || "{}");
  }
  data() {
    const localStorageKey = this.config.localStorageKey;
    const contentKey = this.config.contentKey;

    this.localData = {};
    this.localData.data = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    if (!this.localData.data.c) this.localData.data.c = {}; // content
    if (!this.localData.data.c[contentKey]) this.localData.data.c[contentKey] = {};
    if (!this.localData.data.v) this.localData.data.v = {}; // visualizer

    this.localData.upload = () => localStorage.setItem(localStorageKey, JSON.stringify(this.localData.data));

    this.localData.update = {
      lastContentSelected: (key) => {
        this.localData.data.c[contentKey].lck /*last content key*/ = key;
        this.localData.upload();
      },
      lastProlangSelected: (prolang) => {
        this.localData.data.c[contentKey].lp /*last prolang*/ = prolang;
        this.localData.upload();
      },
      visualizerDelay: (delay) => {
        this.localData.data.v.dl /*delay*/ = delay;
        this.localData.upload();
      },
    };

    this.initialData = {
      lastContentSelected: this.localData.data.c[contentKey].lck,
      lastProlangSelected: this.localData.data.c[contentKey].lp,
    };
    this.settings = {
      getDelay: () => Number(this.localData.data.v.dl),
      get delay() {
        return this.getDelay();
      },
    };
  }
  responsive() {
    const breakpoints = { xl: 1280, lg: 1024, md: 768, sm: 640 };

    const main = document.body.querySelector("main");
    main.resize = function () {
      if (window.innerWidth >= breakpoints.lg && document.fullscreenElement?.id !== "visualizer") {
        const space = parseFloat(getComputedStyle(this).paddingTop);
        const marginByFrame = window.innerWidth - frame.size.width - space;
        const marginByControlBar = window.innerWidth - controlBar.minWidth - space;
        const margin = Math.min(marginByFrame, marginByControlBar);
        this.style.setProperty("margin-right", `${margin}px`);
      } else this.style.removeProperty("margin-right");
    };

    const frame = document.getElementById("frame");
    frame.size = { width: 0, height: 0 };
    frame.resize = function () {
      const space = parseFloat(getComputedStyle(this).marginBottom);
      const temp = {
        width: window.innerWidth - 2 * space,
        height: window.innerHeight - this.offsetTop - controlBar.offsetHeight - 2 * space,
      };
      if (window.innerWidth >= breakpoints.lg && document.fullscreenElement?.id !== "visualizer")
        temp.width = window.innerWidth - infoBox.minWidth - 3 * space;
      if ((temp.width * 9) / 16 <= temp.height) this.size.width = temp.width;
      else this.size.width = (temp.height * 16) / 9;
      this.size.height = (this.size.width * 9) / 16;
      this.size.font = this.size.height / 100;
      this.style.setProperty("width", `${this.size.width}px`);
      this.style.setProperty("font-size", `${this.size.font}px`);
    };

    const controlBar = document.getElementById("control-bar");
    controlBar.resize = function () {
      if (window.innerWidth >= breakpoints.lg) {
        const styled = getComputedStyle(this);
        this.minWidth = parseFloat(styled.minWidth);
      }
    };

    const infoBox = document.getElementById("info-box");
    infoBox.resizeBefore = function () {
      if (window.innerWidth >= breakpoints.lg) {
        const styled = getComputedStyle(this);
        this.minWidth = parseFloat(styled.minWidth);
      }
    };

    infoBox.resizeAfter = function () {
      if (window.innerWidth >= breakpoints.lg) {
        const space = parseFloat(getComputedStyle(this).right);
        const width = window.innerWidth - main.offsetWidth - 3 * space;
        this.style.setProperty("width", `${width}px`);
      } else this.style.removeProperty("width");
    };

    const elementResizes = () => {
      controlBar.resize();
      infoBox.resizeBefore();
      frame.resize();
      main.resize();
      infoBox.resizeAfter();
    };
    elementResizes();
    window.addEventListener("resize", elementResizes);
  }
  visualizerFrame() {
    const frame = document.getElementById("frame");
    frame.style.setProperty("--delay", `${this.settings.delay}ms`);
  }
  changeCurrentElementShow(parent, query = null) {
    parent.current?.classList.add("hidden");
    if (!query) {
      element.current = null;
      return;
    }
    parent.current = parent.querySelector(query);
    parent.current?.classList.remove("hidden");
  }
  toggleShowElement(el, classListShow) {
    const cmd = el.classList.contains(classListShow[0]) ? "remove" : "add";
    for (const cls of classListShow) el.classList[cmd](cls);
  }
  updateVisualizerDelay(delay) {
    document.getElementById("frame").style.setProperty("--delay", `${delay}ms`);
    document.body.querySelector("#progress .seekbar").style.setProperty("--delay", `${delay}ms`);
    this.localData.update.visualizerDelay(delay);
    moduleUpdater.delay = delay;
  }
  updateCurrentKey(key) {
    this.currentKey = key;
    this.localData.update.lastContentSelected(key);
    Visualizer._setCurrentKey(key);
    this.updateContent();
    this.updateCodeBox();
  }
  updateCurrentProlang(prolang) {
    this.currentProlang = prolang;
    this.localData.update.lastProlangSelected(prolang);
    this.updateContent();
    this.updateCodeBox();
  }
  updateContent() {
    const query = `[data-key="${this.currentKey}"]`;
    this.changeCurrentElementShow(document.getElementById("content-value"), query);
    this.changeCurrentElementShow(document.getElementById("info-box"), query);
  }
  updateCodeBox() {
    if (!this.prolangList) return;
    if (!this.prolangList[this.currentKey]) {
      console.warn(`There is no code for "${this.currentKey}" yet.`);
      return;
    }
    if (!this.currentProlang || !this.prolangList[this.currentKey].includes(this.currentProlang)) {
      const prolang = this.prolangList[this.currentKey][0];
      this.updateCurrentProlang(prolang);
    }

    const prolangs = document.getElementById("prolangs");
    const currentActive = prolangs.querySelector(".active");
    const nextActiveQuery = `[data-key="${this.currentKey}"] [data-prolang="${this.currentProlang}"]`;
    const nextActive = prolangs.querySelector(nextActiveQuery);
    currentActive?.classList.remove("active");
    nextActive.classList.add("active");
    for (const cls of prolangs.classListActive) {
      currentActive?.classList.remove(cls);
      nextActive.classList.add(cls);
    }

    document.body.querySelector("#usage-header .icon").innerHTML = nextActive.firstChild.innerHTML;
    document.body.querySelector("#usage-header .extension").innerText = this.currentProlang;

    const fullQuery = `[data-key="${this.currentKey}"][data-prolang="${this.currentProlang}"]`;
    const keyQuery = `[data-key="${this.currentKey}"]`;
    this.changeCurrentElementShow(document.getElementById("codes"), fullQuery);
    this.changeCurrentElementShow(document.getElementById("usages"), fullQuery);
    this.changeCurrentElementShow(document.getElementById("prolangs"), keyQuery);
  }
  contentsSelection() {
    const contentValue = document.getElementById("content-value");
    const initialSelection =
      contentValue.querySelector(`[data-key="${this.initialData.lastContentSelected}"]`) ||
      contentValue.querySelector("span:first-child");
    this.updateCurrentKey(initialSelection.getAttribute("data-key"));

    const contentSelection = document.getElementById("content-selection");
    const contentOptions = contentSelection.querySelectorAll("span");
    for (const option of contentOptions) {
      const key = option.getAttribute("data-key");
      option.onclick = () => this.updateCurrentKey(key);
    }

    this.contentSelectionButton();
  }
  contentSelectionButton() {
    const button = document.getElementById("content");
    button.classListShow = button.getAttribute("data-show-select-class").split(" ");
    const select = document.getElementById("content-selection");
    select.classListShow = select.getAttribute("data-show-class").split(" ");
    select.classListHide = select.getAttribute("data-hide-class").split(" ");
    const buttonChar = document.getElementById("content-char");
    buttonChar.classListShow = buttonChar.getAttribute("data-show-select-class").split(" ");

    const click = (force) => {
      select.classList.toggle("show", force);
      if (select.classList.contains("show")) {
        for (const cls of select.classListHide) select.classList.remove(cls);
        for (const cls of select.classListShow) select.classList.add(cls);
        for (const cls of button.classListShow) button.classList.add(cls);
        for (const cls of buttonChar.classListShow) buttonChar.classList.add(cls);
      } else {
        for (const cls of select.classListShow) select.classList.remove(cls);
        for (const cls of select.classListHide) select.classList.add(cls);
        for (const cls of button.classListShow) button.classList.remove(cls);
        for (const cls of buttonChar.classListShow) buttonChar.classList.remove(cls);
      }
    };

    button.onclick = () => click();

    click(false);
  }
  codeBox() {
    const prolangs = document.getElementById("prolangs");
    prolangs.classListActive = prolangs.getAttribute("data-active-class").split(" ");
    prolangs.onclick = ({ target }) => {
      const prolang = target.getAttribute("data-prolang");
      this.updateCurrentProlang(prolang);
    };

    const keys = Array.from(prolangs.querySelectorAll("[data-key]")).map((el) => el.getAttribute("data-key"));
    this.prolangList = keys.reduce((acc, key) => {
      acc[key] = prolangs.querySelector(`[data-key="${key}"]`).getAttribute("data-list").split(",");
      return acc;
    }, {});

    this.setCopyCodeBtn("codes");
    this.setCopyCodeBtn("usages");

    this.updateCurrentProlang(this.initialData.lastProlangSelected);
  }
  setCopyCodeBtn(wrapperId) {
    const btn = document.body.querySelector(`#${wrapperId} .copy-code-btn`);
    const successColor = btn.getAttribute("data-success-color");

    btn.onclick = () => {
      const query = `#${wrapperId} [data-key="${this.currentKey}"][data-prolang="${this.currentProlang}"] .line`;
      const lines = Array.from(document.body.querySelectorAll(query));
      const code = lines.map((line) => line.innerText).join("\n");
      navigator.clipboard
        .writeText(code)
        .then(() => {
          btn.firstChild.style.setProperty("fill", successColor);
          setTimeout(() => btn.firstChild.style.removeProperty("fill"), 500);
        })
        .catch((err) => alert("Error copying!"));
    };
  }
  controlBarControllers() {
    const controllers = document.getElementById("controllers");
    const buttonClassList = controllers.getAttribute("data-button-class").split(" ");
    const svgClassList = controllers.getAttribute("data-svg-class").split(" ");
    for (const side of ["left", "right"]) {
      const buttons = controllers.querySelectorAll(`.${side} > button`);
      for (const button of buttons) for (const cls of buttonClassList) button.classList.add(cls);
      const svgs = controllers.querySelectorAll(`.${side} > button > svg`);
      for (const svg of svgs) for (const cls of svgClassList) svg.classList.add(cls);
    }

    this.playPauseBtn();
    this.forwardAndBackwardBtns();
    this.customizeInputBtn();
    this.settingBtn();
    this.fullscreenBtn();
    this.frameProgress();
  }
  playPauseBtn() {
    let isPlaying = false;

    const playPauseBtn = document.body.querySelector("#controllers .play-pause");
    const [playText, pauseText, replayText] = playPauseBtn.getAttribute("data-titles").split("|");
    playPauseBtn.title = playText;
    playPauseBtn.onclick = () => handleClick();

    const playIcon = playPauseBtn.querySelector(".play");
    const pauseIcon = playPauseBtn.querySelector(".pause");
    const replayIcon = playPauseBtn.querySelector(".replay");

    const handleClick = async () => {
      if (Visualizer._status === "fast" || Visualizer._status === "pre-end") return;
      if (!isPlaying && Visualizer._status === "playing") return;
      if (Visualizer._status === "end") {
        Visualizer._replay();
        isPlaying = false;
        playIcon.classList.remove("hidden");
        replayIcon.classList.add("hidden");
        playPauseBtn.title = playText;
        return;
      }
      isPlaying = !isPlaying;
      playIcon.classList[isPlaying ? "add" : "remove"]("hidden");
      pauseIcon.classList[isPlaying ? "remove" : "add"]("hidden");
      replayIcon.classList.add("hidden");
      playPauseBtn.title = isPlaying ? pauseText : playText;
      if (isPlaying) {
        await Visualizer._play();
        if (Visualizer._status === "end") isPlaying = false;
      } else Visualizer._pause();
    };

    const handleStepUpdate = ({ progress }) => {
      if (progress === 100) {
        pauseIcon.classList.add("hidden");
        playIcon.classList.add("hidden");
        replayIcon.classList.remove("hidden");
        playPauseBtn.title = replayText;
      } else if (!isPlaying) {
        replayIcon.classList.add("hidden");
        playIcon.classList.remove("hidden");
      }
    };
    Visualizer._addEventListener("stepupdate", handleStepUpdate);
  }
  customizeInputBtn() {
    const popups = document.getElementById("pop-ups");
    document.body.querySelector("#controllers .customize-input").onclick = () =>
      popups.requestShowBox("#customize-input");
  }
  settingBtn() {
    if (!this.settings.delay) this.updateVisualizerDelay(500);

    const settingBtn = document.body.querySelector("#controllers .setting");
    settingBtn.onclick = ({ target }) => {
      if (visualizerSettings.contains(target)) return;
      settingIcon.toggleShow();
      visualizerSettings.toggleShow();
    };

    const settingIcon = settingBtn.querySelector("svg");
    settingIcon.classListShow = settingIcon.getAttribute("data-show-class").split(" ");
    settingIcon.toggleShow = () => this.toggleShowElement(settingIcon, settingIcon.classListShow);

    const visualizerSettings = document.getElementById("visualizer-settings");
    visualizerSettings.classListShow = visualizerSettings.getAttribute("data-show-class").split(" ");
    visualizerSettings.toggleShow = () => this.toggleShowElement(visualizerSettings, visualizerSettings.classListShow);

    const delayInput = document.getElementById("visualizer-delay");
    delayInput.value = this.settings.delay;
    const min = Number(delayInput.min);
    const max = Number(delayInput.max);
    delayInput.oninput = function () {
      const value = Number(this.value);
      if (value > max || value < min) this.style.borderColor = "red";
      else this.style.removeProperty("border-color");
    };
    delayInput.onblur = function () {
      const value = Number(this.value);
      if (value < min) this.value = min;
      else if (value > max) this.value = max;
      updateVisualizerDelay(this.value);
    };
    delayInput.onkeydown = (e) => (e.key === "." || e.key === "," ? e.preventDefault() : null);

    const updateVisualizerDelay = (delay) => this.updateVisualizerDelay(delay);
  }
  fullscreenBtn() {
    let isFullscreen = false;

    const visualizer = document.getElementById("visualizer");
    visualizer.onfullscreenchange = () => setFullscreen(document.fullscreenElement !== null);

    const fullscreenBtn = document.body.querySelector("#controllers .fullscreen");
    const [fullScreen, exitFullScreen] = fullscreenBtn.getAttribute("data-titles").split("|");
    fullscreenBtn.onclick = () => (isFullscreen ? document.exitFullscreen() : visualizer.requestFullscreen());

    const expandIcon = fullscreenBtn.querySelector(".expand");
    const compressIcon = fullscreenBtn.querySelector(".compress");

    const setFullscreen = (fullscreen) => {
      isFullscreen = fullscreen;
      expandIcon.classList[fullscreen ? "add" : "remove"]("hidden");
      compressIcon.classList[fullscreen ? "remove" : "add"]("hidden");
      fullscreenBtn.title = isFullscreen ? exitFullScreen : fullScreen;
    };
    setFullscreen(false);
  }
  forwardAndBackwardBtns() {
    document.body.querySelector("#controllers .forward").onclick = async () => {
      if (Visualizer._status === "fast" || Visualizer._status === "playing") return;
      await Visualizer._forward();
    };
    document.body.querySelector("#controllers .backward").onclick = async () => {
      if (Visualizer._status === "fast" || Visualizer._status === "playing") return;
      await Visualizer._backward();
    };
  }
  frameProgress() {
    const progress = document.getElementById("progress");

    const seekbar = progress.querySelector(".seekbar");
    seekbar.style.setProperty("--delay", `${this.settings.delay}ms`);

    const currentStepDisplay = progress.querySelector(".current");
    const totalStepDisplay = progress.querySelector(".total");

    const handleStepUpdate = ({ progress, step }) => {
      seekbar.style.setProperty("--progress", `${progress}%`);
      currentStepDisplay.innerText = step;
    };
    Visualizer._addEventListener("stepupdate", handleStepUpdate);

    const handleKeyUpdate = ({ stepTotal }) => (totalStepDisplay.innerText = stepTotal);
    Visualizer._addEventListener("keyupdate", handleKeyUpdate);
  }
  popups() {
    const popups = document.getElementById("pop-ups");
    const hideClassList = popups.getAttribute("data-hide-class").split(" ");
    const showClassList = popups.getAttribute("data-show-class").split(" ");
    for (const cls of hideClassList) popups.classList.add(cls);

    const boxClassList = popups.getAttribute("data-box-class").split(" ");
    const boxHideClassList = popups.getAttribute("data-box-hide-class").split(" ");
    const boxShowClassList = popups.getAttribute("data-box-show-class").split(" ");
    for (const box of popups.children) {
      for (const cls of boxClassList) box.classList.add(cls);
      for (const cls of boxHideClassList) box.classList.add(cls);
    }

    popups.requestShowBox = function (boxQuery) {
      const box = this.querySelector(boxQuery);
      box.onRequestShow?.();
      box.classList.add("show");
      for (const cls of boxHideClassList) box.classList.remove(cls);
      for (const cls of boxShowClassList) box.classList.add(cls);
      for (const cls of hideClassList) this.classList.remove(cls);
      for (const cls of showClassList) this.classList.add(cls);
    };
    popups.requestClose = function () {
      const box = this.querySelector(".show");
      if (!box) return;
      box.classList.remove("show");
      for (const cls of boxHideClassList) box.classList.add(cls);
      for (const cls of boxShowClassList) box.classList.remove(cls);
      for (const cls of hideClassList) this.classList.add(cls);
      for (const cls of showClassList) this.classList.remove(cls);
    };
    popups.toggleBox = function (boxQuery) {
      if (this.querySelector(".show")) this.requestClose();
      else this.requestShowBox(boxQuery);
    };

    popups.onclick = function ({ target }) {
      if (target === this) this.requestClose();
    };

    this.customizeInput();
  }
  customizeInput() {
    const customizeInput = document.getElementById("customize-input");
    const maxHeightPercent = Number(getComputedStyle(customizeInput).getPropertyValue("--max-h").slice(0, -1)) / 100;

    const input = customizeInput.querySelector("textarea");
    input.oninput = () => {
      input.style.height = null;
      input.style.height = `${input.scrollHeight}px`;
      const overflow = customizeInput.scrollHeight - window.innerHeight * maxHeightPercent;
      if (overflow > 0) input.style.height = `${input.scrollHeight - overflow}px`;
    };

    customizeInput.onRequestShow = () => {
      input.value = InputManager._formatForView(InputManager._value);
    };

    const popups = document.getElementById("pop-ups");
    customizeInput.querySelector(".close-btn").onclick = () => popups.requestClose();
    customizeInput.querySelector(".apply-btn").onclick = () => {
      InputManager._updateValue(input.value);
      popups.requestClose();
    };
  }
}

const manager = new Manager();
manager.getConfig();
manager.data();
manager.responsive();
manager.visualizerFrame();
manager.controlBarControllers();
manager.contentsSelection();
manager.codeBox();
manager.popups();

window.onkeydown = ({ key }) => {
  if (key == "w") manager.updateCurrentKey("bubble");
  if (key == "s") manager.updateCurrentKey("selection");
};
