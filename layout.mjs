const SVGNS = "http://www.w3.org/2000/svg";

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
    this.rank = 0;
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

function make_vertices(element) {
  const vertices = new Map();
  // Create vertices.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.hasAttribute("id") && child.getAttribute("class") != "edge") {
      const vertex = make_vertex(child);
      const id = child.getAttribute("id");
      vertex.id = id; // only for debugging
      vertices.set(id, vertex);
    }
  }
  // Create edges.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.getAttribute("class") != 'edge')
      continue;
    if (child.nodeName != "path") {
      console.log("Ignore edge element that isn't a path");
      continue;
    }
    const src = child.getAttribute("src");
    const dst = child.getAttribute("dst");
    if (!vertices.has(src)) {
      console.log(child);
      console.log(`Source vertex "${src}" not found`);
      continue;
    }
    if (!vertices.has(dst)) {
      console.log(child);
      console.log(`Destination vertex "${dst}" not found`);
      continue;
    }
    const src_node = vertices.get(src);
    const dst_node = vertices.get(dst);

    const edge = new Edge(child, src_node, dst_node, src_node.out_edges.length);
    src_node.out_edges.push(edge);
    dst_node.in_edges.push(edge);
  }
  // Determine roots.
  const roots = [];
  for (let v of vertices.values()) {
    if (v.in_edges.length == 0)
      roots.push(v);
  }
  return roots;
}

function walk_step(node, visited, pre_func, post_func) {
  if (visited.has(node))
    return;
  visited.add(node);
  pre_func(node);
  for (let edge of node.out_edges) {
    walk_step(edge.dest, visited, pre_func, post_func);
  }
  post_func(node);
}
function rwalk_step(node, visited, pre_func, post_func) {
  if (visited.has(node))
    return;
  visited.add(node);
  pre_func(node);
  for (let edge of node.in_edges) {
    rwalk_step(edge.source, visited, pre_func, post_func);
  }
  post_func(node);
}

function walk(roots, pre_func, post_func) {
  const visited = new Set();
  for (let node of roots) {
    walk_step(node, visited, pre_func, post_func);
  }
}
function walk_post_order(roots, func) {
  walk(roots, n=>{}, func);
}
function walk_rpo(roots, func) {
  const list = [];
  walk_post_order(roots, n => {list.push(n);});
  list.reverse().forEach(func);
}
function rwalk(roots, pre_func, post_func) {
  const visited = new Set();
  for (let node of roots) {
    rwalk_step(node, visited, pre_func, post_func);
  }
}
function rwalk_post_order(roots, func) {
  rwalk(roots, n=>{}, func);
}
function rwalk_rpo(roots, func) {
  const list = [];
  rwalk_post_order(roots, n=>{list.push(n);});
  list.reverse().forEach(func);
}

class Ranking {
  constructor(ranks, rank_max, nodelist) {
    this.ranks = ranks;
    this.rank_max = rank_max;
    this.nodelist = nodelist;
  }
}

function rank(roots) {
  walk_rpo(roots, node => {
    for (let edge of node.out_edges) {
      const succ = edge.dest;
      succ.rank = Math.max(succ.rank, node.rank+1);
    }
  });

  let min_rank = 10000;
  let rank_max = 0;
  const ranks = new Map();
  const nodelist = [];
  walk_post_order(roots, node => {
    const rank = node.rank;
    if (!ranks.has(rank))
      ranks.set(rank, []);
    ranks.get(rank).push(node);

    // Create pseudo nodes for connecting ranks
    const new_edges = [];
    for (let edge of node.out_edges) {
      const dest = edge.dest;
      const dest_rank = dest.rank;
      let last = node;
      for (let r = rank+1; r < dest_rank; ++r) {
        const v = make_pseudo_vertex(r);
        if (!ranks.has(r))
          ranks.set(r, []);
        ranks.get(r).push(v);
        nodelist.push(v);
        const out_edges = last === node ? new_edges : last.out_edges;
        const element = last === node ? edge.element : null;
        const e = new Edge(element, last, v, out_edges.length);
        out_edges.push(e);

        v.in_edges.push(e);
        last = v;
      }
      if (last === node) {
        new_edges.push(edge);
      } else {
        const e = new Edge(null, last, dest, last.out_edges.length);
        dest.in_edges.push(e);
        last.out_edges.push(e);
      }
    }
    node.out_edges = new_edges;

    min_rank = Math.min(min_rank, rank);
    rank_max = Math.max(rank_max, rank);
    nodelist.push(node);
  });
  console.assert(min_rank == 0);

  return new Ranking(ranks, rank_max, nodelist);
}

function order(ranking) {
  const ranks = ranking.ranks;
  const rank_max = ranking.rank_max;

  let previous_rank_nodes = ranks.get(0);
  for (let rank = 1; rank <= rank_max; rank++) {
    let idx = 0;
    for (let node of previous_rank_nodes) {
      node.order_idx = idx++;
    }

    const rank_nodes = ranks.get(rank);
    for (let node of rank_nodes) {
      let order_val_sum = 0;
      let n_in_edges = 0;
      for (let edge of node.in_edges) {
        const source = edge.source;
        if (source.rank == undefined || source.rank != (rank-1))
          continue;
        if (source.order_idx != undefined) {
          let order_val = source.order_idx;
          if (edge.out_idx > 0)
            order_val += edge.out_idx / (source.out_edges.length + 1);
          order_val_sum += order_val;
          n_in_edges++;
        }
      }
      node.order_idx = n_in_edges == 0 ? -1 : order_val_sum / n_in_edges;
    }
    rank_nodes.sort((n0, n1) => (n0.order_idx - n1.order_idx));

    previous_rank_nodes = rank_nodes;
  }
}

