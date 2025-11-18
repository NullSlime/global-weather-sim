import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from simulation.simple_model import step_simulation, initialize_grid

class SimConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        self.grid = initialize_grid()

        while True:
            self.grid = step_simulation(self.grid)
            await self.send(json.dumps({
                "grid": self.grid.tolist(),
            }))
            await asyncio.sleep(1)
