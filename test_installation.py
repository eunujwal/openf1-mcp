#!/usr/bin/env python3
"""
Test script to verify the openf1-mcp package installation.
"""

import sys
import subprocess
from pathlib import Path

def test_cli_import():
    """Test that the CLI module can be imported."""
    try:
        from openf1_mcp.cli import main
        print("✓ CLI module import successful")
        return True
    except ImportError as e:
        print(f"✗ CLI module import failed: {e}")
        return False

def test_server_import():
    """Test that the server module can be imported."""
    try:
        from openf1_mcp.server import OpenF1MCPServer
        print("✓ Server module import successful")
        return True
    except ImportError as e:
        print(f"✗ Server module import failed: {e}")
        return False

def test_build_files():
    """Test that the compiled TypeScript files are present."""
    package_root = Path(__file__).parent / "openf1_mcp"
    build_dir = package_root / "build"
    
    if not build_dir.exists():
        print(f"✗ Build directory not found at {build_dir}")
        return False
    
    index_js = build_dir / "index.js"
    if not index_js.exists():
        print(f"✗ Compiled index.js not found at {index_js}")
        return False
    
    print("✓ Compiled TypeScript files found")
    return True

def test_node_availability():
    """Test that Node.js is available."""
    try:
        result = subprocess.run(["node", "--version"], 
                              capture_output=True, text=True, check=True)
        print(f"✓ Node.js available: {result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("✗ Node.js not found. Please install Node.js 18+ to use this package.")
        return False

def test_cli_command():
    """Test that the CLI command works."""
    try:
        result = subprocess.run(["openf1-mcp", "--version"], 
                              capture_output=True, text=True, check=True)
        if "openf1-mcp 0.1.0" in result.stdout:
            print("✓ CLI command works correctly")
            return True
        else:
            print(f"✗ CLI command returned unexpected output: {result.stdout}")
            return False
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"✗ CLI command failed: {e}")
        return False

def main():
    """Run all tests."""
    print("Testing openf1-mcp package installation...\n")
    
    tests = [
        test_cli_import,
        test_server_import,
        test_build_files,
        test_node_availability,
        test_cli_command,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! The package is ready to use.")
        print("\nYou can now use:")
        print("  openf1-mcp                    # Run stdio server")
        print("  openf1-mcp --http             # Run HTTP server")
        print("  python3 -c 'from openf1_mcp import OpenF1MCPServer'  # Use Python API")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 