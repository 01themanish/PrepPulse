/**
 * Ready-to-use sample question sets matching the required JSON schema.
 */

export const SAMPLE_TEST_JS = {
  title: "JavaScript Core & Modern ES6+ Assessment",
  topic: "JavaScript",
  difficulty: "Medium",
  totalQuestions: 5,
  timePerQuestionMinutes: 1,
  totalDurationMinutes: 5,
  marksPerCorrectAnswer: 1,
  negativeMarking: {
    enabled: true,
    penaltyPerIncorrectAnswer: 0.25,
  },
  questions: [
    {
      id: 1,
      question: "Which of the following statements accurately characterizes the difference between `let` and `var` in modern JavaScript?",
      options: [
        { id: "A", text: "`var` is block-scoped while `let` is function-scoped" },
        { id: "B", text: "`let` is block-scoped and subject to Temporal Dead Zone, while `var` is function-scoped and hoisted with `undefined`" },
        { id: "C", text: "`let` variables can be redeclared within the exact same scope without throwing an error" },
        { id: "D", text: "`var` creates immutable bindings while `let` allows reassignment" }
      ],
      correctAnswer: "B",
      explanation: "`let` variables are block-scoped and remain in a Temporal Dead Zone (TDZ) from the start of the block until declared. `var` is function-scoped (or global) and hoisted with an initial value of `undefined`. Option A reverses the scopes, C is illegal in strict JS, and D confuses `const` with `var`."
    },
    {
      id: 2,
      question: "What is the output of `typeof null` according to the ECMAScript specification?",
      options: [
        { id: "A", text: "\"null\"" },
        { id: "B", text: "\"undefined\"" },
        { id: "C", text: "\"object\"" },
        { id: "D", text: "\"boolean\"" }
      ],
      correctAnswer: "C",
      explanation: "In JavaScript, `typeof null === 'object'`. This is a well-known legacy quirk originating from the earliest implementation of JavaScript where values were stored with a type tag (000 for objects, and `null` was represented as the NULL pointer 0x00)."
    },
    {
      id: 3,
      question: "Which array method creates a new array with the results of calling a provided function on every element, without mutating the original array?",
      options: [
        { id: "A", text: "Array.prototype.forEach()" },
        { id: "B", text: "Array.prototype.map()" },
        { id: "C", text: "Array.prototype.splice()" },
        { id: "D", text: "Array.prototype.push()" }
      ],
      correctAnswer: "B",
      explanation: "`map()` returns a brand new array populated with the results of calling the callback function on each element. `forEach()` returns `undefined`, while `splice()` and `push()` mutate the original array in place."
    },
    {
      id: 4,
      question: "How does the JavaScript Event Loop handle microtasks (e.g. `Promise.then`) compared to macrotasks (e.g. `setTimeout`)?",
      options: [
        { id: "A", text: "Microtasks and macrotasks are processed in a single FIFO queue with equal priority" },
        { id: "B", text: "All microtasks in the microtask queue are completely drained before the next macrotask is executed" },
        { id: "C", text: "One microtask is executed strictly after every timer macrotask executes" },
        { id: "D", text: "Macrotasks execute first, postponing microtasks until the browser re-renders" }
      ],
      correctAnswer: "B",
      explanation: "After each macrotask completes and the JavaScript call stack becomes empty, the engine immediately processes and exhausts all pending microtasks (microtask queue) before moving to the next macrotask or performing rendering steps."
    },
    {
      id: 5,
      question: "Which of the following syntax patterns correctly uses the Nullish Coalescing operator?",
      options: [
        { id: "A", text: "const val = input || 'default';" },
        { id: "B", text: "const val = input ?? 'default';" },
        { id: "C", text: "const val = input ?. 'default';" },
        { id: "D", text: "const val = input !! 'default';" }
      ],
      correctAnswer: "B",
      explanation: "The nullish coalescing operator `??` returns its right-hand operand only when its left-hand operand is `null` or `undefined`. In contrast, `||` falls back for any falsy value (such as `0`, `\"\"`, or `false`)."
    }
  ]
};

export const SAMPLE_TEST_DSA = {
  title: "Data Structures & Algorithms Fundamentals",
  topic: "Data Structures & Algorithms",
  difficulty: "Medium",
  totalQuestions: 5,
  timePerQuestionMinutes: 1,
  totalDurationMinutes: 5,
  marksPerCorrectAnswer: 1,
  negativeMarking: {
    enabled: true,
    penaltyPerIncorrectAnswer: 0.25,
  },
  questions: [
    {
      id: 1,
      question: "What is the average-case and worst-case time complexity of searching for an element in a balanced Binary Search Tree (such as an AVL or Red-Black Tree)?",
      options: [
        { id: "A", text: "Average: O(1), Worst: O(n)" },
        { id: "B", text: "Average: O(log n), Worst: O(log n)" },
        { id: "C", text: "Average: O(n log n), Worst: O(n^2)" },
        { id: "D", text: "Average: O(log n), Worst: O(n)" }
      ],
      correctAnswer: "B",
      explanation: "Because the tree is maintained in a balanced state (height is strictly O(log n)), both average and worst-case search times are guaranteed to be O(log n). In an unbalanced BST, worst case would degenerate to O(n)."
    },
    {
      id: 2,
      question: "Which data structure follows the Last-In, First-Out (LIFO) principle and is commonly used to evaluate postfix arithmetic expressions?",
      options: [
        { id: "A", text: "Queue" },
        { id: "B", text: "Heap" },
        { id: "C", text: "Stack" },
        { id: "D", text: "Deque" }
      ],
      correctAnswer: "C",
      explanation: "A Stack is a LIFO data structure. In postfix (Reverse Polish Notation) evaluation, operands are pushed onto the stack and popped when an operator is encountered."
    },
    {
      id: 3,
      question: "Which sorting algorithm achieves an optimal O(n log n) worst-case time complexity while also being stable?",
      options: [
        { id: "A", text: "Quick Sort" },
        { id: "B", text: "Heap Sort" },
        { id: "C", text: "Merge Sort" },
        { id: "D", text: "Selection Sort" }
      ],
      correctAnswer: "C",
      explanation: "Merge Sort consistently runs in O(n log n) time across best, average, and worst cases, and preserves the relative order of duplicate elements (making it stable). Quick Sort is not stable and has O(n^2) worst case; Heap Sort is not stable."
    },
    {
      id: 4,
      question: "In graph theory, which algorithm computes the shortest path between a single source vertex and all other vertices in a graph with non-negative edge weights?",
      options: [
        { id: "A", text: "Dijkstra's Algorithm" },
        { id: "B", text: "Prim's Algorithm" },
        { id: "C", text: "Kruskal's Algorithm" },
        { id: "D", text: "Floyd-Warshall Algorithm" }
      ],
      correctAnswer: "A",
      explanation: "Dijkstra's algorithm solves the single-source shortest path problem for graphs with non-negative edge weights. Prim and Kruskal find Minimum Spanning Trees, and Floyd-Warshall finds all-pairs shortest paths."
    },
    {
      id: 5,
      question: "What is the expected time complexity of lookup, insert, and delete operations in a standard Hash Table with a well-distributed hash function?",
      options: [
        { id: "A", text: "O(log n)" },
        { id: "B", text: "O(1)" },
        { id: "C", text: "O(n)" },
        { id: "D", text: "O(n log n)" }
      ],
      correctAnswer: "B",
      explanation: "With a uniform hash function and low load factor, hash table lookups, insertions, and deletions take O(1) average/expected time. In the worst case (all elements collide into the same bucket), it degrades to O(n)."
    }
  ]
};
