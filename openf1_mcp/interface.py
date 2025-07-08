#!/usr/bin/env python3
"""
Consolidated Python interface for OpenF1 MCP server.
Combines server and CLI functionality.
"""

import sys
import os
import subprocess
import argparse
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
        
        server_js = self._build_dir / "server.js"
        if not server_js.exists():
            raise FileNotFoundError(
                f"Compiled server.js not found at {server_js}. "
                "Please run 'npm run build' to compile the TypeScript code."
            )
    
    def start_stdio_server(self) -> subprocess.Popen:
        """
        Start the MCP server in stdio mode.
        
        Returns:
            subprocess.Popen: The running server process
        """
        self._ensure_built()
        
        server_js = self._build_dir / "server.js"
        
        try:
            self._process = subprocess.Popen(
                ["node", str(server_js)],
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
        
        server_js = self._build_dir / "server.js"
        
        try:
            self._process = subprocess.Popen(
                ["node", str(server_js), "--http"],
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


def get_package_root():
    """Get the root directory of the installed package."""
    return Path(__file__).parent


def get_build_dir():
    """Get the build directory containing compiled TypeScript code."""
    package_root = get_package_root()
    build_dir = package_root / "build"
    
    if not build_dir.exists():
        raise FileNotFoundError(
            f"Build directory not found at {build_dir}. "
            "Please ensure the TypeScript code has been compiled."
        )
    
    return build_dir


def run_typescript_server():
    """Run the TypeScript MCP server."""
    build_dir = get_build_dir()
    server_js = build_dir / "server.js"
    
    if not server_js.exists():
        raise FileNotFoundError(
            f"Compiled server.js not found at {server_js}. "
            "Please run 'npm run build' to compile the TypeScript code."
        )
    
    # Run the Node.js server
    try:
        subprocess.run(["node", str(server_js)], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running TypeScript server: {e}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print(
            "Node.js not found. Please install Node.js (version 18 or higher) "
            "to run the TypeScript server.",
            file=sys.stderr
        )
        sys.exit(1)


def run_http_server():
    """Run the HTTP server version."""
    build_dir = get_build_dir()
    server_js = build_dir / "server.js"
    
    if not server_js.exists():
        raise FileNotFoundError(
            f"Compiled server.js not found at {server_js}. "
            "Please run 'npm run build' to compile the TypeScript code."
        )
    
    try:
        subprocess.run(["node", str(server_js), "--http"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running HTTP server: {e}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print(
            "Node.js not found. Please install Node.js (version 18 or higher) "
            "to run the HTTP server.",
            file=sys.stderr
        )
        sys.exit(1)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="OpenF1 MCP - Model Context Protocol server for OpenF1 Formula 1 API"
    )
    parser.add_argument(
        "--http",
        action="store_true",
        help="Run HTTP server instead of stdio server"
    )
    parser.add_argument(
        "--version",
        action="version",
        version="openf1-mcp 0.1.0"
    )
    
    args = parser.parse_args()
    
    try:
        if args.http:
            run_http_server()
        else:
            run_typescript_server()
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main() 