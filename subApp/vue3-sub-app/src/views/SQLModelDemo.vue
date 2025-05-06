<template>
  <div class="container">
    <div class="sidebar">
      <ul>
        <li 
          v-for="item in sidebarItems" 
          :key="item.id"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          class="sidebar-item"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div class="content">
      <div 
        id="canvas" 
        ref="containerRef"
        @dragover="handleDragOver"
        @drop="handleDrop"
      ></div>
    </div>
    <div class="footer">
      <button @click="generateSQL" class="mt-4">生成 SQL</button>
      <pre>sql：{{ sql || '--' }}</pre>
      <button @click="handleSave">保存</button>
    </div>

    <!-- 右键菜单 -->
    <div v-if="showContextMenu" 
         class="context-menu"
         :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }">
      <div class="menu-item" @click="createConditionNode('where')">WHERE 条件</div>
      <div class="menu-item" @click="createConditionNode('join')">JOIN 条件</div>
      <div class="menu-item" @click="createConditionNode('order')">ORDER BY</div>
      <div class="menu-item" @click="createConditionNode('group')">GROUP BY</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Graph } from '@antv/x6';

const graph = ref(null);
const sql = ref('');
const containerRef = ref(null);
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedNode = ref(null);

Graph.registerNode('diamond', {
  inherit: 'polygon',
  attrs: {
    body: {
      refPoints: '0,10 10,0 20,10 10,20',
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      strokeWidth: 1,
    },
    label: {
      fill: '#6a6c8a',
      fontSize: 12,
    },
  },
  width: 60,
  height: 60,
}, true);

// 条件节点配置
const conditionConfigs = {
  where: {
    shape: 'diamond',
    width: 120,
    height: 80,
    label: 'WHERE',
    style: {
      fill: '#f0f7ff',
      stroke: '#1890ff',
    }
  },
  join: {
    shape: 'diamond',
    width: 120,
    height: 80,
    label: 'JOIN',
    style: {
      fill: '#f6ffed',
      stroke: '#52c41a',
    }
  },
  order: {
    shape: 'diamond',
    width: 120,
    height: 80,
    label: 'ORDER BY',
    style: {
      fill: '#fff7e6',
      stroke: '#fa8c16',
    }
  },
  group: {
    shape: 'diamond',
    width: 120,
    height: 80,
    label: 'GROUP BY',
    style: {
      fill: '#f9f0ff',
      stroke: '#722ed1',
    }
  }
};

const sidebarItems = [
  {
    id: 1,
    label: '人表格',
    type: 'table',
    tableName: 'person',
    alias: 'person',
  },
  {
    id: 2,
    label: '车表格',
    type: 'table', 
    tableName: 'car',
    alias: 'car',
  }
];

// 拖拽开始
const handleDragStart = (event, item) => {
  event.dataTransfer.setData('item', JSON.stringify(item));
};

// 拖拽经过
const handleDragOver = (event) => {
  event.preventDefault();
};

// 拖拽放下，放置节点
const handleDrop = (event) => {
  event.preventDefault();
  const item = JSON.parse(event.dataTransfer.getData('item'));
  console.log('item', item);

  // 获取放置位置（相对于画布的坐标）
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // 添加节点
  graph.value.addNode({
    shape: 'rect',
    x,
    y,
    width: 100,
    height: 60,
    label: item.label,
    data: {
      type: item.type,
      tableName: item.tableName,
      alias: item.alias,
    }
  })
};

const initGraph = () => {
  graph.value = new Graph({
    container: document.getElementById('canvas'),
    autoResize: true,
    background: {
      color: '#f2f2f2'
    },
    grid: true,
  });

  // 监听节点右键事件
  graph.value.on('node:contextmenu', ({ e, node }) => {
    e.preventDefault();
    selectedNode.value = node;
    contextMenuPosition.value = {
      x: e.clientX,
      y: e.clientY
    };
    showContextMenu.value = true;
  });
};

