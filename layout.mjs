const SVGNS = 'http://www.w3.org/2000/svg';

class Graph {
  constructor(roots, leaves) {
    this.roots = roots;
    this.leaves = leaves;
  }
}

class Edge {
  constructor(element, source, dest, out_idx) {
    this.element = element;
    this.source = source;
    this.dest = dest;
    this.out_idx = out_idx;
  }
}

class Vertex {
  constructor(element, bbox) {
    this.element = element;
    this.bbox = bbox;
    this.out_edges = [];
    this.in_edges = [];
  }
}

function make_vertex(element) {
  const bbox = element.getBBox();
  return new Vertex(element, bbox);
}

function make_pseudo_vertex(rank) {
  const bbox = {
    x: -0.5,
    y: -0.5,
    width: 1,
    height: 1,
  };
  const v = new Vertex(null, bbox);
  v.rank = rank;
  return v;
}

function make_graph(element) {
  const vertices = new Map();
  // Create vertices.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.hasAttribute('id') && child.getAttribute('class') !== 'edge') {
      const vertex = make_vertex(child);
      const id = child.getAttribute('id');
      vertex.id = id;
      vertices.set(id, vertex);
    }
  }
  // Create edges.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.getAttribute('class') !== 'edge')
      continue;
    if (child.nodeName !== 'path') {
      console.log('Ignore edge element that isn\'t a path');
      continue;
    }
    const src = child.getAttribute('src');
    const dst = child.getAttribute('dst');
    if (!vertices.has(src)) {
      console.log(child);
      console.log(`Source vertex '${src}' not found`);
      continue;
    }
    if (!vertices.has(dst)) {
      console.log(child);
      console.log(`Destination vertex '${dst}' not found`);
      continue;
    }
    const src_node = vertices.get(src);
    const dst_node = vertices.get(dst);

    const edge = new Edge(child, src_node, dst_node, src_node.out_edges.length);
    src_node.out_edges.push(edge);
    dst_node.in_edges.push(edge);
  }

  const roots = [];
  const leaves = [];
  for (let v of vertices.values()) {
    if (v.in_edges.length === 0)
      roots.push(v);
    if (v.out_edges.length === 0)
      leaves.push(v);
  }
  return new Graph(roots, leaves);
}

function walk_step(node, visited, result) {
  if (visited.has(node))
    return;
  visited.add(node);
  for (let edge of node.out_edges) {
    walk_step(edge.dest, visited, result);
  }
  result.push(node);
}

function post_order(roots) {
  const result = [];
  const visited = new Set();
  for (let node of roots) {
    walk_step(node, visited, result);
  }
  return result;
}

function walk_step_ins(node, visited, result) {
  if (visited.has(node))
    return;
  visited.add(node);
  for (let edge of node.in_edges) {
    walk_step_ins(edge.source, visited, result);
  }
  result.push(node);
}

function post_order_ins(leaves) {
  const result = [];
  const visited = new Set();
  for (let node of leaves) {
    walk_step_ins(node, visited, result);
  }
  return result;
}

class Ranking {
  constructor(ranks, rank_max, nodelist) {
    this.ranks = ranks;
    this.rank_max = rank_max;
    this.nodelist = nodelist;
  }
}

function compute_min_rank(graph) {
  const roots = graph.roots;
  for (let node of roots) {
    node.min_rank = 0;
  }

  const reverse_post_order = post_order(roots).reverse();
  for (let node of reverse_post_order) {
    console.assert(node.min_rank !== undefined);
    const next_rank = node.min_rank + 1;
    for (let edge of node.out_edges) {
      const succ = edge.dest;
      if (succ.min_rank === undefined || succ.min_rank < next_rank)
        succ.min_rank = next_rank;
    }
  }
}

function compute_max_rank(graph) {
  const leaves = graph.leaves;
  for (let node of leaves) {
    node.max_rank = 0;
  }

  const reverse_post_order = post_order_ins(leaves).reverse();
  for (let node of reverse_post_order) {
    console.assert(node.max_rank !== undefined);
    const next_rank = node.max_rank + 1;
    for (let edge of node.in_edges) {
      const pred = edge.source;
      if (pred.max_rank === undefined || pred.max_rank < next_rank)
        pred.max_rank = next_rank;
    }
  }
}

