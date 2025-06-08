import normalizeSpaces from "../utilities/normalize-spaces.js";

const CONFIG = JSON.parse(document.getElementById("config").innerText || "{}");
const LOCAL_DATA = JSON.parse(localStorage.getItem(CONFIG.localStorageKey) || "{}");

const data = {
  delay: Number(LOCAL_DATA.v?.dl) || 0,
  saveDelay: Number(LOCAL_DATA.v?.dl) || 0,
  forwardDelay() {
    this.delay = 10;
  },
  backwardDelay() {
    this.delay = 0;
  },
  restoreDelay() {
    this.delay = this.saveDelay;
  },
};

export const _updater = {
  set delay(value) {
    data.delay = Number(value);
    data.saveDelay = data.delay;
  },
};

export const delay = (factor = 1) => new Promise((res) => setTimeout(res, data.delay * factor));

const frameElement = document.getElementById("frame");
export const frameEl = {
  querySelector: (selectors) => frameElement.querySelector(selectors),
  querySelectorAll: (selectors) => frameElement.querySelectorAll(selectors),
  reset: () => {
    frameElement.innerHTML = "";
    frameElement.removeAttribute("style");
    frameElement.style.setProperty("--delay", `${data.saveDelay}ms`);
  },
  set innerHTML(newValue) {
    frameElement.innerHTML = newValue;
  },
  style: {
    set background(newValue) {
      frameElement.style.background = newValue;
    },
  },
  set delayFactor(newValue) {
    const delay = newValue * data.saveDelay || data.saveDelay;
    frameElement.style.setProperty("--delay", `${delay}ms`);
  },
};