function initial_placement(ranking, params) {
  const spacing_x = params.spacing_x;
  const spacing_y = params.spacing_y;

  let y = 0;
  for (let rank = 0; rank <= ranking.rank_max; rank++) {
    const rank_nodes = ranking.ranks.get(rank);
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
  const median = len % 2 == 1
    ? arr[(len-1)/2]
    : (arr[len/2 - 1] + arr[len/2]) * 0.5;
  return median;
}

function cycle_up(ranking, params) {
  const spacing_x = params.spacing_x;

  for (let rank = ranking.rank_max - 1; rank >= 0; rank--) {
    const rank_nodes = ranking.ranks.get(rank);
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
    const rank_nodes = ranking.ranks.get(rank);
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
  for (let rank = 0; rank <= ranking.rank_max; rank++) {
    const rank_nodes = ranking.ranks.get(rank);
    if (rank_nodes.length == 0)
      continue;

    const last = rank_nodes[rank_nodes.length - 1];
    const max_x = last.x + last.bbox.x + last.bbox.width;

    for (let node of rank_nodes) {
      if (node.element) {
        const x = node.x;
        const y = node.y;
        node.element.setAttribute("transform", `translate(${x} ${y})`);
      }
      node.bbox.x += node.x;
      node.bbox.y += node.y;
    }
  }
}

function position_edges(ranking, params) {
  const ranks = ranking.ranks;
  const rank_max = ranking.rank_max;

  for (let rank = 0; rank <= rank_max; rank++) {
    const rank_nodes = ranks.get(rank);
    const edges = [];
    const slack_x = 5;

    let min_y = -10000;
    let max_y = 10000;
    for (let node of rank_nodes) {
      const out_y = node.bbox.y + node.bbox.height;

      const spacing_out_x = node.bbox.width / (node.out_edges.length + 1);
      let out_x = node.bbox.x;
      for (let edge of node.out_edges) {
        const dest = edge.dest;
        out_x += spacing_out_x;

        edge.out_x = out_x;
        edge.out_y = out_y;
        edge.in_x = dest.bbox.x + (dest.bbox.width / 2);
        edge.in_y = dest.bbox.y;
        edge.begin = Math.min(edge.out_x, edge.in_x) - slack_x;
        edge.end = Math.max(edge.out_x, edge.in_x) + slack_x;
        edges.push(edge);

        console.assert(edge.out_y < edge.in_y);
        min_y = Math.max(min_y, edge.out_y);
        max_y = Math.min(max_y, edge.in_y);
      }
    }

    if (edges.length == 0)
      continue;

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
      edge.half_height = min_y + (edge.height_level+1-min_height_level)*level_spacing;
    }
  }
}

function draw_edges(ranking, params) {
  position_edges(ranking, params);

  const ranks = ranking.ranks;
  const rank_max = ranking.rank_max;

  for (let rank = 0; rank < rank_max; rank++) {
    const rank_nodes = ranks.get(rank);

    for (let node of rank_nodes) {
      if (!node.element) {
        if (params.debug_draw) {
          const circ = document.createElementNS(SVGNS, "circle");
          circ.setAttribute("cx", node.x);
          circ.setAttribute("cy", node.y);
          circ.setAttribute("r", 3);
          circ.setAttribute("fill", "red");
          params.debug_draw.appendChild(circ);
        }
        continue;
      }

      for (let edge of node.out_edges) {
        const element = edge.element;
        console.assert(element);

        let path_data = `M${edge.out_x},${edge.out_y}`;
        let current_edge = edge;
        while (true) {
          let dest = current_edge.dest;
          const out_x = current_edge.out_x;
          const out_y = current_edge.out_y;
          const in_x = current_edge.in_x;
          const in_y = current_edge.in_y;
          const half_y = current_edge.half_height;

          if (out_x != in_x) {
            path_data += `V${half_y}`;
            path_data += `H${in_x}`;
          }
          path_data += `V${in_y}`;

          // In case of a pseudo node continue drawing...
          if (dest.element == null) {
            console.assert(dest.out_edges.length == 1);
            current_edge = dest.out_edges[0];
          } else {
            break;
          }
        }

        element.setAttribute("d", path_data);
      }
    }
  }
}

export function layout(element, params) {
  const default_params = {
    spacing_x: 15,
    spacing_y: 30,
    debug_draw: element,
  };
  params = default_params;

  const roots = make_vertices(element);
  const ranking = rank(roots);
  order(ranking);
  position(ranking, params);

  draw_edges(ranking, params);

  const debug_log_on_click = true;
  if (debug_log_on_click) {
    for (let node of ranking.nodelist) {
      const element = node.element;
      if (!element)
        continue;
      for (let child of element.querySelectorAll('*')) {
        child.onclick = () => {
          console.log(element);
          console.log(`Id: ${node.id}`);
          console.log(`Rank: ${node.rank}`);
          console.log(`Order Idx: ${node.order_idx}`);
        };
      }
    }
  }
}

export default { layout };
