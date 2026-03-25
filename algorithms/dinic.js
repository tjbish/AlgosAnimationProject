// Draws one graph node.
// label names the vertex, x/y give its position, and color distinguishes node roles.
function drawNode(ctx, label, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111111";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
}

// Draws one directed connection in the flow network.
// from/to are node positions, label is the capacity text, and color/width show emphasis.
function drawEdge(ctx, from, to, label, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.fillStyle = "#111111";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(label, (from.x + to.x) / 2, (from.y + to.y) / 2 - 6);
}

export const dinicAlgorithm = {
    name: "Dinic",

    getInitialState() {
        // Initial state before any BFS/augmenting-path work is shown.
        // activeEdges records which edges are currently part of the level graph or blocking flow.
        return {
            title: "Level graph initialization",
            activeEdges: [],
        };
    },

    *createGenerator() {
        // Step 1 result: edges from the source are active in the first level graph snapshot.
        yield {
            title: "Build level graph",
            activeEdges: ["s-a", "s-b"],
        };

        // Step 2 result: highlight one blocking-flow path from source to sink.
        yield {
            title: "Find blocking flow path",
            activeEdges: ["s-a", "a-t"],
        };

        // Step 3 result: show a second augmenting path through the remaining branch.
        yield {
            title: "Augment second path",
            activeEdges: ["s-b", "b-t"],
        };
    },

    draw({ ctx, state }) {
        // nodes stores the vertex layout for the source, intermediate vertices, and sink.
        const nodes = {
            s: { x: 120, y: 250 },
            a: { x: 320, y: 160 },
            b: { x: 320, y: 340 },
            t: { x: 620, y: 250 },
        };
        // edges lists the graph structure as [from, to, capacity label].
        const edges = [
            ["s", "a", "3"],
            ["s", "b", "2"],
            ["a", "t", "2"],
            ["b", "t", "2"],
        ];

        ctx.fillStyle = "#111111";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(state.title, 40, 50);

        edges.forEach(([fromKey, toKey, label]) => {
            // edgeKey is used to check whether the current edge is active in this frame.
            const edgeKey = `${fromKey}-${toKey}`;
            const active = state.activeEdges.includes(edgeKey);

            // Active edges are drawn thicker and in red to show the current flow focus.
            drawEdge(
                ctx,
                nodes[fromKey],
                nodes[toKey],
                label,
                active ? "#c1121f" : "#6c757d",
                active ? 4 : 2
            );
        });

        // Draw nodes after edges so the vertex labels stay readable on top of the graph.
        drawNode(ctx, "s", nodes.s.x, nodes.s.y, "#bde0fe");
        drawNode(ctx, "a", nodes.a.x, nodes.a.y, "#d8f3dc");
        drawNode(ctx, "b", nodes.b.x, nodes.b.y, "#d8f3dc");
        drawNode(ctx, "t", nodes.t.x, nodes.t.y, "#ffd6a5");
    },
};