const handleInput = {
  "number-array": (rawValue) => rawValue.split(/\s+/).map(Number),
  "number-matrix": (rawValue) => rawValue.split("\n").map((line) => line.split(/\s+/).map(Number)),
  "string-array": (rawValue) => rawValue.split(/\s+/),
  "string-matrix": (rawValue) => rawValue.split("\n").map((line) => line.split(/\s+/)),
};
export class InputManager {
  static #instance = null;
  static #listeners = new Map([["change", new Set()]]);
  static _addEventListener(type, listener) {
    const set = this.#listeners.get(type);
    if (!set) throw new Error(`Invalid event type: ${type}`);
    set.add(listener);
  }
  static _removeEventListener(type, listener) {
    const set = this.#listeners.get(type);
    if (set) set.delete(listener);
  }
  static #invokeEventListener(type, ...args) {
    const set = this.#listeners.get(type);
    if (!set) return;
    for (const listener of set) listener(...args);
  }
  static _formatForView = (value) => value.join(" ");
  static _updateValue(rawValue) {
    const value = this.#handleInput(normalizeSpaces(rawValue));
    this.#instance.#value = value;
    this.#invokeEventListener("change", value);
    Visualizer._reset();
  }
  static #handleInput = () => {};
  static get _value() {
    return structuredClone(this.#instance.#value);
  }

  #value;
  #defaultValue;
  #type;
  #validTypes = ["number-array", "number-matrix", "string-array", "string-matrix"];
  constructor({ defaultValue, type, formatForView }) {
    if (InputManager.#instance) throw new Error("`InputManager` can only be instantiated once");

    this.#defaultValue = defaultValue || null;
    this.#value = this.#defaultValue;

    if (type && !this.#validTypes.includes(type))
      throw new Error(`Invalid type: "${type}". Expected one of: ${this.#validTypes.join(", ")}`);
    else {
      this.#type = type || this.#validTypes[0];
      InputManager.#handleInput = handleInput[this.#type];
    }

    if (formatForView)
      if (typeof formatForView === "function") InputManager._formatForView = formatForView;
      else throw new Error(`Invalid formatForView: expected an function, got ${typeof formatForView}`);

    InputManager.#instance = this;
  }
  get value() {
    return structuredClone(this.#value);
  }
  get defaultValue() {
    return structuredClone(this.#defaultValue);
  }
}

export class Visualizer {
  static #instance = null;
  static #loadingResolve;
  static _loading = new Promise((resolve) => (Visualizer.#loadingResolve = resolve));
  static _status = null;
  static #steps = [];
  static #key = null;
  static #listeners = new Map([
    ["stepupdate", new Set()],
    ["keyupdate", new Set()],
  ]);
  static #currentStep = 0;
  static #isPlaying = false;

  static #updateStep(step) {
    this.#currentStep = step;
    const progress = Number(((step / this.#steps.length) * 100).toFixed(1));
    this.#invokeEventListener("stepupdate", { step, progress });
  }
  static #incStep(value = 1) {
    this.#updateStep(this.#currentStep + value);
  }
  static async #runStep(step) {
    await this.#steps[step - 1]();
  }
  static async #runCurrentStep() {
    await this.#runStep(this.#currentStep);
  }
  static _setCurrentKey(key) {
    if (!(key in this.#instance.#registry)) throw new Error(`\`${key}\` was not found in the registry`);
    this.#key = key;
    this.#steps = this.#instance.#registry[key]?.()?.value || [];
    this.#instance.#init();
    this.#instance.#onStart();
    this._status = "NgocLinh";
    this.#updateStep(0);
    this.#invokeEventListener("keyupdate", { stepTotal: this.#steps.length });
  }
  static _reset() {
    this._setCurrentKey(this.#key);
  }
  static async _play() {
    this._status = "playing";
    this.#isPlaying = true;
    while (this.#currentStep < this.#steps.length - 1) {
      this.#incStep();
      await this.#runCurrentStep();
      if (!this.#isPlaying) return (this._status = "pause");
    }
    this._status = "pre-end";
    this.#incStep();
    await this.#runCurrentStep();
    this._status = "end";
  }
  static _pause() {
    this.#isPlaying = false;
  }
  static _replay() {
    this._status = "pause";
    this.#isPlaying = false;
    this.#updateStep(0);
    this.#instance.#onStart();
  }
  static async _forward() {
    this._status = "fast";
    data.forwardDelay();
    const next = Math.min(this.#currentStep + 5, this.#steps.length);
    const current = this.#currentStep + 1;
    this.#updateStep(next);
    for (let i = current; i <= next; i++) await this.#runStep(i);
    data.restoreDelay();
    if (next === this.#steps.length) this._status = "end";
    else this._status = "pause";
  }
  static async _backward() {
    this._status = "fast";
    data.backwardDelay();
    const next = Math.max(this.#currentStep - 5, 0);
    this.#updateStep(next);
    this.#instance.#onStart();
    for (let i = 1; i <= next; i++) await this.#runStep(i);
    data.restoreDelay();
    this._status = "pause";
  }
  static _getInstance() {
    if (Visualizer.#instance) return Visualizer.#instance;
    throw new Error("`Visualizer` not yet created");
  }
  static _addEventListener(type, listener) {
    const set = this.#listeners.get(type);
    if (!set) throw new Error(`Invalid event type: ${type}`);
    set.add(listener);
  }
  static _removeEventListener(type, listener) {
    const set = this.#listeners.get(type);
    if (set) set.delete(listener);
  }
  static #invokeEventListener(type, ...args) {
    const set = this.#listeners.get(type);
    if (!set) return;
    for (const listener of set) listener(...args);
  }

  #validateRegistry(registry) {
    if (typeof registry !== "object") throw new Error(`Invalid registry: expected an object, got ${typeof registry}`);
    for (const [key, value] of Object.entries(registry)) {
      if (typeof value !== "function")
        throw new Error(`Invalid registry entry: key "${key}" must be a function, got ${typeof value}`);
      let result;
      try {
        result = value();
      } catch (e) {
        throw new Error(`Error executing registry function "${key}": ${e.message}`);
      }
      if (!(result instanceof Steps)) {
        const actual = result === null ? "null" : typeof result;
        throw new Error(`Invalid return type from "${key}": expected instance of Steps, got ${actual}`);
      }
    }
    return true;
  }

  #onStart = () => {};
  #init = () => {};
  #registry = {};
  constructor({ init, onStart, registry }) {
    if (Visualizer.#instance) throw new Error("`Visualizer` can only be instantiated once");
    Visualizer.#instance = this;

    if (init)
      if (typeof init === "function") this.#init = init;
      else throw new Error("`init` must be defined as a function");
    if (onStart)
      if (typeof onStart === "function") this.#onStart = onStart;
      else throw new Error("`init` must be defined as a function");
    if (registry) if (this.#validateRegistry(registry)) this.#registry = registry;

    Visualizer.#loadingResolve();
  }
}

export class Steps {
  #items = [];
  push(fn) {
    this.#items.push(fn);
  }
  wrap(fn, ...args) {
    this.#items.push(() => fn(...args));
  }
  wrapNoAwait(fn, ...args) {
    this.#items.push(() => {
      fn(...args);
    });
  }
  wrapBound(fn, thisArg, ...args) {
    this.#items.push(() => fn.apply(thisArg, args));
  }
  wrapBoundNoAwait(fn, thisArg, ...args) {
    this.#items.push(() => {
      fn.apply(thisArg, args);
    });
  }
  createBinder(thisArg, shouldAwait = true) {
    if (shouldAwait) return (fn, ...args) => this.wrapBound(fn, thisArg, ...args);
    return (fn, ...args) => this.wrapBoundNoAwait(fn, thisArg, ...args);
  }
  get value() {
    return [...this.#items];
  }
}
