import gic from "../../../utilities/generate-inline-code.js";

const bubbleComments = (() => {
  const cpp = [
    "",
    "",
    "",
    `Define function ${gic("mtk16(bubbleSort)")}`,
    "The outer loop allows for multiple passes through the array to push the largest element (in ascending order) or the smallest element (in descending order) to the end of the array",
    "The inner loop compares adjacent elements and swaps them if they are out of order",
    "Check if two adjacent elements are in the wrong order. If true, swap these elements to move the larger element back (in ascending order)",
    "Swap two elements",
  ];
  const js = cpp.slice(3);
  const py = [`Define function ${gic("mtk16(bubble_sort)")}`, ...js.slice(1)];
  return { cpp, js, py };
})();

export default {
  self: {
    title: "Sorting",
    keywords: "",
    description: "",
    revised: "",
    author: "",
  },
  children: {
    bubble: {
      name: "Bubble Sort",
      infos: {
        Idea: "\t- Traverse the array multiple times.\n\t- Each time, compare adjacent elements and swap them if necessary.\n\t- The largest element bubbles up to the end of the array after each traversal, similar to a bubble rising to the surface of the water.",
        Advantage:
          "\t- Simple, intuitive, and easy to understand.\n\t- Effective for small arrays.\n\t- A stable sorting algorithm.",
        Disadvantage: "    Poor performance on large arrays.",
        Application:
          "\t- Commonly used to teach and illustrate basic sorting algorithms.\n\t- Sorting small datasets.\n\t- Verifying the correctness of other algorithms.",
      },
      comments: bubbleComments,
    },
    selection: {
      name: "Selection Sort",
      infos: {
        Idea: "\t- Divide the array into two parts: the sorted part and the unsorted part.\n\t- Initially, the sorted part is empty and the unsorted part is the entire array.\n\t- Repeat the process, finding the smallest (or largest) element in the unsorted part each time and swapping it with the first element in the unsorted part, expanding the sorted part.",
        Advantage: "\t- Simple, intuitive, and easy to understand.\n\t- Effective for small arrays.",
        Disadvantage: "\t- Poor performance on large arrays.\n\t- An unstable sorting algorithm.",
        Application:
          "\t- Sorting small datasets.\n\t- When memory space is limited.\n\t- Sorting a small part of the data.",
      },
    },
    insertion: {
      name: "Insertion Sort",
      infos: {
        Idea: "\t- Divide the array into two parts: the sorted part and the unsorted part.\n\t- Initially, the sorted part contains only the first element, and the rest of the array is the unsorted part.\n\t- Repeat the process of taking the next element from the unsorted part and inserting it into the correct position in the sorted part.",
        Advantage:
          "\t- Simple, intuitive, and easy to understand.\n\t- Effective for small arrays.\n\t- Works well with nearly sorted arrays.\n\t- A stable sorting algorithm.",
        Disadvantage: "    Poor performance on large arrays.",
        Application:
          "\t- Sorting small or nearly sorted datasets.\n\t- Sorting data in desktop and mobile applications.\n\t- Intermediate algorithm in more complex algorithms.",
      },
    },
    quick: {
      name: "Quick Sort",
      infos: {
        Idea: "\t- Select an element from the array as the pivot.\n\t- Partition the array into two parts: one with elements smaller than or equal to the pivot and one with elements greater than or equal to the pivot.\n\t- Recursively sort the two subarrays.\n\t- The sorted subarrays are combined to form the fully sorted array.",
        Advantage: "    Good performance, even with large arrays.",
        Disadvantage: "    An unstable sorting algorithm.",
        Application:
          "\t- Sorting data in programming languages and libraries.\n\t- Database sorting.\n\t- Used in web and mobile applications.\n\t- Data processing in distributed algorithms.\n\t- Large data analysis and processing.",
      },
    },
  },
};
