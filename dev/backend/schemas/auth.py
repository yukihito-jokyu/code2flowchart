from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class SignupResponse(BaseModel):
    id: str
    email: str
    message: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    id: str
    email: str
    token: str
    message: str


class LogoutResponse(BaseModel):
    message: str


class AuthError(BaseModel):
    message: str
    code: str | None = None


# Aliases for compatibility
UserCreate = SignupRequest
UserLogin = LoginRequest
AuthResponse = LoginResponse


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
