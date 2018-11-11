const SVGNS = "http://www.w3.org/2000/svg";

class Edge {
  constructor(source, dest) {
    this.source = source;
    this.dest = dest;
    this.attributes = new Map();
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
      vertices.set(child.getAttribute("id"), vertex);
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

    const edge = new Edge(src_node, dst_node);
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
        const e = new Edge(last, v);
        v.in_edges = e;
        if (last === node) {
          new_edges.push(e);
        } else {
          last.out_edges.push(e);
        }
        last = v;
      }
      if (last === node) {
        new_edges.push(edge);
      } else {
        const e = new Edge(last, dest);
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

  for (let rank = 0; rank <= max_rank; rank++) {
    const rank_nodes = ranks.get(rank);
    if (rank > 0) {
      for (let node of rank_nodes) {
        let preliminary_idx = -1;
        for (let edge of node.out_edges) {
          const dest = edge.dest;
          if (dest.rank == undefined || dest.rank != (rank-1))
            continue;
          if (dest.order_idx != undefined) {
            preliminary_idx = dest.order_idx;
            break;
          }
        }
        node.order_idx = preliminary_idx;
      }
      rank_nodes.sort((n0, n1) => (n1.order_idx - n0.order_idx));
    }

    let idx = 0;
    for (let node of rank_nodes) {
      node.order_idx = idx++;
    }
  }
}

function init_placement(ranking) {
  const spacing_x = 25;
  const spacing_y = 40;

  let y = 0;
  for (let i = 0; i <= ranking.max_rank; i++) {
    const rank_nodes = ranking.ranks.get(i).slice().reverse();
    if (rank_nodes.length == 0)
      continue;
    let x = 0;
    let min_y = 0;
    let max_y = 0;
    rank_nodes.forEach(node => {
      if (x > 0) {
        x += spacing_x;
        x += node.bbox.width / 2;
      }
      node.x = x;
      x += node.bbox.width / 2;

      min_y = Math.min(min_y, node.bbox.y);
      max_y = Math.max(max_y, node.bbox.y + node.bbox.height);
    });

    y += spacing_y;
    y += -min_y;
    console.log(`min_y: ${min_y} max_y: ${max_y} y: ${y}`);

    const offset = x / 2.;
    rank_nodes.forEach(node => {
      node.x -= offset;
      node.y = y;
      node.bbox.x += node.x;
      node.bbox.y += node.y;

      if (node.element) {
        const x = node.x;
        const y = node.y;
        node.element.setAttribute("transform", `translate(${x} ${y})`);
      }
    });

    y += max_y;
  }
}

function place(ranking) {
  init_placement(ranking);
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
      console.log(`circle at ${node.x} ${node.y}`);
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
