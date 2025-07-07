# Installation Guide

## For Users

### Prerequisites

- Python 3.7 or higher
- Node.js 18 or higher

### Install via pip

```bash
pip install openf1-mcp
```

### Verify Installation

```bash
# Test the command-line interface
openf1-mcp --version

# Test the Python API
python3 -c "from openf1_mcp import OpenF1MCPServer; print('Success!')"
```

## For Developers

### Install from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/openf1-mcp.git
cd openf1-mcp

# Install Node.js dependencies
npm install

# Build the TypeScript code
npm run build

# Install the Python package in development mode
pip install -e .
```

### Development Workflow

1. **Make changes to TypeScript code** in the `src/` directory
2. **Build the changes**: `npm run build`
3. **Test the changes**: `python3 test_installation.py`
4. **Install updated package**: `pip install -e .`

### Project Structure

```
openf1-mcp/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main MCP server
│   ├── http-server.ts     # HTTP server
│   └── tools/             # MCP tool implementations
├── openf1_mcp/            # Python package
│   ├── __init__.py        # Package initialization
│   ├── cli.py             # Command-line interface
│   ├── server.py          # Python API
│   └── build/             # Compiled TypeScript (copied from build/)
├── setup.py               # Python package setup
├── pyproject.toml         # Modern Python packaging
├── package.json           # Node.js package configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Publishing to PyPI

### Build Distribution

```bash
# Build the TypeScript code
npm run build

# Build Python distribution
python -m build

# This creates dist/openf1_mcp-0.1.0.tar.gz and dist/openf1_mcp-0.1.0-py3-none-any.whl
```

### Upload to PyPI

```bash
# Install twine if not already installed
pip install twine

# Upload to PyPI (requires PyPI account)
twine upload dist/*

# Or upload to Test PyPI first
twine upload --repository testpypi dist/*
```

### Version Management

When releasing a new version:

1. Update version in `package.json`
2. Update version in `pyproject.toml`
3. Update version in `openf1_mcp/__init__.py`
4. Build and publish: `npm run build && python -m build && twine upload dist/*`

## Troubleshooting

### Node.js Not Found

If you get "Node.js not found" errors:

1. Install Node.js from https://nodejs.org/
2. Ensure `node` is in your PATH
3. Verify with: `node --version`

### Build Files Missing

If compiled TypeScript files are missing:

1. Run: `npm install`
2. Run: `npm run build`
3. Verify: `ls openf1_mcp/build/`

### Import Errors

If you get import errors:

1. Ensure the package is installed: `pip list | grep openf1-mcp`
2. Reinstall: `pip install -e .`
3. Check Python path: `python3 -c "import sys; print(sys.path)"`

## Testing

Run the test suite:

```bash
python3 test_installation.py
```

This will verify:
- Package installation
- Module imports
- CLI functionality
- Node.js availability
- Build file presence 