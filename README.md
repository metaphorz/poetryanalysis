# Poetry Analysis Tool

This application provides a user-friendly interface for analyzing poetry using Prosodic, a metrical-phonological parser.

## Installation

To get the full project with all required components including the Prosodic module, use the following commands:

```bash
git clone https://github.com/metaphorz/poetryanalysis.git
cd poetryanalysis
git submodule update --init --recursive
```

## Setup

1. Ensure you have Python 3.9 or higher installed
2. Make sure you have espeak installed:
   - Mac: `brew install espeak`
   - Linux: `apt-get install espeak libespeak1 libespeak-dev`
   - Windows: Download from [espeak-ng](https://github.com/espeak-ng/espeak-ng/releases/latest)

## Starting the Application

### Quick Start (Recommended)

Simply run the `go` script:

```
./go
```

This script will:
1. Start the Prosodic server if it's not already running
2. Open the web interface in your default browser
3. Keep the server running in the background

### Manual Start Options

If you prefer to start components manually, you have these options:

#### Option 1: Direct Prosodic Interface

1. Start the Prosodic server:
   ```
   cd /Users/paul/PoetryAnalysis/prosodic && prosodic web
   ```
   
   This will start the Prosodic web server at http://127.0.0.1:8181/

2. Open `prosodic-interface.html` in your web browser to use the application
   - This provides a direct interface to the Prosodic web tool
   - The page will automatically detect if the server is running

#### Option 2: Custom Interface

1. Start the Prosodic server:
   ```
   python start_prosodic_server.py
   ```
   
2. Open `index.html` in your web browser to use the custom interface

## Features of Prosodic

- Upload poem files (.txt)
- Paste poem text directly
- Analyze poems using advanced metrical-phonological parsing
- View detailed stress and meter patterns
- Explore multiple parsing options
- Support for English and Finnish text

## About Prosodic

Prosodic is a metrical-phonological parser developed by [Ryan Heuser](https://github.com/quadrismegistus), [Josh Falk](https://github.com/jsfalk), and [Arto Anttila](http://web.stanford.edu/~anttila/) from Stanford University.

The tool performs advanced metrical-phonological parsing for poetry, supporting features like:
- Syllable identification and stress marking
- Metrical pattern recognition
- Multiple parsing options for complex poems
- Detailed visualization of scansion results

For more information, visit the [Prosodic GitHub repository](https://github.com/quadrismegistus/prosodic).