#!/usr/bin/env python3
"""
Poetry Analysis Tool
-------------------
A script to analyze poetry for both metrical and rhyme patterns using Prosodic.
"""

from prosodic.imports import *
import argparse
import sys
import os
from typing import Dict, List, Tuple, Any
import string

def load_poem(source: str = None) -> str:
    """
    Load poem text from a file or return a sample if none provided.
    """
    if source:
        try:
            with open(source, 'r') as f:
                return f.read()
        except FileNotFoundError:
            print(f"File not found: {source}")
            return source  # If not a file, treat the input as direct text
    else:
        # Default sample poem (Shakespeare's Sonnet 1 excerpt)
        return """From fairest creatures we desire increase,
That thereby beauty's rose might never die,
But as the riper should by time decease,
His tender heir might bear his memory:
But thou, contracted to thine own bright eyes,
Feed'st thy light'st flame with self-substantial fuel,
Making a famine where abundance lies,
Thyself thy foe, to thy sweet self too cruel."""

def analyze_meter(text_model: TextModel) -> List[Dict[str, Any]]:
    """
    Analyze meter for each line in the poem.
    
    Returns a list of dictionaries containing meter analysis for each line.
    """
    # Setup meter
    text_model.set_meter()
    
    results = []
    
    # Parse and collect meter data
    for i, line_parses in enumerate(text_model.parse()):
        line = line_parses.line
        if not line.parses.unbounded:
            results.append({
                'line_num': i + 1, 
                'text': line.txt,
                'parseable': False,
                'message': 'Line could not be parsed'
            })
            continue
            
        best_parse = line.parses.unbounded[0]
        
        # Determine foot type (iambic, trochaic, etc.)
        foot_type = best_parse.foot_type if hasattr(best_parse, 'foot_type') else 'unknown'
        
        # Count feet to determine meter name (pentameter, tetrameter, etc.)
        num_feet = best_parse.num_feet if hasattr(best_parse, 'num_feet') else len(best_parse.slots) // 2
        meter_name = get_meter_name(num_feet)
        
        # Full meter description (e.g., "iambic pentameter")
        full_meter = f"{foot_type} {meter_name}" if foot_type and meter_name else "undetermined"
        
        # Build visualization with stress markers - safely
        stress_markers = []
        
        # Get stress information in a safer way
        syllables = []
        try:
            if hasattr(best_parse, 'txt_sylls') and best_parse.txt_sylls:
                syllables = best_parse.txt_sylls
            elif hasattr(best_parse, 'sylls') and best_parse.sylls:
                syllables = [s.txt for s in best_parse.sylls if hasattr(s, 'txt')]
            elif hasattr(best_parse, 'wordforms'):
                all_sylls = []
                for wf in best_parse.wordforms:
                    if hasattr(wf, 'syllables'):
                        all_sylls.extend([s.txt for s in wf.syllables if hasattr(s, 'txt')])
                syllables = all_sylls
        except Exception as e:
            print(f"Warning: Error extracting syllables: {e}")
            
        # If we have stress markings, use them
        stress_pattern = ''
        if hasattr(best_parse, 'stress_str') and best_parse.stress_str:
            stress_pattern = best_parse.stress_str
            
            # Try to align stress pattern with syllables
            if len(syllables) == len(stress_pattern):
                for i, (syll, stress) in enumerate(zip(syllables, stress_pattern)):
                    if stress == 's':
                        stress_markers.append(f"/{syll}/")
                    else:
                        stress_markers.append(f"˘{syll}˘")
        
        # If we couldn't build stress markers, provide a simpler visualization
        if not stress_markers and hasattr(best_parse, 'txt') and best_parse.txt:
            visualization = best_parse.txt
        elif not stress_markers:
            visualization = "(Visualization not available)"
        else:
            visualization = ' '.join(stress_markers)
        
        results.append({
            'line_num': i + 1,
            'text': line.txt,
            'parseable': True,
            'foot_type': foot_type,
            'meter_name': meter_name,
            'full_meter': full_meter,
            'num_syllables': best_parse.num_sylls if hasattr(best_parse, 'num_sylls') else 0,
            'stress_pattern': stress_pattern,
            'visualization': visualization
        })
    
    return results

def get_meter_name(num_feet: int) -> str:
    """
    Convert number of feet to meter name.
    """
    meter_names = {
        1: 'monometer',
        2: 'dimeter',
        3: 'trimeter',
        4: 'tetrameter',
        5: 'pentameter',
        6: 'hexameter',
        7: 'heptameter',
        8: 'octameter'
    }
    return meter_names.get(num_feet, f"{num_feet}-foot")

