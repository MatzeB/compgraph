CompGraph

# About

This is a javascript library for doing hierarchical graph layout (similar to
GraphViz) in JavaScript.

# Vision

While GraphViz has fantastic layout algorithm, it is limited in the available
output formats and lacks dynamic features. The hops is that with HTML+Javascript we can benefit from that ecosystem:

* Should be able to produce self-contained files by copying the layout
  library. Eliminating installation steps of graphviz/image viewers for users.
* We can delegate graph styling to CSS files.
* Can build dynamic elements with javascript on top: Explore/expand graph by
  clicking, tooltips, highlight selected edges, jump to source/target,
  View/hide layers, ...

# Status

* Some basic layout algorithms implemented
* Have a prototype (sched_proto.html) to show dynamic popups on click
* Playground file to enable/disable layout features and help debugging

# Planned

* Integrate into LLVM and provide as an alternative to graphviz
