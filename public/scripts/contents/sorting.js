import { delay, frameEl, InputManager, Visualizer, Steps } from "../../modules/visualizer.js";

const colors = ["yellowgreen", "red", "orange"];
colors[null] = null;

const inputManager = new InputManager({
  type: "number-array",
  defaultValue: [5, 2, 4, 6, 1, 3, 7],
  formatForView: (value) => value.join(" "),
});

const array = {
  length: inputManager.defaultValue.length,
  children: [],
  async setBackgroundColor(index, c = null) {
    this.findEl(index).style.backgroundColor = colors[c];
    await delay();
  },
  async setBackgroundColorInRange(from, to, c = null) {
    for (let i = from; i <= to; i++) this.setBackgroundColor(i, c);
    await delay();
  },
  async goOut(index) {
    this.findEl(index).style.top = "2.4em";
    await delay();
  },
  async comeIn(index) {
    this.findEl(index).style.top = null;
    await delay();
  },
  async moveTo(fromIndex, toIndex) {
    const distance = Math.abs(toIndex - this.children[fromIndex].index);
    frameEl.delayFactor = distance;
    this.findEl(fromIndex).style.left = `${2.4 * toIndex}em`;
    this.findEl(fromIndex).index = toIndex;
    await delay(distance);
    frameEl.delayFactor = null;
  },
  async swap(i, j) {
    if (i == j) return;
    const el1 = this.findEl(i),
      el2 = this.findEl(j);
    this.setBackgroundColor(i, 0);
    this.setBackgroundColor(j, 0);
    await delay();
    el1.style.top = "-2.4em";
    el2.style.top = "2.4em";
    await delay();
    el1.index = j;
    el2.index = i;
    this.setPosition();
    const distance = Math.abs(i - j);
    frameEl.delayFactor = distance;
    await delay(distance);
    frameEl.delayFactor = null;
    el1.style.top = null;
    el2.style.top = null;
    await delay();
    this.setBackgroundColor(i, null);
    this.setBackgroundColor(j, null);
  },
  async end() {
    await delay(0.2);
    for (let i = 0; i < this.length; i++) {
      this.setBackgroundColor(i, 0);
      await delay(0.2);
    }
  },
  findEl(i) {
    for (const el of this.children) if (el.index === i) return el;
  },
  swapIndex(i, j) {
    const a = this.findEl(i);
    const b = this.findEl(j);
    a.index = j;
    b.index = i;
  },
  async setPosition() {
    this.children.forEach((el) => (el.style.left = `${2.4 * el.index}em`));
    await delay();
  },
};

new Visualizer({
  init() {
    frameEl.style.background = "#002379";
    frameEl.innerHTML = [
      `<div class="background">${new Array(10).fill("<span></span>").join("")}</div>`,
      `<div class="array">${inputManager.value.map((e, i) => `<span>${e}</span>`).join("")}</div>`,
    ].join("");
  },
  onStart() {
    array.children = frameEl.querySelector(".array").childNodes;
    array.children.forEach((el, i) => {
      el.index = i;
      el.value = el.innerText;
      el.style.top = null;
      array.setBackgroundColor(i, null);
    });
    array.setPosition();
  },
  registry: {
    bubble: () => {
      const steps = new Steps();
      const wrapBound = steps.createBinder(array);
      const wrapBoundNoAwait = steps.createBinder(array, false);
      let arrCopy = inputManager.value;
      for (let i = 0; i < array.length - 1; i++)
        for (let j = 0; j < array.length - i - 1; j++) {
          wrapBound(array.setBackgroundColor, j, 1);
          if (arrCopy[j] > arrCopy[j + 1]) {
            wrapBound(array.swap, j, j + 1);
            [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];
          }
          wrapBoundNoAwait(array.setBackgroundColor, j, null);
        }
      wrapBound(array.end);
      return steps;
    },
    selection: () => {
      const steps = new Steps();
      const wrapBound = steps.createBinder(array);
      const wrapBoundNoAwait = steps.createBinder(array, false);
      let arrCopy = inputManager.value;
      for (let i = 0; i < array.length - 1; i++) {
        let min = i;
        wrapBoundNoAwait(array.setBackgroundColor, min, 0);
        for (let j = i + 1; j < array.length; j++) {
          if (j - 1 != min) wrapBoundNoAwait(array.setBackgroundColor, j - 1);
          wrapBound(array.setBackgroundColor, j, 1);
          if (arrCopy[j] < arrCopy[min]) {
            wrapBoundNoAwait(array.setBackgroundColor, min);
            min = j;
            wrapBound(array.setBackgroundColor, j, 0);
          }
        }
        wrapBoundNoAwait(array.setBackgroundColor, array.length - 1);
        wrapBound(array.swap, min, i);
        [arrCopy[min], arrCopy[i]] = [arrCopy[i], arrCopy[min]];
        if (min == i) wrapBoundNoAwait(array.setBackgroundColor, min);
      }
      wrapBound(array.end);
      return steps;
    },
    insertion: () => {
      const steps = new Steps();
      const wrapBound = steps.createBinder(array);
      const wrapBoundNoAwait = steps.createBinder(array, false);
      let arrCopy = inputManager.value;
      for (let i = 1; i < array.length; i++) {
        let j = i,
          current = arrCopy[i];
        wrapBound(array.setBackgroundColor, i, 0);
        if (j - 1 >= 0 && arrCopy[j - 1] > current) wrapBound(array.goOut, i);
        while (--j >= 0 && arrCopy[j] > current) {
          arrCopy[j + 1] = arrCopy[j];
          wrapBoundNoAwait(array.swapIndex, j + 1, j);
          wrapBound(array.setPosition);
        }
        arrCopy[j + 1] = current;
        wrapBoundNoAwait(array.setBackgroundColor, j + 1);
        wrapBound(array.comeIn, j + 1);
      }
      wrapBound(array.end);
      return steps;
    },
    quick: () => {
      const steps = new Steps();
      const wrapBound = steps.createBinder(array);
      const wrapBoundNoAwait = steps.createBinder(array, false);
      let arrCopy = inputManager.value;
      const quickSort = (arrCopy, left = 0, right = array.length - 1) => {
        if (left >= right) return;
        wrapBound(array.setBackgroundColorInRange, left, right, 2);
        const pivotIndex = Math.floor((left + right) / 2);
        const pivot = arrCopy[pivotIndex];
        wrapBound(array.setBackgroundColor, pivotIndex, 1);
        let i = left,
          j = right;
        while (i <= j) {
          while (arrCopy[i] < pivot) ++i;
          while (arrCopy[j] > pivot) --j;
          if (i <= j) {
            wrapBound(array.swap, i, j);
            [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
            ++i;
            --j;
          }
        }
        wrapBoundNoAwait(array.setBackgroundColor, pivotIndex);
        wrapBound(array.setBackgroundColorInRange, left, right);
        quickSort(arrCopy, left, j);
        quickSort(arrCopy, i, right);
      };
      quickSort(arrCopy);
      wrapBound(array.end);
      return steps;
    },
  },
});

// ALGOSCENE.customInput.configAll({
//   getPlaceholder: () => ARRAY.join(" "),
//   configValue: { oneLine: true },
//   preprocessing: (value) => value.split(" ").map((e) => Number(e)),
//   checkValue: (value) => {
//     for (const e of value) if (isNaN(e) || e < -9 || e > 99 || !Number.isInteger(e)) return false;
//     if (value.length < 7) return false;
//     return true;
//   },
//   applyValue: (value) => (ARRAY = value.slice(0, 7)),
// });