function rank(graph) {
  compute_min_rank(graph)
  compute_max_rank(graph)
  const roots = graph.roots;

  const nodes = post_order(roots);
  let rank_max = 0;
  for (let node of nodes) {
    node.rank = node.min_rank;
    rank_max = Math.max(rank_max, node.rank)
  }

  const ranks = [];
  for (let r = 0; r <= rank_max; ++r)
    ranks.push([]);

  const nodelist = [];
  for (let node of nodes) {
    const rank = node.rank;
    ranks[rank].push(node);

    // Create pseudo nodes for connecting ranks
    const new_edges = [];
    for (let edge of node.out_edges) {
      const dest = edge.dest;
      const dest_rank = dest.rank;
      let last = node;
      for (let r = rank+1; r < dest_rank; ++r) {
        const v = make_pseudo_vertex(r);
        ranks[r].push(v);
        nodelist.push(v);
        const out_edges = last === node ? new_edges : last.out_edges;
        const element = last === node ? edge.element : null;
        const new_edge = new Edge(element, last, v, out_edges.length);
        out_edges.push(new_edge);

        v.in_edges.push(new_edge);
        last = v;
      }
      if (last === node) {
        new_edges.push(edge);
      } else {
        const new_edge = new Edge(null, last, dest, last.out_edges.length);
        dest.in_edges = dest.in_edges.filter(e => e !== edge);
        dest.in_edges.push(new_edge);
        last.out_edges.push(new_edge);
      }
    }
    node.out_edges = new_edges;

    nodelist.push(node);
  }

  return new Ranking(ranks, rank_max, nodelist);
}

function order(ranking) {
  const ranks = ranking.ranks;
  const rank_max = ranking.rank_max;

  let previous_rank_nodes = ranks[0];
  for (let rank = 1; rank <= rank_max; rank++) {
    let idx = 0;
    for (let node of previous_rank_nodes) {
      node.order_idx = idx++;
    }

    const rank_nodes = ranks[rank];
    for (let node of rank_nodes) {
      let order_val_sum = 0;
      let n_in_edges = 0;
      for (let edge of node.in_edges) {
        const source = edge.source;
        if (source.rank === undefined || source.rank !== (rank-1))
          continue;
        if (source.order_idx !== undefined) {
          let order_val = source.order_idx;
          if (edge.out_idx > 0)
            order_val += edge.out_idx / (source.out_edges.length + 1);
          order_val_sum += order_val;
          n_in_edges++;
        }
      }
      node.order_idx = n_in_edges === 0 ? -1 : order_val_sum / n_in_edges;
    }
    rank_nodes.sort((n0, n1) => (n0.order_idx - n1.order_idx));

    previous_rank_nodes = rank_nodes;
  }
}

function initial_placement(ranking, params) {
  const spacing_x = params.spacing_x;
  const spacing_y = params.spacing_y;

  let y = 0;
  for (let rank_nodes of ranking.ranks) {
    let x = 0;
    let min_y = 0;
    let max_y = 0;
    for (let node of rank_nodes) {
      if (x > 0) {
        x += spacing_x;
        x += node.bbox.width / 2;
      }
      node.x = x;
      x += node.bbox.width / 2;

      min_y = Math.min(min_y, node.bbox.y);
      max_y = Math.max(max_y, node.bbox.y + node.bbox.height);
    }

    y += spacing_y;
    y += -min_y;

    for (let node of rank_nodes) {
      node.y = y;
    }

    y += max_y;
  }
}

function median(arr) {
  arr.sort();
  const len = arr.length;
  const median = len % 2 === 1
    ? arr[(len-1)/2]
    : (arr[len/2 - 1] + arr[len/2]) * 0.5;
  return median;
}