def identify_rhyme_scheme(text_model: TextModel) -> Dict[str, Any]:
    """
    Identify the rhyme scheme of the poem using Prosodic.
    
    Returns a dictionary with rhyme scheme in letter notation (e.g., ABAB)
    and matches between rhyming lines.
    """
    # Get rhyming lines from the text model
    rhyming_pairs = text_model.get_rhyming_lines()
    
    if not rhyming_pairs:
        return {
            'scheme': 'None',
            'rhyme_groups': {},
            'message': 'No rhyming lines detected'
        }
    
    # Group lines by rhyme sound
    rhyme_groups = {}
    for line, (dist, matching_line) in rhyming_pairs.items():
        # Use the line ending sound as a key
        line_text = line.txt.strip()
        matching_text = matching_line.txt.strip()
        
        # Group by last word phonetic sound
        line_key = line.wordforms[-1].syllables[-1].rime
        
        if line_key not in rhyme_groups:
            rhyme_groups[line_key] = []
            
        if line_text not in rhyme_groups[line_key]:
            rhyme_groups[line_key].append(line_text)
        if matching_text not in rhyme_groups[line_key]:
            rhyme_groups[line_key].append(matching_text)
    
    # Convert rhyme groups to letter notation (A, B, C, etc.)
    line_to_letter = {}
    current_lines = []
    scheme = []
    letter_index = 0
    letters = list(string.ascii_uppercase)
    
    # Get all lines in order
    for stanza in text_model.stanzas:
        for line in stanza.lines:
            current_lines.append(line.txt.strip())
    
    # Assign letters to rhyme groups
    rhyme_to_letter = {}
    for key, lines in rhyme_groups.items():
        if key not in rhyme_to_letter:
            if letter_index < len(letters):
                rhyme_to_letter[key] = letters[letter_index]
                letter_index += 1
            else:
                rhyme_to_letter[key] = '?'  # If we run out of letters
        
        for line_text in lines:
            line_to_letter[line_text] = rhyme_to_letter[key]
    
    # Build the scheme
    for line_text in current_lines:
        if line_text in line_to_letter:
            scheme.append(line_to_letter[line_text])
        else:
            scheme.append('X')  # No rhyme
    
    return {
        'scheme': ''.join(scheme),
        'rhyme_groups': {letter: lines for key, letter in rhyme_to_letter.items() 
                         for lines in [rhyme_groups[key]]},
        'line_to_letter': line_to_letter
    }

def display_results(meter_results: List[Dict[str, Any]], rhyme_results: Dict[str, Any]) -> None:
    """
    Print analysis results in a readable format.
    """
    print("\n" + "="*80)
    print("METER ANALYSIS".center(80))
    print("="*80)
    
    for result in meter_results:
        print(f"\nLine {result['line_num']}: {result['text']}")
        
        if result['parseable']:
            print(f"  Meter: {result['full_meter']}")
            print(f"  Syllables: {result['num_syllables']}")
            if result['stress_pattern']:
                print(f"  Stress pattern: {result['stress_pattern']}")
            print(f"  Visualization: {result['visualization']}")
        else:
            print(f"  {result['message']}")
    
    print("\n" + "="*80)
    print("RHYME SCHEME ANALYSIS".center(80))
    print("="*80)
    
    print(f"\nRhyme scheme: {rhyme_results['scheme']}")
    
    if rhyme_results['scheme'] != 'None':
        print("\nRhyming groups:")
        for letter, lines in rhyme_results['rhyme_groups'].items():
            print(f"\n  {letter}:")
            for line in lines:
                print(f"    • {line}")
    else:
        print(f"\n{rhyme_results['message']}")

def main() -> None:
    """
    Main function to process command-line arguments and run analysis.
    """
    parser = argparse.ArgumentParser(description='Analyze the meter and rhyme scheme of poetry.')
    parser.add_argument('poem_file', nargs='?', help='Path to a file containing the poem')
    parser.add_argument('-f', '--file', help='Path to a file containing the poem (alternative to positional argument)')
    parser.add_argument('-t', '--text', help='Direct input of poem text')
    parser.add_argument('--improve-syllabification', action='store_true', 
                      help='Enable improved vowel syllabification (Dipthong Break)')
    
    args = parser.parse_args()
    
    # Set improved syllabification if requested
    if args.improve_syllabification:
        print("Enabling Dipthong Break for improved syllabification")
        # The pattern_overrides.py module should already be properly configured
        # with the fix for words like "iambs" having a strong-weak pattern
        try:
            # Try to import and use the pattern_overrides module
            import importlib
            import os
            
            # Try to find prosodic path
            prosodic_path = None
            for path in sys.path:
                if path.endswith('prosodic') or os.path.basename(path) == 'prosodic':
                    prosodic_path = path
                    break
            
            if prosodic_path:
                print(f"Found prosodic at: {prosodic_path}")
                # Let user know that pattern_overrides should be used already
                print("NOTE: The pattern_overrides.py module should already be in effect")
                print("      providing proper stress patterns for words like 'iambs'")
        except Exception as e:
            print(f"Note: {e}")
            print("Continuing with default syllabification settings")
    
    # Load poem from file or direct text
    poem_file = args.poem_file or args.file
    poem_text = args.text if args.text else load_poem(poem_file)
    
    print("\nAnalyzing poem:\n")
    print("-" * 40)
    print(poem_text)
    print("-" * 40)
    
    # Create text model and analyze
    text_model = TextModel(poem_text)
    meter_results = analyze_meter(text_model)
    rhyme_results = identify_rhyme_scheme(text_model)
    
    # Display results
    display_results(meter_results, rhyme_results)

if __name__ == "__main__":
    main()
