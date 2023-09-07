const SVGNS = 'http://www.w3.org/2000/svg'

export function makeBox(node) {
  const g = document.createElementNS(SVGNS, 'g')

  const rect = document.createElementNS(SVGNS, 'rect')
  g.appendChild(rect)
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    const attrib = node.attributes[i]
    if (attrib.name === 'id' || attrib.name === 'class') {
      g.setAttribute(attrib.name, attrib.value)
      node.removeAttribute(attrib.name)
    } else {
      rect.setAttribute(attrib.name, attrib.value)
    }
  }
  g.classList.add("vertex")
  node.replaceWith(g)
  g.appendChild(node)

  const i_left = 10
  const i_right = 10
  const i_top = 5
  const i_bottom = 5

  const bbox = g.getBBox()
  rect.setAttribute('class', 'back')
  rect.setAttribute('x', bbox.x - i_left)
  rect.setAttribute('y', bbox.y - i_top)
  rect.setAttribute('width', bbox.width + i_left + i_right)
  rect.setAttribute('height', bbox.height + i_top + i_bottom)
}

export function makeEllipse(node) {
  const g = document.createElementNS(SVGNS, 'g')

  const ellipse = document.createElementNS(SVGNS, 'ellipse')
  g.appendChild(ellipse)
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    const attrib = node.attributes[i]
    if (attrib.name === 'id' || attrib.name === 'class') {
      g.setAttribute(attrib.name, attrib.value)
      node.removeAttribute(attrib.name)
    } else {
      ellipse.setAttribute(attrib.name, attrib.value)
    }
  }
  node.replaceWith(g)
  g.appendChild(node)

  const add_rx = 5
  const add_ry = 5

  const bbox = g.getBBox()
  const inv_sqr2 = 1 / Math.sqrt(2)
  const rx = bbox.width * inv_sqr2 + add_rx
  const ry = bbox.height * inv_sqr2 + add_ry
  ellipse.setAttribute('class', 'back')
  ellipse.setAttribute('cx', bbox.x + (bbox.width / 2))
  ellipse.setAttribute('cy', bbox.y + (bbox.height / 2))
  ellipse.setAttribute('rx', rx)
  ellipse.setAttribute('ry', ry)
}

export function vlayout(node) {
  let y = 0;
  for (const child of node.children) {
    if (y != 0) {
      child.setAttribute('transform', `translate(0 ${y})`)
    }
    const bbox = child.getBBox();
    y += bbox.height + 2;
  }
}

export function fit_contents(node) {
  console.assert(node.nodeName == "svg")
  const bbox = node.getBBox()
  node.setAttribute("width", bbox.width)
  node.setAttribute("height", bbox.height)
  node.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
}

export default { makeBox, makeEllipse, vlayout, fit_contents }
