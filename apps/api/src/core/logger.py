import logging
import sys
from fastapi import Request

def setup_logger():
    logger = logging.getLogger("medvision")
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logger()

def log_request(request: Request, message: str, level: int = logging.INFO, **kwargs):
    client_ip = request.client.host if request.client else "unknown"
    extra_info = " ".join([f"{k}={v}" for k, v in kwargs.items()])
    log_msg = f"[IP:{client_ip}] {request.method} {request.url.path} - {message} {extra_info}"
    logger.log(level, log_msg)
