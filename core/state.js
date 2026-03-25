import { dinicAlgorithm } from "../algorithms/dinic.js";
import { galeShapleyAlgorithm } from "../algorithms/gale_shapley.js";
import { hungarianAlgorithm } from "../algorithms/hungarian.js";

export const algorithms = {
    gale: galeShapleyAlgorithm,
    hungarian: hungarianAlgorithm,
    dinic: dinicAlgorithm,
};

export function getAlgorithm(key) {
    return algorithms[key] ?? algorithms.gale;
}
