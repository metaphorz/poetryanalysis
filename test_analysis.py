#!/usr/bin/env python3
"""
Test script to verify Analysis.py works correctly
"""

import os
import sys
import subprocess

# Create a test poem file
test_poem = """When I consider how my light is spent,
Ere half my days, in this dark world and wide,
And that one Talent which is death to hide
Lodged with me useless, though my Soul more bent
To serve therewith my Maker, and present
My true account, lest he returning chide;
"Doth God exact day-labour, light denied?"
I fondly ask. But patience, to prevent
That murmur, soon replies, "God doth not need
Either man's work or his own gifts; who best
Bear his mild yoke, they serve him best. His state
Is Kingly. Thousands at his bidding speed
And post o'er Land and Ocean without rest:
They also serve who only stand and wait."""

# Write the test poem to a file
with open('test_poem.txt', 'w') as f:
    f.write(test_poem)

print("Testing Analysis.py with a sample poem...")

# Set up the environment
env = os.environ.copy()
env['PYTHONPATH'] = os.path.dirname(os.path.abspath(__file__))

# Get the full path to Analysis.py
script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Analysis.py')

# Run the Analysis.py script with the test poem
cmd = [sys.executable, script_path, '--improve-syllabification', '-f', 'test_poem.txt']
print(f"Running command: {' '.join(cmd)}")

try:
    # Run with a timeout to prevent hanging
    result = subprocess.run(cmd, capture_output=True, text=True, env=env, timeout=30)
    
    # Print the output
    print("\nExit code:", result.returncode)
    print("\nStandard output:")
    print(result.stdout)
    
    if result.stderr:
        print("\nStandard error:")
        print(result.stderr)
    
except subprocess.TimeoutExpired:
    print("\nERROR: Analysis.py timed out after 30 seconds")
except Exception as e:
    print(f"\nERROR: {str(e)}")

# Clean up
try:
    os.remove('test_poem.txt')
except:
    pass

print("\nTest complete.")
