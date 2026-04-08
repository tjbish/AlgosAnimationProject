// Draws the node as a circle with the label inside and level above.
function drawNode(ctx, label, x, y, color, level = null) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111111";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);

    if (level !== null) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "#e63946";
        ctx.fillText(`L=${level}`, x, y - 35);
    }
}

// Draws the directed edge with arrow and flow/capacity.
function drawEdge(ctx, fromNode, toNode, capacity, flow, active, labelBelow = false) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    const radius = 23; // circle radius-1

    const startX = fromNode.x + radius * Math.cos(angle);
    const startY = fromNode.y + radius * Math.sin(angle);
    const endX = toNode.x - radius * Math.cos(angle);
    const endY = toNode.y - radius * Math.sin(angle);

    // Draw the main line
    ctx.strokeStyle = active ? "#e63946" : "#6c757d";
    ctx.lineWidth = active ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw the arrowhead
    const headlen = 12;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(endX, endY);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();

    // Calculate base text position
    const ratio = 0.45; 
    const textBaseX = startX + (endX - startX) * ratio;
    const textBaseY = startY + (endY - startY) * ratio;

    const normalAngle = labelBelow ? angle + Math.PI / 2 : angle - Math.PI / 2;
    const textOffsetDist = 16; 
    const finalTextX = textBaseX + Math.cos(normalAngle) * textOffsetDist;
    const finalTextY = textBaseY + Math.sin(normalAngle) * textOffsetDist;

    const textContent = `${flow}/${capacity}`;

    // Text styling
    ctx.font = active ? "bold 14px Arial" : "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Draw text outline
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 6; 
    ctx.strokeText(textContent, finalTextX, finalTextY); 
    // Draw actual text
    ctx.fillStyle = active ? "#e63946" : "#111111";
    ctx.fillText(textContent, finalTextX, finalTextY);
}

// Generate a fixed graph with predetermined capacities to show multiple cycles and augmenting paths.
function generateFixedNetwork() {
    const nodes = {
        s: { x: 250, y: 250, color: "#bde0fe" }, // Source
        a: { x: 500, y: 100, color: "#d8f3dc" }, // Top row, Col 1
        b: { x: 500, y: 250, color: "#d8f3dc" }, // Middle row, Col 1
        c: { x: 500, y: 400, color: "#d8f3dc" }, // Bottom row, Col 1
        d: { x: 800, y: 100, color: "#d8f3dc" }, // Top row, Col 2
        e: { x: 800, y: 250, color: "#d8f3dc" }, // Middle row, Col 2
        f: { x: 800, y: 400, color: "#d8f3dc" }, // Bottom row, Col 2
        t: { x: 1050, y: 250, color: "#ffd6a5" }, // Sink
    };

    const edges = [
        { from: "s", to: "a", cap: 10 },        
        { from: "s", to: "b", cap: 2 },          
        { from: "s", to: "c", cap: 12, labelBelow: true }, 

        { from: "a", to: "d", cap: 10 },        
        { from: "b", to: "d", cap: 5 },          
        { from: "b", to: "e", cap: 10 },        
        { from: "c", to: "f", cap: 12, labelBelow: true }, 

        { from: "d", to: "t", cap: 10 },         
        { from: "e", to: "t", cap: 10 },         
        { from: "f", to: "b", cap: 10, labelBelow: true }, 
        { from: "f", to: "t", cap: 2, labelBelow: true },  
    ];

    return { nodes, edges };
}

// Generate graphs with random capacities for each edge
function generateRandomNetwork() {
    const nodes = {
        s: { x: 250, y: 250, color: "#bde0fe" }, // Source
        a: { x: 500, y: 100, color: "#d8f3dc" }, // Top row, Col 1
        b: { x: 500, y: 250, color: "#d8f3dc" }, // Middle row, Col 1
        c: { x: 500, y: 400, color: "#d8f3dc" }, // Bottom row, Col 1
        d: { x: 800, y: 100, color: "#d8f3dc" }, // Top row, Col 2
        e: { x: 800, y: 250, color: "#d8f3dc" }, // Middle row, Col 2
        f: { x: 800, y: 400, color: "#d8f3dc" }, // Bottom row, Col 2
        t: { x: 1050, y: 250, color: "#ffd6a5" }, // Sink
    };


    const randCap = () => Math.floor(Math.random() * 8) + 2;

    const edges = [
        { from: "s", to: "a", cap: randCap() },
        { from: "s", to: "b", cap: randCap() },
        { from: "s", to: "c", cap: randCap(), labelBelow: true },

        { from: "a", to: "d", cap: randCap() },
        { from: "b", to: "d", cap: randCap() },
        { from: "b", to: "e", cap: randCap() },
        { from: "c", to: "f", cap: randCap(), labelBelow: true },

        { from: "d", to: "t", cap: randCap() },
        { from: "e", to: "t", cap: randCap() },
        { from: "f", to: "b", cap: randCap(), labelBelow: true },
        { from: "f", to: "t", cap: randCap(), labelBelow: true },
    ];

    return { nodes, edges };
}