function cycle_up(ranking, params) {
  const spacing_x = params.spacing_x;

  for (let rank = ranking.rank_max - 1; rank >= 0; rank--) {
    const rank_nodes = ranking.ranks[rank];
    console.assert(rank_nodes.length > 0);

    let last_node;
    for (let node of rank_nodes) {
      const x_pos = []
      const source = node;
      const spacing_out_x = source.bbox.width / (node.out_edges.length + 1);
      for (let edge of node.out_edges) {
        const dest = edge.dest;

        const dest_classify = dest.in_edges.length - dest.out_edges.length;
        if (dest_classify > 0)
          continue;

        const dest_x = dest.x + dest.bbox.x + 0.5*dest.bbox.width;
        const source_offset = -source.bbox.x - (edge.out_idx+1) * spacing_out_x;
        const x = dest_x + source_offset;
        x_pos.push(x);
      }

      let x = node.x
      if (x_pos.length > 0)
        x = median(x_pos);
      if (last_node) {
        const bbox = last_node.bbox;
        const last_right = last_node.x + bbox.x + bbox.width;
        const min_x = last_right + spacing_x - node.bbox.x;
        x = Math.max(min_x, x);
      }
      node.x = x;
      last_node = node;
    }
  }
}

function cycle_down(ranking, params) {
  const rank_max = ranking.rank_max;
  const spacing_x = params.spacing_x;

  for (let rank = 1; rank <= rank_max; rank++) {
    const rank_nodes = ranking.ranks[rank];
    console.assert(rank_nodes.length > 0);

    let last_node;
    for (let node of rank_nodes) {
      const x_pos = []
      const dest = node;
      const dest_offset = -dest.bbox.x -0.5*dest.bbox.width;
      for (let edge of node.in_edges) {
        const source = edge.source;

        const source_classify = source.in_edges.length - source.out_edges.length;
        if (source_classify < 0)
          continue;

        const spacing_out_x = source.bbox.width / (source.out_edges.length + 1);
        const source_x = source.x + source.bbox.x + (edge.out_idx+1) * spacing_out_x;
        const x = source_x + dest_offset;
        x_pos.push(x);
      }

      let x = node.x
      if (x_pos.length > 0)
        x = median(x_pos);
      if (last_node) {
        const bbox = last_node.bbox;
        const last_right = last_node.x + bbox.x + bbox.width;
        const min_x = last_right + spacing_x - node.bbox.x;
        x = Math.max(min_x, x);
      }
      node.x = x;
      last_node = node;
    }
  }
}

function position(ranking, params) {
  initial_placement(ranking, params);
  for (let i = 0; i < 3; ++i) {
    cycle_up(ranking, params);
    cycle_down(ranking, params);
  }

  // Finalize
  for (let rank_nodes of ranking.ranks) {
    console.assert(rank_nodes.length > 0);

    for (let node of rank_nodes) {
      if (node.element) {
        const x = node.x;
        const y = node.y;
        node.element.setAttribute('transform', `translate(${x} ${y})`);
      }
      node.bbox.x += node.x;
      node.bbox.y += node.y;
    }
  }
}

