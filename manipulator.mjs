function place_box(box, x, y) {
  box.style.left = x + "px"
  box.style.top = y + "px"
  box.style.display = "block"
}

function svgPosition(svg, event) {
  const CTM = svg.getScreenCTM()
  return {
    x: (event.clientX - CTM.e) / CTM.a,
    y: (event.clientY - CTM.f) / CTM.d
  }
}

export class Manipulator {
  showBoxes(element) {
    const rect = element.getBoundingClientRect()

    const dist_x = 8
    const dist_y = 8
    const boxes = this.selection_boxes
    const x0 = rect.left - dist_x
    const x1 = (rect.left + rect.right) / 2
    const x2 = rect.right + dist_x
    const y0 = rect.top - dist_y
    const y1 = (rect.top + rect.bottom) / 2
    const y2 = rect.bottom + dist_y
    place_box(boxes[0], x0, y0)
    place_box(boxes[1], x1, y0)
    place_box(boxes[2], x2, y0)
    place_box(boxes[3], x0, y1)
    place_box(boxes[4], x2, y1)
    place_box(boxes[5], x0, y2)
    place_box(boxes[6], x1, y2)
    place_box(boxes[7], x2, y2)
  }

  hideBoxes() {
    for (let box of this.selection_boxes) {
      box.style.display = 'none'
    }
  }

  constructor(element) {
    this.selected = null
    this.original_pos = null
    this.drag_begin = null
    this.selection_boxes = []

    for (let i = 0; i < 8; i++) {
      const box = document.createElement('span')
      box.style.position = 'absolute'
      box.style.display = 'block'
      box.style.outline = 'solid 2px #99f'
      box.style.fill = 'black'
      box.style.pointerEvents = 'none'
      box.style.width = "4px"
      box.style.height = "4px"
      document.body.appendChild(box)
      this.selection_boxes.push(box)
    }

    const marker = document.createElement('span')
    marker.style.position = 'absolute';
    marker.style.display = 'block';
    marker.style.outline = 'solid 2px #99f';
    marker.style.pointerEvents = 'none';
    document.body.appendChild(marker);
    this.marker = marker

    element.addEventListener('mousedown', (event) => {
      console.log(`Hello from manipulator`)
      const target = event.target
      if (target.isSameNode(element) || target.isSameNode(this.background)) {
        this.selected = null
        this.hideBoxes()
        return
      }
      this.selected = target
      this.showBoxes(target)
      this.original_pos = target
      this.drag_begin = svgPosition(element, event)
    })

    element.addEventListener('mousemove', (event) => {
      const selected = this.selected
      if (selected == null) {
        return
      }
      this.hideBoxes()
      const pos = svgPosition(element, event)
      const x = pos.x - this.drag_begin.x
      const y = pos.y - this.drag_begin.y
      this.selected.setAttribute('transform', `translate(${x},${y})`)
      //selected.setAttribute("x", x)
      //selected.setAttribute("y", y)
    })

    element.addEventListener('mouseup', (event) => {
      if (this.selected == null) {
        return
      }
      this.showBoxes(this.selected)
      this.selected = null
    })

    // Add invisbile background so we get pointer events everywhere.
    const rect = element.getBoundingClientRect()
    var background = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
    background.setAttribute('width', "100%")
    background.setAttribute('height', "100%")
    background.setAttribute('id', 'background')
    background.style.fill = "none"
    element.insertBefore(background, element.childNodes[0])
    this.background = background
  }
}

export default { Manipulator }
