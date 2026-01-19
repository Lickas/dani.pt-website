from fastapi import HTTPException
import jwt
import os

JWT_SECRET = os.environ.get('JWT_SECRET', 'dani-pt-secret-key-2024')
JWT_ALGORITHM = "HS256"

def verify_token(token: str) -> dict:
    """Verify JWT token for admin access"""
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
