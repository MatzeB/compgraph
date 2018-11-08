function make_box(node) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  g.appendChild(rect);
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    const attrib = node.attributes[i];
    if (attrib.name == "id" || attrib.name == "class") {
      g.setAttribute(attrib.name, attrib.value);
      node.removeAttribute(attrib.name);
    } else {
      rect.setAttribute(attrib.name, attrib.value);
    }
  }
  node.replaceWith(g);
  g.appendChild(node);

  const i_left = 10;
  const i_right = 10;
  const i_top = 5;
  const i_bottom = 5;

  const bbox = g.getBBox();
  rect.setAttribute("class", "back");
  rect.setAttribute("x", bbox.x - i_left);
  rect.setAttribute("y", bbox.y - i_top);
  rect.setAttribute("width", bbox.width + i_left + i_right);
  rect.setAttribute("height", bbox.height + i_top + i_bottom);
}

function make_ellipse(node) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  g.appendChild(ellipse);
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    const attrib = node.attributes[i];
    if (attrib.name == "id" || attrib.name == "class") {
      g.setAttribute(attrib.name, attrib.value);
      node.removeAttribute(attrib.name);
    } else {
      ellipse.setAttribute(attrib.name, attrib.value);
    }
  }
  node.replaceWith(g);
  g.appendChild(node);

  const add_rx = 5;
  const add_ry = 5;

  const bbox = g.getBBox();
  const inv_sqr2 = 1 / Math.sqrt(2);
  const rx = bbox.width * inv_sqr2 + add_rx;
  const ry = bbox.height * inv_sqr2 + add_ry;
  ellipse.setAttribute("class", "back");
  ellipse.setAttribute("cx", bbox.x + (bbox.width / 2));
  ellipse.setAttribute("cy", bbox.y + (bbox.height / 2));
  ellipse.setAttribute("rx", rx);
  ellipse.setAttribute("ry", ry);
}

class Edge {
  constructor(dest) {
    this.dest = dest;
    this.attributes = new Map();
  }
}

class Vertex {
  constructor(element, width, height, refX, refY) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.refX = refX;
    this.refY = refY;
    this.rank = 0;
    this.out_edges = [];
    this.in_vertices = [];
  }
}

function make_vertex(element) {
  const bbox = element.getBBox();
  return new Vertex(element, bbox.width, bbox.height, -bbox.x, -bbox.y);
}

function make_pseudo_vertex(rank, final_dest) {
  return new Vertex(null, 10, 1, 0, 0);
}

function make_vertices(element, flip) {
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
    const src_node = vertices.get(flip ? dst : src);
    const dst_node = vertices.get(flip ? src : dst);
    dst_node.in_vertices.push(src_node);

    const edge = new Edge(dst_node);
    const input_attributes = new Map();
    for (let i = child.attributes.length - 1; i >= 0; i--) {
      const attrib = child.attributes[i];
      if (attrib.name == "src" || attrib.name == "dst")
        continue;
      edge.attributes.set(attrib.name, attrib.value);
    }
    src_node.out_edges.push(edge);
  }
  // Determine roots.
  const roots = [];
  for (let v of vertices.values()) {
    if (v.out_edges.length == 0)
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
function uwalk_step(node, visited, pre_func, post_func) {
  if (visited.has(node))
    return;
  visited.add(node);
  pre_func(node);
  for (let succ of node.in_vertices) {
    uwalk_step(succ, visited, pre_func, post_func);
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
function uwalk(roots, pre_func, post_func) {
  const visited = new Set();
  for (let node of roots) {
    uwalk_step(node, visited, pre_func, post_func);
  }
}
function uwalk_post_order(roots, func) {
  uwalk(roots, n=>{}, func);
}
function uwalk_rpo(roots, func) {
  const list = [];
  uwalk_post_order(roots, n=>{list.push(n);});
  list.reverse().forEach(func);
}

class Ranking {
  constructor(ranks, min_rank, max_rank) {
    this.ranks = ranks;
    this.min_rank = min_rank;
    this.max_rank = max_rank;
  }
}

function rank(roots) {
  uwalk_rpo(roots, node => {
    for (let pred of node.in_vertices) {
      pred.rank = Math.max(pred.rank, node.rank+1);
    }
  });

  let min_rank = 10000;
  let max_rank = 0;
  const ranks = new Map();
  uwalk_post_order(roots, node => {
    const rank = node.rank;
    if (!ranks.has(rank))
      ranks.set(rank, []);
    ranks.get(rank).push(node);

    // Create pseudo nodes for connecting ranks
    //for (let edge of node.out_edges) {
    //  const dest = egde.dest;
    //  const dest_rank = dest.rank;
    //  while (dest_rank < rank-1) {
    //  }
    //}

    min_rank = Math.min(min_rank, rank);
    max_rank = Math.max(max_rank, rank);
  });

  return new Ranking(ranks, min_rank, max_rank);
}

function order(ranking) {
  const ranks = ranking.ranks;
  const min_rank = ranking.min_rank;
  const max_rank = ranking.max_rank;

  for (let rank = min_rank; rank <= max_rank; rank++) {
    const rank_nodes = ranks.get(rank);
    if (rank > min_rank) {
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

function place(ranking) {
  const ranks = ranking.ranks;
  const min_rank = ranking.min_rank;
  const max_rank = ranking.max_rank;

  const spacing_x = 25;
  const spacing_y = 40;

  let y = 0;
  for (let i = min_rank; i <= max_rank; i++) {
    if (y != 0)
      y += spacing_y;

    const rank_nodes = ranks.get(i).slice().reverse();
    if (rank_nodes.length == 0)
      continue;
    let x = 0;
    let height = 0;
    rank_nodes.forEach(node => {
      if (x > 0)
        x += spacing_x;
      node.x = x;
      node.y = y;
      x += node.width;

      height = Math.max(height, node.height);
    });
    const offset = x / 2.;
    rank_nodes.forEach(node => {
      node.x -= offset;

      const x = node.x + node.refX;
      const y = node.y + node.refY;
      node.element.setAttribute("transform", `translate(${x} ${y})`);
    });

    y += height;
  }
}

function draw_edges(roots) {
  const nodes = [];
  uwalk_post_order(roots, n=>{nodes.push(n);});

  const edges_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  edges_g.setAttribute("class", "edges");
  nodes.forEach(node => {
    const in_y = node.y;

    const spacing_in_x = node.width / (node.out_edges.length + 1);
    let in_x = node.x;
    node.out_edges.forEach(edge => {
      const dest = edge.dest;
      in_x += spacing_in_x;
      const out_x = dest.x + (dest.width / 2);
      const out_y = dest.y + dest.height;
      const half_y = (in_y + out_y) / 2;

      let path_data = `M${in_x},${in_y}`;
      if (in_x != out_x) {
        path_data += `V${half_y}`;
        path_data += `H${out_x}`;
      }
      path_data += `V${out_y}`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      edge.attributes.forEach((value, name) => {
        path.setAttribute(name, value);
      });
      path.setAttribute("d", path_data);
      edges_g.appendChild(path);
    });
  });
  return edges_g;
}

function layout(element, flip=false) {
  const roots = make_vertices(element, flip);
  const ranking = rank(roots);
  order(ranking);
  place(ranking);

  const edges_g = draw_edges(roots);
  element.appendChild(edges_g);
}
