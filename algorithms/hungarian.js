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

function generateRandomMatrix(size)
{
    let matrix = [];
    let i = 0;
    let o = 0;
    for (i = 0; i < size; ++i)
    {
        matrix[i] = [];
        for (o = 0; o < size; ++o)
        {
            matrix[i][o] = Math.round((Math.random() * 10))
        }
    }
    return matrix;
}

//Hungarian algorithm functions

function rowReduction(matrix)
{
    const n = matrix.length;
    for (let i = 0; i < n; ++i)
    {
        const rowMin = Math.min(...matrix[i]);
        for (let o = 0; o < n; ++o)
        {
            matrix[i][o] -= rowMin;
        }
    }
    return matrix;
}

function columnReduction(matrix)
{
    const n = matrix.length;
    let col = [];
    for (let i = 0; i < n; ++i)
    {
        col = [];
        for (let o = 0; o < n; ++o)
        {
            col.push(matrix[o][i]);
        }
        const colMin = Math.min(...col);
        for (let o = 0; o < n; ++o)
        {
            matrix[o][i] -= colMin;
        }
    }
    return matrix;
}

function lineCover(matrix)
{
    const n = matrix.length;

    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                adj[i].push(j);
            }
        }
    }

    const matchToCol = Array(n).fill(-1);

    function dfs(row, visited) {
        for (const col of adj[row]) {
            if (visited[col]) continue;
            visited[col] = true;

            if (matchToCol[col] === -1 || dfs(matchToCol[col], visited)) {
                matchToCol[col] = row;
                return true;
            }
        }
        return false;
    }

    for (let i = 0; i < n; i++) {
        dfs(i, Array(n).fill(false));
    }

    const visitedRows = Array(n).fill(false);
    const visitedCols = Array(n).fill(false);

    function mark(row) {
        visitedRows[row] = true;
        for (const col of adj[row]) {
            if (!visitedCols[col] && matchToCol[col] !== row) {
                visitedCols[col] = true;
                if (matchToCol[col] !== -1) {
                    mark(matchToCol[col]);
                }
            }
        }
    }

    for (let i = 0; i < n; i++) {
        let matched = false;
        for (let j = 0; j < n; j++) {
            if (matchToCol[j] === i) {
                matched = true;
                break;
            }
        }
        if (!matched) {
            mark(i);
        }
    }

    const lines = []

    for (let i = 0; i < n; i++) {
        if (!visitedRows[i]) lines.push({type: "row", index: i});
    }

    for (let j = 0; j < n; j++) {
        if (visitedCols[j]) lines.push({type: "col", index: j});
    }

    return lines;
}

function findAssignment(matrix) {
    const n = matrix.length;

    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                adj[i].push(j);
            }
        }
    }

    const matchCol = Array(n).fill(-1);

    function dfs(row, visited) {
        for (const col of adj[row]) {
            if (visited[col]) continue;
            visited[col] = true;

            if (matchCol[col] === -1 || dfs(matchCol[col], visited)) {
                matchCol[col] = row;
                return true;
            }
        }
        return false;
    }

    for (let i = 0; i < n; i++) {
        if (!dfs(i, Array(n).fill(false))) {
            throw new Error("No perfect assignment found");
        }
    }

    const result = [];
    for (let col = 0; col < n; col++) {
        const row = matchCol[col];
        if (row !== -1) {
            result.push([row, col]);
        }
    }

    return result;
}

function adjustMatrix(matrix, lines) {
    const n = matrix.length;

    const coveredRows = new Set();
    const coveredCols = new Set();

    for (const line of lines) {
        if (line.type === "row") {
            coveredRows.add(line.index);
        } else if (line.type === "col") {
            coveredCols.add(line.index);
        }
    }

    let minUncovered = Infinity;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const isCovered = coveredRows.has(i) || coveredCols.has(j);
            if (!isCovered) {
                minUncovered = Math.min(minUncovered, matrix[i][j]);
            }
        }
    }

    if (minUncovered === Infinity) return matrix; 

    const newMatrix = matrix.map(row => row.slice()); 

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const rowCovered = coveredRows.has(i);
            const colCovered = coveredCols.has(j);

            if (!rowCovered && !colCovered) {
                newMatrix[i][j] -= minUncovered;
            } else if (rowCovered && colCovered) {
                newMatrix[i][j] += minUncovered;
            }
        }
    }

    return newMatrix;
}

function findZeros(matrix)
{
    const zeros = [];
    const n = matrix.length;
    for (let i = 0; i < n; ++i)
    {
        for (let o = 0; o < n; ++o)
        {
            if (matrix[i][o] === 0)
            {
                zeros.push([i, o]);
            }
        }
    }
    return zeros;
}

export let originalMatrix = generateRandomMatrix(3);

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
            matrix: originalMatrix,
            highlight: [],
        };
    },

    *createGenerator() {
        // Step 1 result: show the original matrix with no special entries selected.
        yield {
            title: "Initial cost matrix",
            matrix: originalMatrix,
            highlight: [],
        };

        let solved = false;
        let currentMatrix = structuredClone(originalMatrix);
        let zeros = [];
        let lines = [];

        // Step 2 result: row reduction introduces zeros that are highlighted in green.
        currentMatrix = rowReduction(currentMatrix);
        zeros = findZeros(currentMatrix);
        yield {
            title: "Row reduction",
            matrix: currentMatrix,
            highlight: zeros,
        };
        // Step 3 result: column reduction introduces zeros that are highlighted in green.
        currentMatrix = columnReduction(currentMatrix);
        zeros = findZeros(currentMatrix);
        yield {
        title: "Column Reduction",
        matrix: currentMatrix,
        highlight: zeros,
        };

        while(!solved)
        {
            // Step 4 result: lines
            lines = lineCover(currentMatrix);
            yield {
            title: "Display lines covering all zeros",
            matrix: currentMatrix,
            highlight: zeros,
            lines: lines
            };
            if (lines.length == currentMatrix.length)
            {
                solved = true;
            }
            else
            {
                // Step 5 result: adjust
                currentMatrix = adjustMatrix(currentMatrix, lines);
                zeros = findZeros(currentMatrix);
                yield {
                    title: "Because the number of lines did not equal the matrix size, adjust the matrix",
                    matrix: currentMatrix,
                    highlight: zeros,
                }
            }
        }
        // Step 6 result: final assignment
        let final = findAssignment(currentMatrix);
        yield {
            title: "Because the number of lines equals the matrix size, make the final assignment",
            matrix: currentMatrix,
            highlight: final,
        };
        yield {
            title: "Final assignment on original matrix",
            matrix: originalMatrix,
            highlight: final,
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
