// Draws the step title at the top of the canvas.
function drawLabel(ctx, text, x, y) {
    ctx.fillStyle = "#111111";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y);
}

// Draws one participant in the matching graph.
function drawPerson(ctx, label, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111111";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
}

// Draw a vertical divider between animation and tables.
function drawDivider(ctx, x, canvasHeight) {
    ctx.save();
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, canvasHeight - 20);
    ctx.stroke();
    ctx.restore();
}

// Draw preference table with optional highlight and crossed-out cells.
function drawPreferenceTable(
    ctx,
    title,
    rowNames,
    prefs,
    colLabels,
    startX,
    startY,
    highlightCell = null,
    crossedOutCells = []
) {
    const n = rowNames.length;

    // Make the table noticeably larger while still scaling down a bit for bigger n.
    const rowHeight = n <= 4 ? 42 : n <= 6 ? 38 : 34;
    const firstColWidth = n <= 6 ? 68 : 60;
    const colWidth = n <= 4 ? 56 : n <= 6 ? 50 : 44;
    const titleFont = n <= 6 ? "24px Arial" : "21px Arial";
    const cellFont = n <= 6 ? "18px Arial" : "16px Arial";

    ctx.save();

    ctx.fillStyle = "#111111";
    ctx.font = titleFont;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(title, startX, startY);

    const tableTop = startY + 18;

    // Header row
    ctx.font = cellFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 1.4;

    ctx.strokeRect(startX, tableTop, firstColWidth, rowHeight);

    for (let c = 0; c < colLabels.length; c++) {
        const x = startX + firstColWidth + c * colWidth;
        ctx.strokeRect(x, tableTop, colWidth, rowHeight);
        ctx.fillStyle = "#111111";
        ctx.fillText(`#${c + 1}`, x + colWidth / 2, tableTop + rowHeight / 2);
    }

    // Data rows
    for (let r = 0; r < rowNames.length; r++) {
        const y = tableTop + rowHeight + r * rowHeight;

        ctx.strokeRect(startX, y, firstColWidth, rowHeight);
        ctx.fillStyle = "#111111";
        ctx.fillText(rowNames[r], startX + firstColWidth / 2, y + rowHeight / 2);

        for (let c = 0; c < prefs[r].length; c++) {
            const x = startX + firstColWidth + c * colWidth;
            const label = colLabels[prefs[r][c]];

            const isHighlighted =
                highlightCell &&
                highlightCell.rowLabel === rowNames[r] &&
                highlightCell.valueLabel === label;

            if (isHighlighted) {
                ctx.fillStyle = highlightCell.color || "#ffe599";
                ctx.fillRect(x, y, colWidth, rowHeight);
            }

            ctx.strokeStyle = "#444444";
            ctx.strokeRect(x, y, colWidth, rowHeight);

            ctx.fillStyle = "#111111";
            ctx.fillText(label, x + colWidth / 2, y + rowHeight / 2);

            const isCrossedOut = crossedOutCells.some(
                (cell) =>
                    cell.rowLabel === rowNames[r] &&
                    cell.valueLabel === label
            );

            if (isCrossedOut) {
                ctx.save();
                ctx.strokeStyle = "#c1121f";
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(x + 6, y + 6);
                ctx.lineTo(x + colWidth - 6, y + rowHeight - 6);
                ctx.moveTo(x + colWidth - 6, y + 6);
                ctx.lineTo(x + 6, y + rowHeight - 6);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    ctx.restore();
}

function isBetter(current, newIn, prefList) {
    for (const candidate of prefList) {
        if (candidate === current) return false;
        if (candidate === newIn) return true;
    }
    console.error("isBetter: neither candidate found in preference list");
    return false;
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---------- Dynamic node count support ----------

let nodeCount = 3;
let controlsInitialized = false;

// Current scenario data for this run.
// These are regenerated in getInitialState(), which works with your unchanged main.js.
let currentLeftNames = null;
let currentRightNames = null;
let currentProposerPrefs = null;
let currentReceiverPrefs = null;
let currentScenarioName = "";

function getLeftNames() {
    return currentLeftNames || ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, nodeCount);
}

function getRightNames() {
    return currentRightNames || ["X", "Y", "Z", "U", "V", "W", "P", "Q"].slice(0, nodeCount);
}

function makeIdentityPrefs() {
    return Array.from({ length: nodeCount }, () =>
        Array.from({ length: nodeCount }, (_, i) => i)
    );
}

function makeReversePrefs() {
    return Array.from({ length: nodeCount }, () =>
        Array.from({ length: nodeCount }, (_, i) => nodeCount - 1 - i)
    );
}

function makeRandomPrefs() {
    return Array.from({ length: nodeCount }, () =>
        shuffle(Array.from({ length: nodeCount }, (_, i) => i))
    );
}

function makeRotatingPrefs() {
    return Array.from({ length: nodeCount }, (_, i) =>
        Array.from({ length: nodeCount }, (_, j) => (i + j) % nodeCount)
    );
}

function makeReverseRotatingPrefs() {
    return Array.from({ length: nodeCount }, (_, i) =>
        Array.from({ length: nodeCount }, (_, j) => (i - j + nodeCount) % nodeCount)
    );
}

function buildScenario() {
    currentLeftNames = ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, nodeCount);
    currentRightNames = ["X", "Y", "Z", "U", "V", "W", "P", "Q"].slice(0, nodeCount);

    const scenarios = [
        {
            name: "Aligned",
            proposerPrefs: makeIdentityPrefs(),
            receiverPrefs: makeIdentityPrefs(),
        },
        {
            name: "Reverse",
            proposerPrefs: makeReversePrefs(),
            receiverPrefs: makeReversePrefs(),
        },
        {
            name: "Proposer-Advantage",
            proposerPrefs: makeIdentityPrefs(),
            receiverPrefs: makeReversePrefs(),
        },
        {
            name: "Receiver-Advantage",
            proposerPrefs: makeReversePrefs(),
            receiverPrefs: makeIdentityPrefs(),
        },
        {
            name: "Rotating Conflict",
            proposerPrefs: makeRotatingPrefs(),
            receiverPrefs: makeReverseRotatingPrefs(),
        },
        {
            name: "Random",
            proposerPrefs: makeRandomPrefs(),
            receiverPrefs: makeRandomPrefs(),
        },
    ];

    const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];

    currentScenarioName = chosen.name;
    currentProposerPrefs = chosen.proposerPrefs;
    currentReceiverPrefs = chosen.receiverPrefs;
}

function ensureNodeControls() {
    if (controlsInitialized) return;
    controlsInitialized = true;

    const controls = document.getElementById("controls");
    const algorithmSelect = document.getElementById("algorithmSelect");
    if (!controls || !algorithmSelect) return;

    const wrapper = document.createElement("span");
    wrapper.id = "galeNodeControls";
    wrapper.style.marginLeft = "14px";
    wrapper.style.display = "none";

    const label = document.createElement("label");
    label.htmlFor = "galeNodeCount";
    label.textContent = "Nodes:";
    label.style.marginRight = "6px";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "galeNodeCount";
    slider.min = "1";
    slider.max = "8";
    slider.value = String(nodeCount);
    slider.style.verticalAlign = "middle";

    const value = document.createElement("span");
    value.id = "galeNodeCountValue";
    value.textContent = String(nodeCount);
    value.style.marginLeft = "6px";

    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    wrapper.appendChild(value);
    controls.appendChild(wrapper);

    function updateVisibility() {
        wrapper.style.display = algorithmSelect.value === "gale" ? "inline-block" : "none";
    }

    slider.addEventListener("input", () => {
        nodeCount = Number(slider.value);
        value.textContent = String(nodeCount);

        if (algorithmSelect.value === "gale") {
            document.getElementById("resetBtn")?.click();
        }
    });

    algorithmSelect.addEventListener("change", updateVisibility);
    updateVisibility();
}

ensureNodeControls();

// ---------- Gale-Shapley algorithm ----------

export const galeShapleyAlgorithm = {
    name: "Gale-Shapley",

    getInitialState() {
        buildScenario();

        return {
            title: `Stable matching — ${currentScenarioName} scenario`,
            proposer: null,
            receiver: null,
            matches: [],
            rejectedPairs: [],
            scenarioName: currentScenarioName,
        };
    },

    *createGenerator() {
        const LEFT_NAMES = getLeftNames();
        const RIGHT_NAMES = getRightNames();
        const PROPOSER_PREFS = currentProposerPrefs;
        const RECEIVER_PREFS = currentReceiverPrefs;

        const n = LEFT_NAMES.length;

        const lPrefs = PROPOSER_PREFS.map(row => [...row]);
        const rPrefs = RECEIVER_PREFS.map(row => [...row]);

        const pairings = new Array(n).fill(-1);
        const nextProposal = new Array(n).fill(0);
        const rejectedPairs = [];
        const pendingProposers = Array.from({ length: n }, (_, i) => i);

        const buildMatches = () =>
            pairings
                .map((l, r) => (l !== -1 ? [LEFT_NAMES[l], RIGHT_NAMES[r]] : null))
                .filter(Boolean);

        while (pendingProposers.length > 0) {
            const l = pendingProposers.shift();
            const lName = LEFT_NAMES[l];

            const r = lPrefs[l][nextProposal[l]];
            nextProposal[l]++;
            const rName = RIGHT_NAMES[r];

            yield {
                title: `${currentScenarioName}: ${lName} proposes to ${rName}`,
                proposer: lName,
                receiver: rName,
                matches: buildMatches(),
                rejectedPairs: [...rejectedPairs],
                scenarioName: currentScenarioName,
            };

            if (pairings[r] === -1) {
                pairings[r] = l;

                yield {
                    title: `${currentScenarioName}: ${rName} tentatively accepts ${lName}`,
                    proposer: lName,
                    receiver: rName,
                    matches: buildMatches(),
                    rejectedPairs: [...rejectedPairs],
                    scenarioName: currentScenarioName,
                };
            } else {
                const currentPartner = pairings[r];
                const currentName = LEFT_NAMES[currentPartner];

                if (isBetter(currentPartner, l, rPrefs[r])) {
                    pairings[r] = l;

                    yield {
                        title: `${currentScenarioName}: ${rName} prefers ${lName} and dumps ${currentName}`,
                        proposer: lName,
                        receiver: rName,
                        matches: buildMatches(),
                        rejectedPairs: [...rejectedPairs],
                        scenarioName: currentScenarioName,
                    };

                    pendingProposers.push(currentPartner);
                } else {
                    rejectedPairs.push([lName, rName]);

                    yield {
                        title: `${currentScenarioName}: ${rName} rejects ${lName} (keeps ${currentName})`,
                        proposer: lName,
                        receiver: rName,
                        matches: buildMatches(),
                        rejectedPairs: [...rejectedPairs],
                        scenarioName: currentScenarioName,
                    };

                    pendingProposers.push(l);
                }
            }
        }

        yield {
            title: `${currentScenarioName}: stable matching complete!`,
            proposer: null,
            receiver: null,
            matches: buildMatches(),
            rejectedPairs: [...rejectedPairs],
            scenarioName: currentScenarioName,
        };
    },

    draw({ ctx, canvas, state }) {
        const LEFT_NAMES = getLeftNames();
        const RIGHT_NAMES = getRightNames();
        const PROPOSER_PREFS = currentProposerPrefs;

        const n = LEFT_NAMES.length;

        const dividerX = 700;

        const leftX = 160;
        const rightX = 520;
        const topY = 120;
        const bottomY = canvas.height - 80;
        const gap = n > 1 ? (bottomY - topY) / (n - 1) : 0;
        const singleY = (topY + bottomY) / 2;

        const left = LEFT_NAMES.map((label, i) => ({
            label,
            x: leftX,
            y: n === 1 ? singleY : topY + i * gap
        }));

        const right = RIGHT_NAMES.map((label, i) => ({
            label,
            x: rightX,
            y: n === 1 ? singleY : topY + i * gap
        }));

        drawLabel(ctx, state.title, 40, 50);
        drawDivider(ctx, dividerX, canvas.height);

        ctx.fillStyle = "#555555";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("Proposers", leftX, topY - 50);
        ctx.fillText("Receivers", rightX, topY - 50);

        // Confirmed matches
        for (const [fromLabel, toLabel] of state.matches) {
            const fromNode = left.find(node => node.label === fromLabel);
            const toNode = right.find(node => node.label === toLabel);
            if (!fromNode || !toNode) continue;

            ctx.strokeStyle = "#2d6a4f";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fromNode.x + 22, fromNode.y);
            ctx.lineTo(toNode.x - 22, toNode.y);
            ctx.stroke();
        }

        // Active proposal
        if (state.proposer && state.receiver) {
            const fromNode = left.find(node => node.label === state.proposer);
            const toNode = right.find(node => node.label === state.receiver);

            if (fromNode && toNode) {
                ctx.strokeStyle = "#c1121f";
                ctx.lineWidth = 2;
                ctx.setLineDash([10, 8]);
                ctx.beginPath();
                ctx.moveTo(fromNode.x + 22, fromNode.y);
                ctx.lineTo(toNode.x - 22, toNode.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        left.forEach(node => drawPerson(ctx, node.label, node.x, node.y, "#bde0fe"));
        right.forEach(node => drawPerson(ctx, node.label, node.x, node.y, "#ffd6a5"));

        const proposerHighlight =
            state.proposer && state.receiver
                ? {
                    rowLabel: state.proposer,
                    valueLabel: state.receiver,
                    color: "#ffe599"
                }
                : null;

        const crossedOutCells = (state.rejectedPairs || []).map(([rowLabel, valueLabel]) => ({
            rowLabel,
            valueLabel
        }));

        // Bigger centered table on the right panel.
        const firstColWidth = n <= 6 ? 68 : 60;
        const colWidth = n <= 4 ? 56 : n <= 6 ? 50 : 44;
        const tableWidth = firstColWidth + n * colWidth;
        const rightPanelWidth = canvas.width - dividerX;
        const tableStartX = dividerX + (rightPanelWidth - tableWidth) / 2;

        drawPreferenceTable(
            ctx,
            "Proposer Preferences",
            LEFT_NAMES,
            PROPOSER_PREFS,
            RIGHT_NAMES,
            tableStartX,
            90,
            proposerHighlight,
            crossedOutCells
        );
    },
};