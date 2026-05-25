# Algorithm Visualizer

前端算法可视化工具，Canvas 动画展示排序与路径搜索的完整过程。

## 排序算法

| 算法 | 时间复杂度 | 空间复杂度 |
|------|-----------|------------|
| Quick Sort | O(n log n) | O(log n) |
| Merge Sort | O(n log n) | O(n) |
| Heap Sort | O(n log n) | O(1) |
| Bubble Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |

每步比较/交换均有颜色标注，实时显示比较次数与交换次数。

## 路径搜索

| 算法 | 特点 |
|------|------|
| **A\*** | 启发式搜索，保证最优路径，效率最高 |
| **Dijkstra** | 无权图的最短路径，等价于 BFS |
| **BFS** | 广度优先，无权图最优解 |
| **DFS** | 深度优先，不保证最短路径 |

交互式网格：鼠标点击绘制/擦除墙壁，拖动起点和终点，观察不同算法的探索策略差异。

## 运行

```bash
open index.html
```

在线预览：https://yavans.github.io/projects/algo-visualizer/index.html
