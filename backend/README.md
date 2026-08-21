# DevTools Backend - FastAPI

Modern FastAPI backend for developer tools including IP discovery and code beautification.

## 🚀 Features

- **IP Discovery**: Get user's IP address and geolocation information
- **Code Beautifier**: Format code in multiple languages
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Configured for frontend integration
- **Async Operations**: Efficient async/await patterns

## 🛠️ Tech Stack

- **FastAPI**: Modern, fast web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation and serialization
- **aiohttp**: Async HTTP client
- **Code Formatters**: Black, jsbeautifier, cssbeautifier, autopep8

## 📁 Structure

```
backend/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── routers/            # API route handlers
│   ├── __init__.py
│   ├── ipinfo.py       # IP discovery endpoints
│   └── beautify.py     # Code beautifier endpoints
└── schemas/            # Pydantic models
    ├── __init__.py
    └── ipinfo.py       # IP info response schema
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## 🔌 API Endpoints

### IP Discovery

#### GET /api/ipinfo/
Get current user's IP address and geolocation information.

**Response:**
```json
{
  "ip": "203.0.113.42",
  "city": "San Francisco",
  "region": "California",
  "country": "United States",
  "isp": "Example ISP Inc.",
  "timezone": "America/Los_Angeles",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "asn": "AS12345",
  "org": "Example Organization"
}
```

### Code Beautifier

#### POST /api/beautify/
Format code in the specified language.

**Request Body:**
```json
{
  "code": "function test(){return 'hello world';}",
  "language": "javascript"
}
```

**Response:**
```json
{
  "beautified_code": "function test() {\n    return 'hello world';\n}",
  "language": "javascript",
  "success": true,
  "error": null
}
```

**Supported Languages:**
- `javascript` - JavaScript/JSX
- `python` - Python
- `html` - HTML
- `css` - CSS

## 🔧 Configuration

### CORS Settings
The API is configured to allow requests from:
- http://localhost:3000
- http://127.0.0.1:3000

To modify CORS settings, edit the `main.py` file.

### External APIs
The IP discovery feature uses:
- **ipify.org**: For IP address detection
- **ip-api.com**: For geolocation data

## 🚀 Deployment

### Local Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🧪 Testing

Run tests (if implemented):
```bash
pytest
```

## 📝 Environment Variables

No environment variables are required for basic functionality. The API uses public services for IP detection and geolocation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License 