#!/usr/bin/env python3
"""
Script to start the prosodic web server.
Run this script to launch the prosodic analysis server before using the web interface.
"""

import os
import subprocess
import sys

def start_server():
    """Start the prosodic web server"""
    try:
        # Get the path to the prosodic directory
        prosodic_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prosodic')
        
        # Change to the prosodic directory
        os.chdir(prosodic_dir)
        
        # Start the prosodic web server
        print("Starting prosodic web server at http://127.0.0.1:8181/")
        print("Press Ctrl+C to stop the server")
        
        # Run the prosodic web command
        subprocess.call(["prosodic", "web"])
        
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting prosodic server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()