from fastapi import APIRouter, HTTPException, Request
import aiohttp
from schemas.ipinfo import IPInfoResponse

router = APIRouter()

@router.get("/ipinfo/", response_model=IPInfoResponse)
async def get_ip_info(request: Request):
    """
    Get current user's IP address and geolocation information
    """
    try:
        # Extract client IP from headers if reverse proxied, or request.client
        forwarded_for = request.headers.get("x-forwarded-for")
        real_ip = request.headers.get("x-real-ip")
        
        client_ip = None
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        elif real_ip:
            client_ip = real_ip.strip()
        elif request.client and request.client.host:
            client_ip = request.client.host

        # If local or private IP, fetch public IP
        is_local = not client_ip or client_ip in ("127.0.0.1", "::1", "localhost") or client_ip.startswith(("192.168.", "10.", "172."))
        
        if is_local:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get("https://api.ipify.org?format=json", timeout=aiohttp.ClientTimeout(total=4)) as response:
                        if response.status == 200:
                            ip_data = await response.json()
                            client_ip = ip_data.get("ip")
            except Exception:
                pass

        if not client_ip:
            raise HTTPException(status_code=500, detail="Could not retrieve IP address")

        # Get geolocation data using HTTPS
        geo_data = {}
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"https://ipwho.is/{client_ip}", timeout=aiohttp.ClientTimeout(total=4)) as response:
                    if response.status == 200:
                        geo_data = await response.json()
        except Exception:
            pass

        # Format response
        if geo_data.get("success") is not False and geo_data.get("ip"):
            ip_info = {
                "ip": client_ip,
                "ipv6": client_ip if ":" in client_ip else None,
                "city": geo_data.get("city") or "Unknown",
                "region": geo_data.get("region") or "Unknown",
                "country": geo_data.get("country") or "Unknown",
                "isp": geo_data.get("connection", {}).get("isp") if isinstance(geo_data.get("connection"), dict) else "Unknown",
                "timezone": geo_data.get("timezone", {}).get("id") if isinstance(geo_data.get("timezone"), dict) else "Unknown",
                "latitude": geo_data.get("latitude"),
                "longitude": geo_data.get("longitude"),
                "asn": f"AS{geo_data.get('connection', {}).get('asn')}" if isinstance(geo_data.get("connection"), dict) and geo_data.get("connection", {}).get("asn") else "Unknown",
                "org": geo_data.get("connection", {}).get("org") if isinstance(geo_data.get("connection"), dict) else "Unknown",
                "postal": geo_data.get("postal") or "Unknown"
            }
        else:
            ip_info = {
                "ip": client_ip,
                "ipv6": None,
                "city": "Unknown",
                "region": "Unknown",
                "country": "Unknown",
                "isp": "Unknown",
                "timezone": "Unknown",
                "latitude": None,
                "longitude": None,
                "asn": "Unknown",
                "org": "Unknown",
                "postal": "Unknown"
            }

        return IPInfoResponse(**ip_info)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving IP information: {str(e)}") 