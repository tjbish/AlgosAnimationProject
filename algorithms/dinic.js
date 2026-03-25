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
        return {
            title: "Level graph initialization",
            activeEdges: [],
        };
    },

    *createGenerator() {
        yield {
            title: "Build level graph",
            activeEdges: ["s-a", "s-b"],
        };

        yield {
            title: "Find blocking flow path",
            activeEdges: ["s-a", "a-t"],
        };

        yield {
            title: "Augment second path",
            activeEdges: ["s-b", "b-t"],
        };
    },

    draw({ ctx, state }) {
        const nodes = {
            s: { x: 120, y: 250 },
            a: { x: 320, y: 160 },
            b: { x: 320, y: 340 },
            t: { x: 620, y: 250 },
        };
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
            const edgeKey = `${fromKey}-${toKey}`;
            const active = state.activeEdges.includes(edgeKey);

            drawEdge(
                ctx,
                nodes[fromKey],
                nodes[toKey],
                label,
                active ? "#c1121f" : "#6c757d",
                active ? 4 : 2
            );
        });

        drawNode(ctx, "s", nodes.s.x, nodes.s.y, "#bde0fe");
        drawNode(ctx, "a", nodes.a.x, nodes.a.y, "#d8f3dc");
        drawNode(ctx, "b", nodes.b.x, nodes.b.y, "#d8f3dc");
        drawNode(ctx, "t", nodes.t.x, nodes.t.y, "#ffd6a5");
    },
};
