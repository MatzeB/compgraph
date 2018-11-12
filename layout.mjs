const SVGNS = "http://www.w3.org/2000/svg";

class Edge {
  constructor(source, dest, out_idx) {
    this.source = source;
    this.dest = dest;
    this.attributes = new Map();
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
    if (child.nodeName != "edge" && child.hasAttribute("id")) {
      const vertex = make_vertex(child);
      const id = child.getAttribute("id");
      vertex.id = id; // only for debugging
      vertices.set(id, vertex);
    }
  }
  // Create edges.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.nodeName != 'edge')
      continue;
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

    const edge = new Edge(src_node, dst_node, src_node.out_edges.length);
    const input_attributes = new Map();
    for (let i = child.attributes.length - 1; i >= 0; i--) {
      const attrib = child.attributes[i];
      if (attrib.name == "src" || attrib.name == "dst")
        continue;
      edge.attributes.set(attrib.name, attrib.value);
    }
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
  constructor(ranks, max_rank, nodelist) {
    this.ranks = ranks;
    this.max_rank = max_rank;
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
  let max_rank = 0;
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
        const e = new Edge(last, v, out_edges.length);
        out_edges.push(e);

        v.in_edges.push(e);
        last = v;
      }
      if (last === node) {
        new_edges.push(edge);
      } else {
        const e = new Edge(last, dest, last.out_edges.length);
        dest.in_edges.push(e);
        last.out_edges.push(e);
      }
    }
    node.out_edges = new_edges;

    min_rank = Math.min(min_rank, rank);
    max_rank = Math.max(max_rank, rank);
    nodelist.push(node);
  });
  console.assert(min_rank == 0);

  return new Ranking(ranks, max_rank, nodelist);
}

function order(ranking) {
  const ranks = ranking.ranks;
  const max_rank = ranking.max_rank;

  let previous_rank_nodes = ranks.get(0);
  for (let rank = 1; rank <= max_rank; rank++) {
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

function init_placement(ranking, params) {
  const spacing_x = params.spacing_x;
  const spacing_y = params.spacing_y;

  let y = 0;
  for (let rank = 0; rank <= ranking.max_rank; rank++) {
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

  for (let rank = ranking.max_rank - 1; rank >= 0; rank--) {
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
        console.log(`Edge from: ${source.id} to: ${dest.id} src_node_x ${source.x} src_bbox_x ${source.bbox.x} src_bbox_w ${source.bbox.width} dst_node_x ${dest.x} dst_bbox_x ${dest.bbox.x} dst_bbox_w ${dest.bbox.width}`);
        console.log(`dest_x ${dest_x} source_offset ${source_offset} => ${x}`);
        x_pos.push(x);
      }
      const median_x = x_pos.length == 0 ? node.x : median(x_pos);

      if (!last_node) {
        node.x = median_x;
      } else {
        const bbox = last_node.bbox;
        const last_right = last_node.x + bbox.x + bbox.width;
        const min_x = last_right + spacing_x - node.bbox.x;
        node.x = Math.max(min_x, median_x);
      }
      last_node = node;
    }
  }
}

function cycle_down(ranking, params) {
  const max_rank = ranking.max_rank;
  const spacing_x = params.spacing_x;

  for (let rank = 1; rank <= max_rank; rank++) {
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
        console.log(`Edge from: ${source.id} to: ${dest.id} src_node_x ${source.x} src_bbox_x ${source.bbox.x} src_bbox_w ${source.bbox.width} dst_node_x ${dest.x} dst_bbox_x ${dest.bbox.x} dst_bbox_w ${dest.bbox.width}`);
        console.log(`source_x ${source_x} dest_offset ${dest_offset} => ${x}`);
        x_pos.push(x);
      }
      const median_x = x_pos.length == 0 ? node.x : median(x_pos);

      console.log(`Median: ${median_x}`);

      if (!last_node) {
        node.x = median_x;
      } else {
        const bbox = last_node.bbox;
        const last_right = last_node.x + bbox.x + bbox.width;
        const min_x = last_right + spacing_x - node.bbox.x;
        node.x = Math.max(min_x, median_x);
      }
      last_node = node;
    }
  }
}

function place(ranking) {
  const params = {
    spacing_x: 15,
    spacing_y: 30,
  };

  init_placement(ranking, params);
  for (let i = 0; i < 3; ++i) {
    cycle_up(ranking, params);
    cycle_down(ranking, params);
  }

  // Finalize
  let y = 0;
  for (let rank = 0; rank <= ranking.max_rank; rank++) {
    const rank_nodes = ranking.ranks.get(rank);
    if (rank_nodes.length == 0)
      continue;

    const last = rank_nodes[rank_nodes.length - 1];
    const max_x = last.x + last.bbox.x + last.bbox.width;
    //const offset = max_x / 2.;
    //const offset = 0;

    for (let node of rank_nodes) {
      //node.x -= offset;

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

function draw_edges(nodes) {
  const edges_g = document.createElementNS(SVGNS, "g");
  edges_g.setAttribute("class", "edges");
  for (let node of nodes) {
    if (!node.element) {
      const circ = document.createElementNS(SVGNS, "circle");
      circ.setAttribute("cx", node.x);
      circ.setAttribute("cy", node.y);
      circ.setAttribute("r", 3);
      circ.setAttribute("fill", "red");
      edges_g.appendChild(circ);
    }

    const out_y = node.bbox.y + node.bbox.height;

    const spacing_out_x = node.bbox.width / (node.out_edges.length + 1);
    let out_x = node.bbox.x;
    for (let edge of node.out_edges) {
      const dest = edge.dest;
      console.assert(dest.rank == node.rank+1);
      out_x += spacing_out_x;
      const in_x = dest.bbox.x + (dest.bbox.width / 2);
      const in_y = dest.bbox.y;
      const half_y = (out_y + in_y) / 2;

      let path_data = `M${out_x},${out_y}`;
      if (out_x != in_x) {
        path_data += `V${half_y}`;
        path_data += `H${in_x}`;
      }
      path_data += `V${in_y}`;
      const path = document.createElementNS(SVGNS, "path");
      edge.attributes.forEach((value, name) => {
        path.setAttribute(name, value);
      });
      path.setAttribute("d", path_data);
      edges_g.appendChild(path);
    }
  }
  return edges_g;
}

export function layout(element) {
  const roots = make_vertices(element);
  const ranking = rank(roots);
  order(ranking);
  place(ranking);

  const edges_g = draw_edges(ranking.nodelist);
  element.appendChild(edges_g);
}

export default { layout };
