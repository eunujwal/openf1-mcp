from setuptools import setup, find_packages
import os

# Read the README file if it exists
def read_readme():
    if os.path.exists("README.md"):
        with open("README.md", "r", encoding="utf-8") as fh:
            return fh.read()
    return "Model Context Protocol server for OpenF1 Formula 1 API"

setup(
    name="openf1-mcp",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="Model Context Protocol server for OpenF1 Formula 1 API",
    long_description=read_readme(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/openf1-mcp",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.7",
    install_requires=[],
    entry_points={
        "console_scripts": [
            "openf1-mcp=openf1_mcp.cli:main",
        ],
    },
    include_package_data=True,
    package_data={
        "openf1_mcp": ["build/**/*"],
    },
    zip_safe=False,
) 