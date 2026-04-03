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

// Draws a smaller reference cell for the original matrix
function drawReferenceCell(ctx, x, y, value) {
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(x, y, 60, 40);
    ctx.strokeStyle = "#495057";
    ctx.strokeRect(x, y, 60, 40);

    ctx.fillStyle = "#111111";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x + 30, y + 20);
}

export let originalMatrix = [
    [4, 1, 3],
    [2, 0, 5],
    [3, 2, 2],
];

export function setOriginalMatrix(matrix) {
    originalMatrix = matrix.map(row => row.slice());
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

        // Step 3 result: column reduction introduces zeros that are highlighted in green.
        yield {
            title: "Column Reduction",
            matrix: [
                [2, 0, 2],
                [1, 0, 5],
                [0, 0, 0],
            ],
            highlight: [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2]],
        };

        // Step 4: Find the smallest entry not covered by any line. 
        // Subtract it from all uncovered entries and add it to all entries covered by two lines. This creates new zeros that are highlighted in green.
        yield {
            title: "Adjust matrix to create additional zeros, based on minimum uncovered value",
            matrix: [
                [1, 0, 1],
                [0, 0, 4],
                [0, 1, 0],
            ],
            highlight: [[0, 1], [1, 0], [1, 1], [2, 0], [2, 2]],
            
        };

        yield {
            title: "Display lines covering all zeros",
            matrix: [
                [1, 0, 1],
                [0, 0, 4],
                [0, 1, 0],
            ],
            highlight: [[0, 1], [1, 0], [1, 1], [2, 0], [2, 2]],
            lines: [
                { type: "col", index: 1 },
                { type: "row", index: 2 },
                { type: "col", index: 0 },
            ]
        };

        yield {
            title: "Because the number of lines equals the matrix size, make the final assignment",
            matrix: [
                [1, 0, 1],
                [0, 0, 4],
                [0, 1, 0],
            ],
            highlight: [[0, 1], [1, 0], [2, 2]],
        };
        yield {
            title: "Final assignment on original matrix",
            matrix: [
                [4, 1, 3],
                [2, 0, 5],
                [3, 2, 2],
            ],
            highlight: [[0, 1], [1, 0], [2, 2]],
        };
    },

    draw({ ctx, state }) {
        // Draw original matrix on the left as reference
        ctx.fillStyle = "#111111";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("Original Matrix", 40, 100);
        const refStartX = 40;
        const refStartY = 130;
        originalMatrix.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                drawReferenceCell(
                    ctx,
                    refStartX + colIndex * 65,
                    refStartY + rowIndex * 45,
                    value
                );
            });
        });

        // Centered title and matrix (dynamic for any canvas size)
        const canvasWidth = ctx.canvas.width;
        // Matrix width: 3 cols * 95px, height: 3 rows * 65px
        const matrixCols = state.matrix[0]?.length || 3;
        const matrixRows = state.matrix.length || 3;
        const matrixWidth = matrixCols * 95;
        const matrixHeight = matrixRows * 65;
        const startX = Math.floor((canvasWidth - matrixWidth) / 2);
        const startY = 130;

        // Center the step title above the matrix
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(state.title, canvasWidth / 2, 50);

        // Draw the changing matrix centered
        const highlight = state.highlight ?? [];
        state.matrix.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                // highlighted is true when the current cell appears in the state's focus list.
                const highlighted = highlight.some(
                    ([highlightRow, highlightCol]) =>
                        highlightRow === rowIndex && highlightCol === colIndex
                );
                drawCell(
                    ctx,
                    startX + colIndex * 95,
                    startY + rowIndex * 65,
                    value,
                    highlighted
                );
            });
        });

        if (Array.isArray(state.lines)) {
            ctx.strokeStyle = "#e63946";
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 6]);

            state.lines.forEach((line) => {
                if (line.type === "row") {
                    const y = startY + line.index * 65 + 30;
                    ctx.beginPath();
                    ctx.moveTo(startX - 10, y);
                    ctx.lineTo(startX + state.matrix[0].length * 95 + 10, y);
                    ctx.stroke();
                } else if (line.type === "col") {
                    const x = startX + line.index * 95 + 45;
                    ctx.beginPath();
                    ctx.moveTo(x, startY - 10);
                    ctx.lineTo(x, startY + state.matrix.length * 65 + 10);
                    ctx.stroke();
                }
            });

            ctx.setLineDash([]);
        }
    },
};
