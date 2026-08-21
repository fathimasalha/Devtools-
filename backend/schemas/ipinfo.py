from pydantic import BaseModel
from typing import Optional

class IPInfoResponse(BaseModel):
    ip: str
    ipv6: Optional[str] = None
    city: str
    region: str
    country: str
    isp: str
    timezone: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    asn: Optional[str] = None
    org: Optional[str] = None
    postal: Optional[str] = None 