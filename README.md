# Poetry Analysis Tool

This application provides a user-friendly interface for analyzing poetry using Prosodic, a metrical-phonological parser. It includes both a web interface for interactive poem exploration and a command-line tool for direct meter and rhyme analysis.

## Installation

To get the full project with all required components including the Prosodic module, use the following commands:

```bash
git clone https://github.com/metaphorz/poetryanalysis.git
cd poetryanalysis
git submodule update --init --recursive

# Run the application
./go
```

This will start the Prosodic server and open the web interface in your default browser.

## Setup

1. Ensure you have Python 3.9 or higher installed
2. Make sure you have espeak installed:
   - Mac: `brew install espeak`
   - Linux: `apt-get install espeak libespeak1 libespeak-dev`
   - Windows: Download from [espeak-ng](https://github.com/espeak-ng/espeak-ng/releases/latest)

## Starting the Application

### Web Interface

Simply run the `go` script:

```
./go
```

This script will:
1. Start the Prosodic server if it's not already running
2. Open the web interface in your default browser
3. Keep the server running in the background

### Command-Line Analysis

To analyze a poem directly from the command line:

```
./analyze poems/Poem1.txt
```

This will run the Analysis.py script with improved syllabification and pattern overrides, displaying meter and rhyme analysis in the terminal.

Options:
- `--improve-syllabification`: Enable improved vowel syllabification (automatically enabled by default)

### Manual Start Options

If you prefer to start components manually:

1. Start the Prosodic server:
   ```
   cd /Users/paul/PoetryAnalysis/prosodic && prosodic web
   ```
   
   This will start the Prosodic web server at http://127.0.0.1:8181/

2. Open `prosodic-interface.html` in your web browser to use the application
   - This provides a direct interface to the Prosodic web tool
   - The page will automatically detect if the server is running

## Project Structure

- `prosodic/` - The Prosodic library
- `poems/` - Sample poem text files
- `prosodic-interface.html` - Web interface for the Prosodic tool
- `Analysis.py` - Core analysis script for meter and rhyme
- `analyze` - Command-line script for poem analysis
- `go` - Script to start the Prosodic server and web interface
- `kill` - Script to stop the Prosodic server

## Features

### Web Interface
- Upload poem files (.txt)
- Paste poem text directly
- Analyze poems using advanced metrical-phonological parsing
- View detailed stress and meter patterns
- Explore multiple parsing options

### Command-Line Analysis
- Direct meter and rhyme analysis of poem files
- Improved syllabification with pattern overrides for words like "iambs"
- Clear visualization of stress patterns
- Rhyme scheme detection
- Support for English text

## About Prosodic

Prosodic is a metrical-phonological parser developed by [Ryan Heuser](https://github.com/quadrismegistus), [Josh Falk](https://github.com/jsfalk), and [Arto Anttila](http://web.stanford.edu/~anttila/) from Stanford University.

The tool performs advanced metrical-phonological parsing for poetry, supporting features like:
- Syllable identification and stress marking
- Metrical pattern recognition
- Multiple parsing options for complex poems
- Detailed visualization of scansion results

For more information, visit the [Prosodic GitHub repository](https://github.com/quadrismegistus/prosodic).