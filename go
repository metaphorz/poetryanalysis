#!/bin/bash

# Script to start Prosodic server and launch the web interface

# Set the base directory to the script's location
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROSODIC_DIR="$BASE_DIR/prosodic"
HTML_FILE="$BASE_DIR/prosodic-interface.html"

# Function to check if the Prosodic server is already running
check_server_running() {
    if nc -z 127.0.0.1 8181 &>/dev/null; then
        return 0  # Server is running
    else
        return 1  # Server is not running
    fi
}

# Analysis server functionality removed - now using command-line approach with ./analyze script

# Function to open the web page in the default browser
open_browser() {
    echo "Opening web interface in your default browser..."
    
    # Try to detect the OS and use the appropriate command
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$HTML_FILE"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &>/dev/null; then
            xdg-open "$HTML_FILE"
        else
            echo "Could not open browser automatically. Please open this file manually: $HTML_FILE"
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows with Git Bash or similar
        start "$HTML_FILE"
    else
        echo "Could not open browser automatically. Please open this file manually: $HTML_FILE"
    fi
}

# Analysis server start function removed - now using command-line approach with ./analyze script

# Function to start the Prosodic server
start_server() {
    echo "Starting Prosodic server..."
    
    # Change to the Prosodic directory
    cd "$PROSODIC_DIR" || {
        echo "Error: Could not change to directory $PROSODIC_DIR"
        exit 1
    }
    
    # Start the server in the background
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start /B prosodic web
    else
        # macOS/Linux
        nohup prosodic web > /dev/null 2>&1 &
    fi
    
    # Store the server PID
    SERVER_PID=$!
    echo "Server started with PID: $SERVER_PID"
    
    # Wait for the server to start
    echo "Waiting for server to start..."
    for i in {1..10}; do
        if check_server_running; then
            echo "Server is running!"
            break
        fi
        sleep 1
        echo "."
    done
    
    # Check if server started successfully
    if ! check_server_running; then
        echo "Warning: Server may not have started correctly. Check manually."
    fi
}

# Main execution

echo "Poetry Analysis Tool Launcher"
echo "============================"

# Check if server is already running
if check_server_running; then
    echo "Prosodic server is already running on port 8181."
else
    # Start the Prosodic server
    start_server
fi

# Open the web interface
open_browser

echo ""
echo "The Prosodic server (port 8181) is running in the background."
echo "To stop it, you can use the command: killall prosodic"
echo "Or close the terminal window."
echo ""
echo "For meter and rhyme analysis, use the ./analyze script from the command line:"
echo "  ./analyze poem_file.txt"
echo ""
echo "Enjoy analyzing your poems!"