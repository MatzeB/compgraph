#!/usr/bin/env python3
# Ad-hoc dot to svg+compgraph converter.
# (Only meant for quick demo, ideally users export to compgraph directly
#  and provide custom CSS, javascript etc.)
import sys
import re

class Token:
    def __init__(self, kind, value=None):
        self.kind = kind
        self.value = value

    def __repr__(self):
        if self.value is None:
            return f"Token({self.kind!r})"
        return f"Token({self.kind!r}, {self.value!r})"

def token(scanner, value):
    return Token(value)

def skip(scanner, value):
    return None

def ident(keywords, scanner, value):
    if value in keywords:
        return Token(value)
    return Token('ident', value)

keywords = set(["digraph", "size", "rankdir", "label"])
rules = [
    (r'[a-zA-Z_][a-zA-Z0-9_]*', lambda s, v: ident(keywords, s, v)),
    (r'->', token),
    (r'/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/', skip),
    (r'\s+', skip),
    (r'"[^"]*"', lambda _, value: Token('string', value)),
    ('[\[\];{}=,]', token),
]

def scan(rules, string):
    scanner = re.Scanner(rules)
    result, rest = scanner.scan(string)
    if rest != "":
        result.append(Token("Error", rest))
    return result

class Vertex:
    def __init__(self, name):
        self.name = name
        self.label = name

class Edge:
    def __init__(self, src, dst):
        self.src = src
        self.dst = dst

vertices = dict()
edges = []

t = Token(None)
tokens = []
had_error = False

def parse_error(msg):
    global had_error
    had_error = True
    sys.stderr.write(f"Error: {msg}\n")

def parse_error_expect(*kinds):
    parse_error(f"Expected {' or '.join(kinds)}, got {t.kind}")

EOF = Token("EOF")
def next():
    global t
    if not tokens:
        t = EOF
    else:
        t = tokens.pop()

def eat(kind):
    assert t.kind == kind
    next()

def expect(kind):
    if t.kind != kind:
        parse_error_expect(kind)
    next()

def match(kind):
    if t.kind != kind:
        return False
    next()
    return True

def parse_name():
    if t.kind == 'ident':
        result = t.value
        next()
    elif t.kind == 'string':
        result = t.value
        next()
    elif t.kind in keywords:
        result = t.kind
        next()
    else:
        parse_error_expect('ident', 'string')
        result = "$invalid$"
    return result

def skip_attr():
    next()
    expect('=')
    expect('string')

def parse_attributes():
    expect('[')
    result = {}
    first = True
    while not match(']') and t.kind not in (EOF, "Error"):
        if not first:
            expect(",")
        first = False
            
        name = parse_name()
        expect('=')
        value = parse_name()
        result[name] = value
    return result

def parse_vertex():
    name = parse_name()

    vertex = vertices.get(name)
    if vertex is None:
        vertex = Vertex(name)
        vertices[name] = vertex
    return vertex

def parse_graph_statement():
    if t.kind in ('size', 'rankdir', 'label'):
        return skip_attr()
    v = parse_vertex()
    edge = None
    if match('->'):
        v2 = parse_vertex()
        edge = Edge(v, v2)
        edges.append(edge)
    if t.kind == '[':
        attrs = parse_attributes()
        label = attrs.get("label")
        if edge is None:
            v.label = label

def parse_digraph():
    expect('digraph')
    name = parse_name()
    expect('{')
    while not match('}'):
        parse_graph_statement()
        expect(';')

def parse_top():
    result = parse_digraph()
    expect('EOF')
    return result

def parse_file(string):
    global tokens
    tokens = scan(rules, string)
    tokens.reverse()
    next()
    return parse_top()

#for t in scan(rules, sys.stdin.read()):
#    print(f"{t.kind} {t.value}")

def write_svg(out):
    out.write(open("header.snippet", "r").read())

    idx = 0
    for v in vertices.values():
        v.id = f"v{idx}"
        idx += 1

    out.write('<g class="layout">\n')
    for v in vertices.values():
        out.write(f'  <text id="{v.id}">{v.label}</text>\n')
    out.write('\n')
    for e in edges:
        out.write(f'  <path class="edge" src="{e.src.id}" dst="{e.dst.id}"/>\n')
    out.write('</g>\n')
    out.write(open("footer.snippet", "r").read())

parse_file(sys.stdin.read())
write_svg(sys.stdout)
