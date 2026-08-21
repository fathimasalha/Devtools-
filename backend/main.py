from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ipinfo, beautify

app = FastAPI(
    title="DevTools API",
    description="Modern developer tools API for IP discovery and code beautification",
    version="1.0.0"
)

import os

# Configure CORS - Allow all origins for production and local
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
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