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
  constructor(element) {
    this.element = element;
    const bbox = element.getBBox();
    this.width = bbox.width;
    this.height = bbox.height;
    this.refX = -bbox.x;
    this.refY = -bbox.y;
    this.rank = 0;
    this.out_edges = [];
    this.in_vertices = [];
  }
}

function make_vertices(element, flip) {
  const vertices = new Map();
  // Create vertices.
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.nodeName != "edge" && child.hasAttribute("id")) {
      vertices.set(child.getAttribute("id"), new Vertex(child));
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
  node.out_edges.forEach(pred => {
    walk_step(pred.dest, visited, pre_func, post_func);
  });
  post_func(node);
}
function uwalk_step(node, visited, pre_func, post_func) {
  if (visited.has(node))
    return;
  visited.add(node);
  pre_func(node);
  node.in_vertices.forEach(succ => {
    uwalk_step(succ, visited, pre_func, post_func);
  });
  post_func(node);
}

function walk(roots, pre_func, post_func) {
  const visited = new Set();
  roots.forEach(node => {
    walk_step(node, visited, pre_func, post_func);
  });
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
  roots.forEach(node => {
    uwalk_step(node, visited, pre_func, post_func);
  });
}
function uwalk_rpo(roots, func) {
  const list = [];
  uwalk(roots, n=>{}, n=>{list.push(n);});
  list.reverse().forEach(func);
}

function rank(roots) {
  const nodes = [];
  uwalk_rpo(roots, node => {
    nodes.push(node);
    node.in_vertices.forEach(pred => {
      pred.rank = Math.max(pred.rank, node.rank+1);
    });
  });
  return nodes;
}

function place(roots) {
  const nodes = rank(roots);

  var min_rank = 10000;
  var max_rank = 0;
  const ranks = new Map();
  nodes.forEach(node => {
    const rank = node.rank;
    if (!ranks.has(rank))
      ranks.set(rank, []);
    ranks.get(rank).push(node);

    min_rank = Math.min(min_rank, rank);
    max_rank = Math.max(max_rank, rank);
  });

  const spacing_x = 25;
  const spacing_y = 40;

  var y = 0;
  for (var i = min_rank; i <= max_rank; i++) {
    if (y != 0)
      y += spacing_y;

    const rank_nodes = ranks.get(i).reverse();
    if (rank_nodes.length == 0)
      continue;
    var x = 0;
    var height = 0;
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
    });

    y += height;
  }

  nodes.forEach(node => {
    const x = node.x + node.refX;
    const y = node.y + node.refY;
    node.element.setAttribute("transform", `translate(${x} ${y})`);
  });

  return nodes;
}

function create_edge_elements(nodes) {
  const edges_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  edges_g.setAttribute("class", "edges");
  nodes.forEach(node => {
    const in_y = node.y;

    const spacing_in_x = node.width / (node.out_edges.length + 1);
    var in_x = node.x;
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
  const nodes = place(roots);
  const edges_g = create_edge_elements(nodes);
  element.appendChild(edges_g);
}
