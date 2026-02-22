export type Difficulty = "easy" | "moderate" | "hard";
export type Language = "python" | "javascript" | "java" | "cpp";

export interface Question {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  hints: string[];
  solution: {
    [key in Language]?: {
      code: string;
      explanation: string;
      timeComplexity: string;
      spaceComplexity: string;
    };
  };
  testCases: {
    input: any;
    expectedOutput: any;
    explanation?: string;
  }[];
  alternativeApproaches?: {
    approach: string;
    code: { [key in Language]?: string };
    pros: string[];
    cons: string[];
  }[];
}

export const questions: Question[] = [
  {
    id: "q1",
    title: "Two Sum",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    hints: [
      "Use a hash map to store each number and its index as you iterate.",
      "For each number, check if target - current number exists in the hash map.",
    ],
    solution: {
      python: {
        code: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`,
        explanation: "We use a hash map to store each number and its index. For each number, we check if its complement (target - num) exists in the map. If found, we return the indices.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      javascript: {
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        explanation: "We use a Map to store each number and its index. For each number, we check if its complement exists in the map.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      java: {
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
        explanation: "We use a HashMap to store each number and its index. For each number, we check if its complement exists.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      cpp: {
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
        explanation: "We use an unordered_map to store each number and its index. For each number, we check if its complement exists.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
    ],
    alternativeApproaches: [
      {
        approach: "Brute Force",
        code: {
          python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
        },
        pros: ["Simple to understand", "No extra space"],
        cons: ["O(n²) time complexity", "Inefficient for large arrays"],
      },
    ],
  },
  {
    id: "q2",
    title: "Reverse Linked List",
    difficulty: "easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
    ],
    hints: [
      "Use three pointers: prev, current, and next.",
      "Iterate through the list, reversing the next pointer of each node.",
    ],
    solution: {
      python: {
        code: `def reverseList(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev`,
        explanation: "We use three pointers: prev (starts as None), current (starts as head), and next_node. We iterate through the list, reversing each node's next pointer.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
      javascript: {
        code: `function reverseList(head) {
    let prev = null;
    let current = head;
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}`,
        explanation: "We use three pointers to reverse the list iteratively.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    },
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1] },
      { input: { head: [1, 2] }, expectedOutput: [2, 1] },
    ],
  },
  {
    id: "q3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "moderate",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
    ],
    hints: [
      "Use a sliding window approach with two pointers.",
      "Use a set or hash map to track characters in the current window.",
      "Expand the window by moving the right pointer, and shrink it by moving the left pointer when duplicates are found.",
    ],
    solution: {
      python: {
        code: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
        explanation: "We use a sliding window with two pointers (left and right) and a set to track characters. When we encounter a duplicate, we shrink the window from the left until the duplicate is removed.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, m)) where m is the charset size",
      },
      javascript: {
        code: `function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
        explanation: "Sliding window approach with a Set to track characters in the current window.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, m))",
      },
    },
    testCases: [
      { input: { s: "abcabcbb" }, expectedOutput: 3 },
      { input: { s: "bbbbb" }, expectedOutput: 1 },
      { input: { s: "pwwkew" }, expectedOutput: 3 },
    ],
  },
  {
    id: "q4",
    title: "Merge Intervals",
    difficulty: "moderate",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
    ],
    hints: [
      "Sort the intervals by their start time.",
      "Iterate through sorted intervals and merge overlapping ones.",
    ],
    solution: {
      python: {
        code: `def merge(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        if current[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], current[1])
        else:
            merged.append(current)
    
    return merged`,
        explanation: "Sort intervals by start time, then iterate and merge overlapping intervals by updating the end time.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
      },
    },
    testCases: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expectedOutput: [[1, 6], [8, 10], [15, 18]] },
      { input: { intervals: [[1, 4], [4, 5]] }, expectedOutput: [[1, 5]] },
    ],
  },
  {
    id: "q5",
    title: "LRU Cache",
    difficulty: "hard",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class.",
    examples: [
      {
        input: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);',
        output: "1",
      },
    ],
    hints: [
      "Use a combination of a hash map and a doubly linked list.",
      "The hash map stores key-value pairs, and the doubly linked list maintains the order of usage.",
    ],
    solution: {
      python: {
        code: `class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_node(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        prev = node.prev
        next = node.next
        prev.next = next
        next.prev = prev
    
    def _move_to_head(self, node):
        self._remove_node(node)
        self._add_node(node)
    
    def get(self, key: int) -> int:
        node = self.cache.get(key)
        if not node:
            return -1
        self._move_to_head(node)
        return node.value
    
    def put(self, key: int, value: int) -> None:
        node = self.cache.get(key)
        if not node:
            new_node = Node(key, value)
            if len(self.cache) >= self.capacity:
                tail = self.tail.prev
                self._remove_node(tail)
                del self.cache[tail.key]
            self.cache[key] = new_node
            self._add_node(new_node)
        else:
            node.value = value
            self._move_to_head(node)`,
        explanation: "We use a hash map for O(1) lookup and a doubly linked list to maintain LRU order. When capacity is exceeded, we remove the tail node.",
        timeComplexity: "O(1) for both get and put",
        spaceComplexity: "O(capacity)",
      },
    },
    testCases: [
      { input: { operations: ["put", "put", "get", "put", "get"], args: [[1, 1], [2, 2], [1], [3, 3], [2]] }, expectedOutput: [null, null, 1, null, -1] },
    ],
  },
];

export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}
