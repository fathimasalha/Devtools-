from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ipinfo, beautify

app = FastAPI(
    title="DevTools API",
    description="Modern developer tools API for IP discovery and code beautification",
    version="1.0.0"
)

import os

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ipinfo.router, prefix="/api", tags=["IP Info"])
app.include_router(beautify.router, prefix="/api", tags=["Code Beautifier"])

@app.get("/")
async def root():
    return {"message": "DevTools API - Modern Developer Tools"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "DevTools API"} 