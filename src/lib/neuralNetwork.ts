export interface Neuron {
  x: number;
  y: number;
  radius: number;
  body: string;
}

export interface Synapse {
  from: number;
  to: number;
  controlX: number;
  controlY: number;
  length: number;
  path: string;
}

export interface NeuralGraph {
  nodes: Neuron[];
  edges: Synapse[];
  dendrites: [string, string, string];
}

export interface NetworkHit {
  edge: number;
  t: number;
  x: number;
  y: number;
}

export function createNeuralGraph(width: number, height: number): NeuralGraph {
  let seed = 71821;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const mobile = width < 768;
  const count = Math.min(mobile ? 64 : 190, Math.max(36, Math.round(width * height / (mobile ? 7000 : 10000))));
  const padding = 12;
  const nodes: Neuron[] = [];

  // Best-candidate placement makes an irregular, evenly spread mesh, with no rows.
  for (let index = 0; index < count; index++) {
    let best = { x: 0, y: 0, radius: 2.4 + random() * 2.4, body: "" };
    let bestDistance = -1;
    for (let attempt = 0; attempt < 14; attempt++) {
      const x = padding + random() * Math.max(1, width - padding * 2);
      const y = padding + random() * Math.max(1, height - padding * 2);
      const distance = nodes.reduce((nearest, node) => Math.min(nearest, Math.hypot(x - node.x, y - node.y)), Infinity);
      if (distance > bestDistance) {
        best = { x, y, radius: best.radius, body: "" };
        bestDistance = distance;
      }
    }
    nodes.push(best);
  }

  const pairs: { from: number; to: number; length: number }[] = [];
  nodes.forEach((node, from) => {
    for (let to = from + 1; to < nodes.length; to++) {
      pairs.push({ from, to, length: Math.hypot(node.x - nodes[to].x, node.y - nodes[to].y) });
    }
  });
  pairs.sort((a, b) => a.length - b.length);
  const roots = nodes.map((_, index) => index);
  const degrees = nodes.map(() => 0);
  const edges: Synapse[] = [];
  const root = (node: number): number => {
    while (roots[node] !== node) node = roots[node];
    return node;
  };
  const reach = Math.sqrt(width * height / count) * 1.85;

  for (const pair of pairs) {
    const fromRoot = root(pair.from);
    const toRoot = root(pair.to);
    const joinsComponents = fromRoot !== toRoot;
    if (!joinsComponents && (pair.length > reach || degrees[pair.from] >= 4 || degrees[pair.to] >= 4)) continue;
    roots[fromRoot] = toRoot;
    degrees[pair.from]++;
    degrees[pair.to]++;
    const a = nodes[pair.from];
    const b = nodes[pair.to];
    const curve = (random() - 0.5) * 0.72;
    const controlX = (a.x + b.x) / 2 - (b.y - a.y) * curve;
    const controlY = (a.y + b.y) / 2 + (b.x - a.x) * curve;
    edges.push({ ...pair, controlX, controlY, path: `M ${a.x} ${a.y} Q ${controlX} ${controlY} ${b.x} ${b.y}` });
  }

  // Tapered, recursively forked dendrites give each cell its own organic arbor.
  // Batch the fine branches into three SVG paths to keep the mobile DOM small.
  const dendrites: [string[], string[], string[]] = [[], [], []];
  const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const grow = (x: number, y: number, angle: number, length: number, level: number) => {
    const bend = (random() - 0.5) * length * 0.85;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    const controlX = x + Math.cos(angle) * length * 0.52 - Math.sin(angle) * bend;
    const controlY = y + Math.sin(angle) * length * 0.52 + Math.cos(angle) * bend;
    dendrites[level].push(`M ${point(x, y)} Q ${point(controlX, controlY)} ${point(endX, endY)}`);
    if (level === 2) return;
    const turn = 0.25 + random() * 0.5;
    grow(endX, endY, angle - turn, length * (0.55 + random() * 0.2), level + 1);
    grow(endX, endY, angle + turn * (0.7 + random() * 0.6), length * (0.5 + random() * 0.22), level + 1);
  };

  nodes.forEach((node) => {
    const rotation = random() * Math.PI * 2;
    const arms = 5 + Math.floor(random() * 3);
    for (let arm = 0; arm < arms; arm++) {
      const angle = rotation + arm / arms * Math.PI * 2 + (random() - 0.5) * 0.55;
      grow(node.x, node.y, angle, (mobile ? 18 : 22) + random() * 24, 0);
    }

    // Soft, asymmetric cell bodies replace the old uniform dots.
    const outline = Array.from({ length: 8 }, (_, index) => {
      const angle = rotation + index / 8 * Math.PI * 2;
      const radius = node.radius * (0.7 + random() * 0.8);
      return { x: node.x + Math.cos(angle) * radius, y: node.y + Math.sin(angle) * radius };
    });
    const start = outline[outline.length - 1];
    node.body = `M ${point((start.x + outline[0].x) / 2, (start.y + outline[0].y) / 2)} `;
    outline.forEach((vertex, index) => {
      const next = outline[(index + 1) % outline.length];
      node.body += `Q ${point(vertex.x, vertex.y)} ${point((vertex.x + next.x) / 2, (vertex.y + next.y) / 2)} `;
    });
    node.body += "Z";
  });

  return { nodes, edges, dendrites: [dendrites[0].join(" "), dendrites[1].join(" "), dendrites[2].join(" ")] };
}

export function findNetworkHit(graph: NeuralGraph, x: number, y: number, radius: number): NetworkHit | null {
  let nearest = radius;
  let hit: NetworkHit | null = null;
  graph.edges.forEach((edge, index) => {
    const a = graph.nodes[edge.from];
    const b = graph.nodes[edge.to];
    for (let sample = 0; sample <= 16; sample++) {
      const t = sample / 16;
      const inverse = 1 - t;
      const px = inverse * inverse * a.x + 2 * inverse * t * edge.controlX + t * t * b.x;
      const py = inverse * inverse * a.y + 2 * inverse * t * edge.controlY + t * t * b.y;
      const distance = Math.hypot(px - x, py - y);
      if (distance < nearest) {
        nearest = distance;
        hit = { edge: index, t, x: px, y: py };
      }
    }
  });
  return hit;
}

export function propagateNetwork(graph: NeuralGraph, hit: NetworkHit, reach: number) {
  const source = graph.edges[hit.edge];
  const distances = graph.nodes.map(() => Infinity);
  const visited = new Set<number>();
  const routes: { edge: number; from: number; delay: number }[] = [];
  const parents = new Map<number, { edge: number; from: number }>();
  distances[source.from] = source.length * hit.t;
  distances[source.to] = source.length * (1 - hit.t);

  while (visited.size < graph.nodes.length) {
    let current = -1;
    distances.forEach((distance, node) => {
      if (!visited.has(node) && (current < 0 || distance < distances[current])) current = node;
    });
    if (current < 0 || distances[current] > reach) break;
    visited.add(current);
    const parent = parents.get(current);
    if (parent) routes.push({ ...parent, delay: distances[parent.from] });
    graph.edges.forEach((edge, index) => {
      const next = edge.from === current ? edge.to : edge.to === current ? edge.from : -1;
      if (next < 0 || visited.has(next)) return;
      const distance = distances[current] + edge.length;
      if (distance < distances[next]) {
        distances[next] = distance;
        parents.set(next, { edge: index, from: current });
      }
    });
  }
  return { distances, routes };
}
