from fastapi import APIRouter, HTTPException
import requests
import aiohttp
import asyncio
from typing import Dict, Any
from schemas.ipinfo import IPInfoResponse

router = APIRouter()

@router.get("/ipinfo/", response_model=IPInfoResponse)
async def get_ip_info():
    """
    Get current user's IP address and geolocation information
    """
    try:
        # Get IP address (IPv4)
        async with aiohttp.ClientSession() as session:
            async with session.get("https://api.ipify.org?format=json") as response:
                ip_data = await response.json()
                ip_address = ip_data.get("ip")
        
        if not ip_address:
            raise HTTPException(status_code=500, detail="Could not retrieve IP address")
        
        # Get IPv6 address if available
        ipv6_address = None
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get("https://api6.ipify.org?format=json", timeout=3) as response:
                    if response.status == 200:
                        ipv6_data = await response.json()
                        ipv6_address = ipv6_data.get("ip")
        except Exception:
            pass
        
        # Get geolocation data
        geo_url = f"http://ip-api.com/json/{ip_address}"
        async with aiohttp.ClientSession() as session:
            async with session.get(geo_url) as response:
                geo_data = await response.json()
        
        # Format response
        ip_info = {
            "ip": ip_address,
            "ipv6": ipv6_address,
            "city": geo_data.get("city", "Unknown"),
            "region": geo_data.get("regionName", "Unknown"),
            "country": geo_data.get("country", "Unknown"),
            "isp": geo_data.get("isp", "Unknown"),
            "timezone": geo_data.get("timezone", "Unknown"),
            "latitude": geo_data.get("lat"),
            "longitude": geo_data.get("lon"),
            "asn": geo_data.get("as", "Unknown"),
            "org": geo_data.get("org", "Unknown"),
            "postal": geo_data.get("zip", "Unknown")
        }
        
        return IPInfoResponse(**ip_info)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving IP information: {str(e)}") 