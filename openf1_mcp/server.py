"""
Python interface for the OpenF1 MCP server.
"""

import subprocess
import sys
from pathlib import Path
from typing import Optional, Dict, Any


class OpenF1MCPServer:
    """
    Python wrapper for the OpenF1 MCP server.
    
    This class provides a Python interface to the TypeScript-based MCP server
    for accessing Formula 1 data through the OpenF1 API.
    """
    
    def __init__(self):
        self._package_root = Path(__file__).parent
        self._build_dir = self._package_root / "build"
        self._process: Optional[subprocess.Popen] = None
    
    def _ensure_built(self):
        """Ensure the TypeScript code has been compiled."""
        if not self._build_dir.exists():
            raise FileNotFoundError(
                f"Build directory not found at {self._build_dir}. "
                "Please run 'npm run build' to compile the TypeScript code."
            )
        
        index_js = self._build_dir / "index.js"
        if not index_js.exists():
            raise FileNotFoundError(
                f"Compiled index.js not found at {index_js}. "
                "Please run 'npm run build' to compile the TypeScript code."
            )
    
    def start_stdio_server(self) -> subprocess.Popen:
        """
        Start the MCP server in stdio mode.
        
        Returns:
            subprocess.Popen: The running server process
        """
        self._ensure_built()
        
        index_js = self._build_dir / "index.js"
        
        try:
            self._process = subprocess.Popen(
                ["node", str(index_js)],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return self._process
        except FileNotFoundError:
            raise RuntimeError(
                "Node.js not found. Please install Node.js (version 18 or higher) "
                "to run the TypeScript server."
            )
    
    def start_http_server(self, port: int = 3000) -> subprocess.Popen:
        """
        Start the MCP server in HTTP mode.
        
        Args:
            port: The port to run the HTTP server on
            
        Returns:
            subprocess.Popen: The running server process
        """
        self._ensure_built()
        
        http_server_js = self._build_dir / "http-server.js"
        
        if not http_server_js.exists():
            raise FileNotFoundError(
                f"Compiled http-server.js not found at {http_server_js}. "
                "Please run 'npm run build' to compile the TypeScript code."
            )
        
        try:
            self._process = subprocess.Popen(
                ["node", str(http_server_js), "--port", str(port)],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return self._process
        except FileNotFoundError:
            raise RuntimeError(
                "Node.js not found. Please install Node.js (version 18 or higher) "
                "to run the HTTP server."
            )
    
    def stop(self):
        """Stop the running server process."""
        if self._process:
            self._process.terminate()
            self._process.wait()
            self._process = None
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop()
    
    @property
    def is_running(self) -> bool:
        """Check if the server is currently running."""
        return self._process is not None and self._process.poll() is None 