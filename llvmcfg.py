#!/usr/bin/env python3
import re
import sys

def func_begin(out, name):
    out.write(f"\n<h2>{name}</h2>\n")
    out.write("<svg width=\"800\" height=\"800\" viewBox=\"0 0 800 800\">\n")
    out.write("<g class=\"layout\">\n")

def func_end(out, nodes, edges, branches):
    for n in nodes:
        branch_insn = branches.get(n)
        if branch_insn is not None:
            out.write(f"  <g id=\"{n}\" class=\"vlayout\">\n")
            out.write(f"    <text>{n}:</text>\n")
            out.write(f"    <text>&nbsp;&nbsp;{branch_insn}</text>\n")
            out.write(f"  </g>\n")
        else:
            out.write(f"  <text id=\"{n}\">{n}</text>\n")
    out.write("\n")
    for e in edges:
        out.write(f"  <path class=\"edge\" src=\"{e[0]}\" dst=\"{e[1]}\"/>\n")

    out.write("</g>\n")
    out.write("</svg>\n")

def translate(out, fp):
    DEFINE_FUNC = re.compile(r"^define .*@(?P<funcname>[^(]+)\(")
    BLOCK_BEGIN = re.compile(r"^(?P<blockname>[a-zA-Z0-9_.]+):")
    BRANCH = re.compile(r"^\s+(?P<insn>br|invoke) (?P<branchops>.*)")
    INVOKE_CONT = re.compile(r"^\s+to label.*unwind.*")
    LABEL = re.compile(r"label %(?P<label>[a-zA-Z0-9_.]+)")
    TERMINATOR = re.compile(f"^\s+(?P<insn>ret|unreachable)")
    current_func = None
    current_block = None
    nodes = set()
    edges = []
    branches = dict()
    for line in fp:
        m = DEFINE_FUNC.match(line)
        if m:
            if current_func is not None:
                func_end(out, nodes, edges, branches)
                nodes.clear()
                edges.clear()
            current_func = m.group("funcname")
            current_block = "0"
            func_begin(out, current_func)
            continue
        m = BLOCK_BEGIN.match(line)
        if m:
            current_block = m.group("blockname")
            nodes.add(current_block)
            continue
        m = BRANCH.match(line)
        m2 = INVOKE_CONT.match(line)
        if m or m2:
            if current_block is None:
                sys.stderr.write("Branch appears to be outside basic block?")
                continue
            if m:
                branches[current_block] = m.group("insn")
            elif m2:
                branches[current_block] = "invoke"
            for m in LABEL.finditer(line):
                target = m.group("label")
                nodes.add(target)
                edges.append((current_block, target))
        m = TERMINATOR.match(line)
        if m:
            branches[current_block] = m.group("insn")
        # TODO:
        #  - Does not work for unnamed/numbered blocks
        #  - No support for switch
        #  - No support for indirectbr / computed goto etc.

    if current_func is not None:
        func_end(out, nodes, edges, branches)

def main():
    filename = sys.argv[1]
    out = sys.stdout

    out.write(open("header.snippet", "r").read())

    with open(filename) as fp:
        translate(out, fp)

    out.write(open("llvmcfg.footer.snippet", "r").read())


if __name__ == "__main__":
    main()
