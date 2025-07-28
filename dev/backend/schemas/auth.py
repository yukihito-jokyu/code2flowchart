from pydantic import BaseModel


class AuthError(BaseModel):
    message: str
    code: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