function generateSQL() {
  const cells = graph.value.getCells();
  const nodes = cells.filter(cell => cell.isNode());
  const edges = cells.filter(cell => cell.isEdge());
  console.log('cells', cells);
  console.log('nodes', nodes);
  console.log('edges', edges);

  const nodeMap = {};
  nodes.forEach(node => {
    nodeMap[node.id] = node;
  });


  // 找到起点（没有入边的节点）
  const targetIds = edges.map(edge => edge.getTargetCellId());
  const startNodes = nodes.filter(node => !targetIds.includes(node.id));

  if (startNodes.length === 0) {
    sql.value = '-- 无起点，无法生成 SQL -- ';
    return;
  }

  // 简单按连接线顺序遍历（深度优先)
  const path = [];

  function dfs(nodeId) {
    const node = nodeMap[nodeId];
    path.push(node);
    const nextEdge = edges.find(edge => edge.getSourceCellId() === nodeId);
    if (nextEdge) {
      dfs(nextEdge.getTargetCellId());
    }
  }

  dfs(startNodes[0].id);

  // 根据 path 生成 SQL
  const tables = [];
  const wheres = [];

  path.forEach(node => {
    if (node.data.type === 'table') {
      tables.push(node);
    } else if (node.data.type === 'where') {
      wheres.push(node);
    }
  });

  if (!tables.length) {
    sql.value = '-- 无表名，无法生成 SQL -- ';
    return;
  }

  // 处理 JOIN 顺序
  const joinClauses = [];
  const tableUsed = new Set();

  // 先确定起点（没有入边的表)
  const startTables = tables.filter(node => !targetIds.includes(node.id));
  console.log('startTables', startTables);

  let fromClause = '';
  if (startTables.length > 0) {
    const start = startTables[0];
    fromClause = `FROM ${start.data.tableName} ${start.data.alias}`;
    tableUsed.add(start.id);
  } else {
    fromClause = `FROM ${tables[0].data.tableName} ${tables[0].data.alias}`;
    tableUsed.add(tables[0].id);
  }

  // 根据连线处理 join
  edges.forEach(edge => {
    if (edge.data.type === 'join') {
      const source = nodeMap[edge.getSourceCellId()];
      const target = nodeMap[edge.getTargetCellId()];
      if (source && target) {
        const joinType = edge.data.joinType || 'INNER JOIN';
        const joinClause = `${joinType} ${target.data.tableName} ${target.data.alias} ON ${edge.data.on}`;
        joinClauses.push(joinClause);
        tableUsed.add(target.id);
      }
    }
  });
  
  const conditions = wheres.map(f => f.data.condition);


  sql.value = `
  SELECT *
  ${fromClause} 
  ${joinClauses.length ? joinClauses.join('\n') : ''}
  ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
`.trim();

  console.log(JSON.stringify(graph.value.toJSON()));
}

const handleSave = () => {
  const graphData = graph.value.toJSON();
  console.log('graphData', graphData);
  return {
    modelId: '123',
    graphData: JSON.stringify(graphData),
    version: '1.0.0',
  };
};

// 创建条件节点
const createConditionNode = (type) => {
  if (!selectedNode.value) return;

  const config = conditionConfigs[type];
  const sourcePosition = selectedNode.value.getPosition();

  const data = { type };
  let label = '';
  if (type === 'where') {
    data.condition = 'age > 20';
    label = 'WHERE 条件';
  } else if (type === 'join') {
    data.on = 'a.id = b.user_id';
    data.joinType = 'LEFT JOIN';
    label = 'JOIN 条件';
  } else if (type === 'order') {
    data.order = 'age DESC';
    label = 'ORDER BY';
  } else if (type === 'group') {
    data.group = 'age';
    label = 'GROUP BY';
  }
  
  // 创建条件节点
  const conditionNode = graph.value.addNode({
    ...config,
    x: sourcePosition.x + 200,
    y: sourcePosition.y,
    label: `${label}`,
    data: { ...data }
  });

  // 创建连接线
  graph.value.addEdge({
    source: selectedNode.value,
    target: conditionNode,
    data: {
      type: type,
    },
    style: {
      stroke: config.style.stroke,
    }
  });

  // 关闭右键菜单
  showContextMenu.value = false;
  selectedNode.value = null;
};

// 点击其他地方关闭右键菜单
const closeContextMenu = (event) => {
  if (!event.target.closest('.context-menu')) {
    showContextMenu.value = false;
    selectedNode.value = null;
  }
};

onMounted(() => {
  initGraph();
  document.addEventListener('click', closeContextMenu);
});
</script>

<style scoped lang="less">
.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 150px auto;
  grid-template-rows: auto 150px;

  .sidebar {
    border-right: 1px solid #dcdcdc;

    ul {
      li {
        border-bottom: 1px solid #dcdcdc;
        padding: 10px 20px;
        text-align: left;
        cursor: move;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }

  .content {
    #canvas {
      width: 100%;
      height: 100%;
    }
  }

  .footer {
    border-top: 1px solid #dcdcdc;
    padding: 15px 20px;
    width: calc(100vw - 40px);

    pre {
      width: 100%;
    }
  }
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  .menu-item {
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>