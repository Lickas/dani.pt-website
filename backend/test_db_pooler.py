
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
url = os.environ.get('DATABASE_URL')
print(f"Connecting to {url}")
try:
    conn = psycopg2.connect(url)
    print("Connected!")
    conn.close()
except Exception as e:
    print(f"Failed: {e}")
