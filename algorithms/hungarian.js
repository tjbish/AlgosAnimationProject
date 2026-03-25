// Draws one matrix cell.
// value is the displayed cost and highlighted marks zeros or assignments being emphasized.
function drawCell(ctx, x, y, value, highlighted) {
    ctx.fillStyle = highlighted ? "#d8f3dc" : "#f8f9fa";
    ctx.fillRect(x, y, 90, 60);
    ctx.strokeStyle = "#495057";
    ctx.strokeRect(x, y, 90, 60);

    ctx.fillStyle = "#111111";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x + 45, y + 30);
}

export const hungarianAlgorithm = {
    name: "Hungarian",

    getInitialState() {
        // Initial state is the original cost matrix before any row/column operations.
        // highlight stores [row, col] coordinates that should be emphasized in the drawing.
        return {
            title: "Initial cost matrix",
            matrix: [
                [4, 1, 3],
                [2, 0, 5],
                [3, 2, 2],
            ],
            highlight: [],
        };
    },

    *createGenerator() {
        // Step 1 result: show the original matrix with no special entries selected.
        yield {
            title: "Initial cost matrix",
            matrix: [
                [4, 1, 3],
                [2, 0, 5],
                [3, 2, 2],
            ],
            highlight: [],
        };

        // Step 2 result: row reduction introduces zeros that are highlighted in green.
        yield {
            title: "Row reduction",
            matrix: [
                [3, 0, 2],
                [2, 0, 5],
                [1, 0, 0],
            ],
            highlight: [[0, 1], [1, 1], [2, 1], [2, 2]],
        };

        // Step 3 result: a candidate set of independent zeros is chosen for assignment.
        yield {
            title: "Choose independent zeros",
            matrix: [
                [3, 0, 2],
                [2, 0, 5],
                [1, 0, 0],
            ],
            highlight: [[0, 1], [1, 0], [2, 2]],
        };
    },

    draw({ ctx, state }) {
        ctx.fillStyle = "#111111";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(state.title, 40, 50);

        // startX/startY position the top-left corner of the matrix in the canvas center.
        const startX = 265;
        const startY = 130;

        state.matrix.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                // highlighted is true when the current cell appears in the state's focus list.
                const highlighted = state.highlight.some(
                    ([highlightRow, highlightCol]) =>
                        highlightRow === rowIndex && highlightCol === colIndex
                );

                // Each cell result shows the current reduced cost plus whether it is emphasized.
                drawCell(
                    ctx,
                    startX + colIndex * 95,
                    startY + rowIndex * 65,
                    value,
                    highlighted
                );
            });
        });
    },
};
