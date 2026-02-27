import { runGame } from "./testGame";

const testGame2 = [
    'd2d4','d7d5',
    'e2e3','g8f6',
    'g1f3','b8c6',
    'b1c3','c8f5',
    'f1d3','f5d3',
    'c2d3','e7e6',
    'e3e4','f8d6',
    'e4e5','c6e5',
    'd4e5','d5d4',
    'c3b5','f6g4',
    'b5d6','c7d6',
    'e5d6','d8d6',
    'f3g5','d6e5',
    'g5e4','f7f5',
    'e1g1','f5e4',
    'd3e4','e5e4',
    'f1e1','e4f5',
    'd1d4','a8d8',
    'd4g7','f5f2',
    'g1h1','f2e1'
]

const foolsMate = [
    'f2f3','e7e5',
    'g2g4','d8h4',
]

runGame(foolsMate,2000)
