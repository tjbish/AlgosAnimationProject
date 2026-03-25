// Draws the step title at the top of the canvas.
function drawLabel(ctx, text, x, y) {
    ctx.fillStyle = "#111111";
    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);
}

// Draws one participant in the matching graph.
// label is the person name, x/y is the circle center, and color identifies the side.
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
        // Initial state before any proposals are made.
        // proposer/receiver track the active proposal and matches stores accepted pairs.
        return {
            title: "Stable matching setup",
            proposer: null,
            receiver: null,
            matches: [],
        };
    },

    *createGenerator() {
        // Step 1 result: A proposes to X, so only the temporary proposal is shown.
        yield {
            title: "A proposes to X",
            proposer: "A",
            receiver: "X",
            matches: [],
        };

        // Step 2 result: X accepts A, so the pair becomes a stable tentative match.
        yield {
            title: "X tentatively accepts A",
            proposer: "A",
            receiver: "X",
            matches: [["A", "X"]],
        };

        // Step 3 result: B proposes while the existing A-X match remains in place.
        yield {
            title: "B proposes to Y",
            proposer: "B",
            receiver: "Y",
            matches: [["A", "X"]],
        };

        // Step 4 result: both tentative matches are now shown as accepted pairings.
        yield {
            title: "Y tentatively accepts B",
            proposer: "B",
            receiver: "Y",
            matches: [["A", "X"], ["B", "Y"]],
        };
    },

    draw({ ctx, state }) {
        // left and right store the positions of the two groups being matched.
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

        // Draw confirmed matches first so they appear as solid green pairings.
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

        // Draw the active proposal as a dashed red line to distinguish it from accepted matches.
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

        // Draw the participants last so they stay visible on top of the connecting lines.
        left.forEach((node) => drawPerson(ctx, node.label, node.x, node.y, "#bde0fe"));
        right.forEach((node) => drawPerson(ctx, node.label, node.x, node.y, "#ffd6a5"));
    },
};
