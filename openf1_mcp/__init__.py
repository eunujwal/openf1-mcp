"""
OpenF1 MCP - Model Context Protocol server for OpenF1 Formula 1 API

This package provides a Python wrapper around the TypeScript-based MCP server
for accessing Formula 1 data through the OpenF1 API.
"""

__version__ = "0.1.0"
__author__ = "Your Name"
__email__ = "your.email@example.com"

from .interface import main, OpenF1MCPServer

__all__ = ["main", "OpenF1MCPServer"] 