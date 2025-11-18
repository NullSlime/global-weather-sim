import numpy as np

LAT = 36
LON = 72

def initialize_grid():
    return np.random.rand(LAT, LON)

def step_simulation(grid):
    new = grid.copy()

    for i in range(LAT):
        for j in range(LON):
            total = grid[i, j]
            count = 1
            for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
                ni = (i + di) % LAT
                nj = (j + dj) % LON
                total += grid[ni, nj]
                count += 1
            new[i, j] = total / count

    return new
