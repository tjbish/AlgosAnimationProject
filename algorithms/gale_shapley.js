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


// These names map numeric indices (used internally) to display labels.
const LEFT_NAMES  = ["A", "B", "C"];  // proposers
const RIGHT_NAMES = ["X", "Y", "Z"];  // receivers

// Preference lists: each row is one person's ranking of the other side,

const PROPOSER_PREFS  = [[1, 0, 2], [0, 1, 2], [0, 1, 2]];
const RECEIVER_PREFS  = [[1, 0, 2], [0, 1, 2], [0, 1, 2]];


// Returns true if `newIn` appears before `current` in the receiver's
// preference list, meaning the receiver would prefer newIn over current.
function isBetter(current, newIn, prefList) {
    for (const candidate of prefList) {
        if (candidate === current) return false;  // hit current first → not better
        if (candidate === newIn)   return true;   // hit newIn first  → better
    }
    // Should never reach here with valid input
    console.error("isBetter: neither candidate found in preference list");
    return false;
}


// pairings[receiverIndex] = proposerIndex  (-1 means unmatched)
// nextProposal[proposerIndex] = index into that proposer's preference list
//   pointing at the next receiver they haven't yet proposed to.

export const galeShapleyAlgorithm = {
    name: "Gale-Shapley",

    getInitialState() {
        return {
            title: "Stable matching — ready to begin",
            proposer: null,
            receiver: null,
            matches: [],   // confirmed (tentative) pairs as [leftName, rightName]
        };
    },

    *createGenerator() {
        const n = LEFT_NAMES.length;

        // Deep-copy preference lists so the algorithm can consume them freely.
        const lPrefs = PROPOSER_PREFS.map(row => [...row]);
        const rPrefs = RECEIVER_PREFS.map(row => [...row]);

        // pairings[r] = l means receiver r is tentatively matched to proposer l.
        const pairings = new Array(n).fill(-1);

        // nextProposal[l] = how many proposals l has already made (i.e. the
        // index into lPrefs[l] for the next receiver to approach).
        const nextProposal = new Array(n).fill(0);

        // All proposers start unmatched and will eventually propose.
        const pendingProposers = Array.from({ length: n }, (_, i) => i);

        // Helper: build the matches array from the current pairings for display.
        const buildMatches = () =>
            pairings
                .map((l, r) => (l !== -1 ? [LEFT_NAMES[l], RIGHT_NAMES[r]] : null))
                .filter(Boolean);

        while (pendingProposers.length > 0) {
            // Take the next proposer who still needs a match.
            const l = pendingProposers.shift();
            const lName = LEFT_NAMES[l];

            // Pick the highest-ranked receiver this proposer hasn't tried yet.
            const r = lPrefs[l][nextProposal[l]];
            nextProposal[l]++;
            const rName = RIGHT_NAMES[r];

            // Yield: show the proposal before we know if it will be accepted.
            yield {
                title: `${lName} proposes to ${rName}`,
                proposer: lName,
                receiver: rName,
                matches: buildMatches(),
            };

            if (pairings[r] === -1) {
                // Receiver is free — accept immediately.
                pairings[r] = l;
                yield {
                    title: `${rName} tentatively accepts ${lName}`,
                    proposer: lName,
                    receiver: rName,
                    matches: buildMatches(),
                };
            } else {
                const currentPartner = pairings[r];
                const currentName = LEFT_NAMES[currentPartner];

                if (isBetter(currentPartner, l, rPrefs[r])) {
                    // Receiver prefers the new proposer → swap.
                    pairings[r] = l;
                    yield {
                        title: `${rName} prefers ${lName} and dumps ${currentName}`,
                        proposer: lName,
                        receiver: rName,
                        matches: buildMatches(),
                    };
                    // The dumped proposer goes back into the queue.
                    pendingProposers.push(currentPartner);
                } else {
                    // Receiver prefers their current partner → reject.
                    yield {
                        title: `${rName} rejects ${lName} (keeps ${currentName})`,
                        proposer: lName,
                        receiver: rName,
                        matches: buildMatches(),
                    };
                    // The rejected proposer goes back into the queue to try again.
                    pendingProposers.push(l);
                }
            }
        }

        // Final frame: algorithm complete.
        yield {
            title: "Stable matching complete!",
            proposer: null,
            receiver: null,
            matches: buildMatches(),
        };
    },

    draw({ ctx, canvas, state }) {
        const n = LEFT_NAMES.length;

        // Spread nodes evenly down each side of the canvas.
        const leftX  = 180;
        const rightX = canvas.width - 180;
        const topY   = 120;
        const gap    = (canvas.height - topY * 2) / (n - 1);

        const left  = LEFT_NAMES.map( (label, i) => ({ label, x: leftX,  y: topY + i * gap }));
        const right = RIGHT_NAMES.map((label, i) => ({ label, x: rightX, y: topY + i * gap }));

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        drawLabel(ctx, state.title, 40, 50);

        // Draw column headers so the viewer knows which side is which.
        ctx.fillStyle = "#555555";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Proposers", leftX,  topY - 50);
        ctx.fillText("Receivers", rightX, topY - 50);

        // Draw confirmed matches as solid green lines.
        for (const [fromLabel, toLabel] of state.matches) {
            const fromNode = left.find(n => n.label === fromLabel);
            const toNode   = right.find(n => n.label === toLabel);
            if (!fromNode || !toNode) continue;

            ctx.strokeStyle = "#2d6a4f";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fromNode.x + 24, fromNode.y);
            ctx.lineTo(toNode.x  - 24, toNode.y);
            ctx.stroke();
        }

        // Draw the active proposal as a dashed red line.
        if (state.proposer && state.receiver) {
            const fromNode = left.find(n => n.label === state.proposer);
            const toNode   = right.find(n => n.label === state.receiver);
            if (fromNode && toNode) {
                ctx.strokeStyle = "#c1121f";
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 8]);
                ctx.beginPath();
                ctx.moveTo(fromNode.x + 24, fromNode.y);
                ctx.lineTo(toNode.x  - 24, toNode.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw the participant circles on top of all lines.
        left.forEach( node => drawPerson(ctx, node.label, node.x, node.y, "#bde0fe"));
        right.forEach(node => drawPerson(ctx, node.label, node.x, node.y, "#ffd6a5"));
    },
};