#!/usr/bin/env python3
"""
Command-line interface for OpenF1 MCP server.
"""

import sys
import os
import subprocess
import argparse
from pathlib import Path


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
    index_js = build_dir / "index.js"
    
    if not index_js.exists():
        raise FileNotFoundError(
            f"Compiled index.js not found at {index_js}. "
            "Please run 'npm run build' to compile the TypeScript code."
        )
    
    # Run the Node.js server
    try:
        subprocess.run(["node", str(index_js)], check=True)
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
    http_server_js = build_dir / "http-server.js"
    
    if not http_server_js.exists():
        raise FileNotFoundError(
            f"Compiled http-server.js not found at {http_server_js}. "
            "Please run 'npm run build' to compile the TypeScript code."
        )
    
    try:
        subprocess.run(["node", str(http_server_js)], check=True)
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