let currentNetwork = null;

// export the dinic's algorithm so it can be imported and used elsewhere
export const dinicAlgorithm = {
    name: "Dinic",
    currentNetwork: generateFixedNetwork(),

    getRandomState() {
        currentNetwork = generateRandomNetwork();
        return this.getInitialState();
    },

    getInitialState() {
        currentNetwork = currentNetwork || generateFixedNetwork();

        const flows = {};
        const levels = {};
        
        Object.keys(currentNetwork.nodes).forEach(k => levels[k] = null);
        currentNetwork.edges.forEach(e => flows[`${e.from}-${e.to}`] = 0);

        return {
            title: "Initial Flow Network",
            activeEdges: [],
            flows,
            levels,
            nodes: currentNetwork.nodes,
            edges: currentNetwork.edges
        };
    },

    *createGenerator() {
        if (!currentNetwork) currentNetwork = generateRandomNetwork();
        
        const { nodes, edges } = currentNetwork;
        let flows = {};
        edges.forEach(e => flows[`${e.from}-${e.to}`] = 0);
        let maxFlow = 0;

        const adj = {};
        Object.keys(nodes).forEach(n => adj[n] = []);
        edges.forEach(e => {
            adj[e.from].push(e.to);
            adj[e.to].push(e.from);
        });

        const getResCap = (u, v) => {
            let forward = edges.find(e => e.from === u && e.to === v);
            if (forward) return forward.cap - flows[`${u}-${v}`];
            let backward = edges.find(e => e.from === v && e.to === u);
            if (backward) return flows[`${v}-${u}`];
            return 0;
        };

        const addFlow = (u, v, amount) => {
            let forward = edges.find(e => e.from === u && e.to === v);
            if (forward) flows[`${u}-${v}`] += amount;
            else flows[`${v}-${u}`] -= amount;
        };

        while (true) {
            let levels = {};
            Object.keys(nodes).forEach(n => levels[n] = null);
            levels['s'] = 0;
            let q = ['s'];

            while (q.length > 0) {
                let curr = q.shift();
                for (let next of adj[curr]) {
                    if (levels[next] === null && getResCap(curr, next) > 0) {
                        levels[next] = levels[curr] + 1;
                        q.push(next);
                    }
                }
            }

            yield {
                title: "Phase 1: BFS builds the Level Graph",
                activeEdges: [], flows: { ...flows }, levels: { ...levels }, nodes, edges
            };

            if (levels['t'] === null) {
                yield {
                    title: `Complete. Sink Unreachable. Max Flow = ${maxFlow}`,
                    activeEdges: [], flows: { ...flows }, levels: { ...levels }, nodes, edges
                };
                break;
            }

            let ptr = {};
            Object.keys(nodes).forEach(n => ptr[n] = 0);

            const dfs = (u, pushed, path) => {
                if (pushed === 0) return 0;
                if (u === 't') return pushed;

                for (; ptr[u] < adj[u].length; ptr[u]++) {
                    let v = adj[u][ptr[u]];
                    if (levels[u] + 1 !== levels[v]) continue;
                    
                    let resCap = getResCap(u, v);
                    if (resCap === 0) continue;

                    let push = dfs(v, Math.min(pushed, resCap), path);
                    if (push > 0) {
                        path.push({ u, v }); 
                        addFlow(u, v, push);
                        return push;
                    }
                }
                return 0;
            };

            while (true) {
                let pathSteps = [];
                let pushed = dfs('s', Infinity, pathSteps);
                if (pushed === 0) break;
                
                maxFlow += pushed;
                pathSteps.reverse();

                let activeEdges = pathSteps.map(p => {
                    let forward = edges.find(e => e.from === p.u && e.to === p.v);
                    return forward ? `${p.u}-${p.v}` : `${p.v}-${p.u}`;
                });

                yield {
                    title: `Phase 2 DFS: Pushed ${pushed} units of flow`,
                    activeEdges, flows: { ...flows }, levels: { ...levels }, nodes, edges
                };
            }
        }
    },

    draw({ ctx, state }) {
        ctx.fillStyle = "#111111";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(state.title, 40, 50);

        if (state.edges) {
            state.edges.forEach(({ from, to, cap, labelBelow }) => {
                const edgeKey = `${from}-${to}`;
                const isActive = state.activeEdges.includes(edgeKey);
                const currentFlow = state.flows[edgeKey] || 0;
                
                drawEdge(ctx, state.nodes[from], state.nodes[to], cap, currentFlow, isActive, labelBelow);
            });
        }

        if (state.nodes) {
            Object.keys(state.nodes).forEach((key) => {
                const node = state.nodes[key];
                const level = state.levels[key];
                drawNode(ctx, key, node.x, node.y, node.color, level);
            });
        }
    },
};