function position_edges(ranking, params) {
  const non_overlap_slack_x = 3;
  const ranks = ranking.ranks;

  // Determine edge positions on node inputs.
  for (let rank_nodes of ranks) {
    for (let node of rank_nodes) {
      if (!params.ordered_ins) {
        node.in_edges.sort((e0, e1) => {
          const source0 = e0.source;
          const source1 = e1.source;
          const x0 = source0.x + source0.bbox.x + 0.5*source0.bbox.width;
          const x1 = source1.x + source1.bbox.x + 0.5*source1.bbox.width;
          return x0 - x1;
        });
      }

      const bbox = node.bbox;
      const in_y = node.bbox.y;
      const spacing = bbox.width / (node.in_edges.length + 1);
      let in_x = bbox.x;
      for (let edge of node.in_edges) {
        in_x += spacing;
        edge.in_x = in_x;
        edge.in_y = in_y;
      }
    }
  }

  for (let rank_nodes of ranks) {
    const edges = [];

    // Determine edge positions on node outputs.
    for (let node of rank_nodes) {
      if (!params.ordered_outs) {
        node.out_edges.sort((e0, e1) => {
          return e0.in_x - e1.in_x;
        });
      }

      const out_y = node.bbox.y + node.bbox.height;
      const spacing = node.bbox.width / (node.out_edges.length + 1);
      let out_x = node.bbox.x;
      for (let edge of node.out_edges) {
        out_x += spacing;

        edge.out_x = out_x;
        edge.out_y = out_y;
        console.assert(edge.out_y < edge.in_y);
        edges.push(edge);
      }
    }

    if (edges.length === 0)
      continue;

    // Assign heights trying to give parallel edges different levels.
    let min_y = -10000;
    let max_y = 10000;
    for (let edge of edges) {
      edge.begin = Math.min(edge.out_x, edge.in_x) - non_overlap_slack_x;
      edge.end = Math.max(edge.out_x, edge.in_x) + non_overlap_slack_x;
      min_y = Math.max(min_y, edge.out_y);
      max_y = Math.min(max_y, edge.in_y);
    }
    edges.sort((e0, e1) => (e0.begin - e1.begin));

    let active = [];
    let max_height_level = 0;
    let min_height_level = 0;
    for (let edge of edges) {
      let x = edge.begin;
      // TODO: We could keep the active list sorted to avoid checking all
      // edges for filtering...
      let local_max_height = 0;
      let local_min_height = 0;
      active = active.filter(active_edge => (active_edge.end >= x));
      for (let active_edge of active) {
        local_min_height = Math.min(local_min_height, active_edge.height_level-1);
        local_max_height = Math.max(local_max_height, active_edge.height_level+1);
      }
      const backward = edge.out_x > edge.in_x;
      const height_level = backward ? local_max_height : local_min_height;
      edge.height_level = height_level;
      min_height_level = Math.min(min_height_level, height_level);
      max_height_level = Math.max(max_height_level, height_level);
      active.push(edge);
    }

    const height_level_range = max_height_level - min_height_level;
    const level_spacing = (max_y - min_y) / (height_level_range + 2);
    for (let edge of edges) {
      const level_height = (edge.height_level+1-min_height_level)*level_spacing;
      edge.half_height = min_y + level_height;
    }
  }
}

function draw_edges(ranking, params) {
  for (let rank_nodes of ranking.ranks) {
    for (let node of rank_nodes) {
      if (!node.element) {
        if (params.debug_draw) {
          const circ = document.createElementNS(SVGNS, 'circle');
          circ.setAttribute('cx', node.x);
          circ.setAttribute('cy', node.y);
          circ.setAttribute('r', 3);
          circ.setAttribute('fill', 'red');
          params.debug_draw.appendChild(circ);
        }
        continue;
      }

      for (let edge of node.out_edges) {
        const element = edge.element;
        console.assert(element);

        let path_data = `M${edge.out_x},${edge.out_y}`;
        let current_edge = edge;
        for (;;) {
          let dest = current_edge.dest;
          const out_x = current_edge.out_x;
          const in_x = current_edge.in_x;
          const in_y = current_edge.in_y;
          const half_y = current_edge.half_height;

          if (out_x !== in_x) {
            path_data += `V${half_y}`;
            path_data += `H${in_x}`;
          }
          path_data += `V${in_y}`;

          // In case of a pseudo node continue drawing...
          if (dest.element === null) {
            console.assert(dest.out_edges.length === 1);
            current_edge = dest.out_edges[0];
          } else {
            break;
          }
        }

        element.setAttribute('d', path_data);
      }
    }
  }
}

function add_debug_handlers(element, ranking, params) {
  if (params.debug_log_on_click) {
    for (let node of ranking.nodelist) {
      const element = node.element;
      if (!element)
        continue;
      for (let child of element.querySelectorAll('*')) {
        child.onclick = () => {
          console.log(element);
          console.log(`Id: ${node.id}`);
          console.log(`Rank: ${node.rank}`);
          console.log(`MinRank: ${node.min_rank}`);
          console.log(`MaxRank: ${node.max_rank}`);
          console.log(`Order Idx: ${node.order_idx}`);
        };
      }
    }
  }
}

export function layout(element, params) {
  if (params === undefined)
    params = {};
  if (params.spacing_x === undefined)
    params.spacing_x = 15;
  if (params.spacing_y === undefined)
    params.spacing_y = 30;
  if (params.debug_draw === undefined)
    params.debug_draw = element;
  if (params.debug_log_on_click === undefined)
    params.debug_log_on_click = true;

  const graph = make_graph(element);
  const ranking = rank(graph);
  order(ranking);
  position(ranking, params);

  position_edges(ranking, params);
  draw_edges(ranking, params);

  add_debug_handlers(element, ranking, params);
}

export default { layout };
