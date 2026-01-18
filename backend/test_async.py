
import os
import asyncio
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def main():
    url = os.environ.get('DATABASE_URL')
    print(f"Connecting to {url}")
    try:
        conn = await asyncpg.connect(url)
        print("Connected!")
        await conn.close()
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(main())
