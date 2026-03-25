function drawLabel(ctx, text, x, y) {
    ctx.fillStyle = "#111111";
    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);
}

function drawPerson(ctx, label, x, y, color) {
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

export const galeShapleyAlgorithm = {
    name: "Gale-Shapley",

    getInitialState() {
        return {
            title: "Stable matching setup",
            proposer: null,
            receiver: null,
            matches: [],
        };
    },

    *createGenerator() {
        yield {
            title: "A proposes to X",
            proposer: "A",
            receiver: "X",
            matches: [],
        };

        yield {
            title: "X tentatively accepts A",
            proposer: "A",
            receiver: "X",
            matches: [["A", "X"]],
        };

        yield {
            title: "B proposes to Y",
            proposer: "B",
            receiver: "Y",
            matches: [["A", "X"]],
        };

        yield {
            title: "Y tentatively accepts B",
            proposer: "B",
            receiver: "Y",
            matches: [["A", "X"], ["B", "Y"]],
        };
    },

    draw({ ctx, state }) {
        const left = [
            { label: "A", x: 180, y: 170 },
            { label: "B", x: 180, y: 290 },
        ];
        const right = [
            { label: "X", x: 620, y: 170 },
            { label: "Y", x: 620, y: 290 },
        ];

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        drawLabel(ctx, state.title, 40, 50);

        for (const [from, to] of state.matches) {
            const fromNode = left.find((node) => node.label === from);
            const toNode = right.find((node) => node.label === to);

            if (!fromNode || !toNode) {
                continue;
            }

            ctx.strokeStyle = "#2d6a4f";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fromNode.x + 24, fromNode.y);
            ctx.lineTo(toNode.x - 24, toNode.y);
            ctx.stroke();
        }

        if (state.proposer && state.receiver) {
            const fromNode = left.find((node) => node.label === state.proposer);
            const toNode = right.find((node) => node.label === state.receiver);

            if (fromNode && toNode) {
                ctx.strokeStyle = "#c1121f";
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 8]);
                ctx.beginPath();
                ctx.moveTo(fromNode.x + 24, fromNode.y);
                ctx.lineTo(toNode.x - 24, toNode.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        left.forEach((node) => drawPerson(ctx, node.label, node.x, node.y, "#bde0fe"));
        right.forEach((node) => drawPerson(ctx, node.label, node.x, node.y, "#ffd6a5"));
    },
};
