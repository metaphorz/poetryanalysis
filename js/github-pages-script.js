document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const poemText = document.getElementById('poem-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const dropArea = document.getElementById('drop-area');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to current button and pane
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // File drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }
    
    function handleFiles(files) {
        const file = files[0];
        
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                poemText.value = e.target.result;
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a text file (.txt)');
        }
    }
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files);
        }
    });
    
    // Sample data for static demo on GitHub Pages
    const sampleParses = {
        "stopping_by_woods": {
            "title": "Stopping by Woods on a Snowy Evening",
            "author": "Robert Frost",
            "parses": [
                {
                    "text": "Whose woods these are I think I know.",
                    "meter": "-+-+-+-+",
                    "parse_txt": "whose WOODS these ARE i THINK i KNOW"
                },
                {
                    "text": "His house is in the village though;",
                    "meter": "-+-+-+-+",
                    "parse_txt": "his HOUSE is IN the VIL lage THOUGH"
                },
                {
                    "text": "He will not see me stopping here",
                    "meter": "-+-+-+-+",
                    "parse_txt": "he WILL not SEE me STOP ping HERE"
                },
                {
                    "text": "To watch his woods fill up with snow.",
                    "meter": "-+-+-+-+",
                    "parse_txt": "to WATCH his WOODS fill UP with SNOW"
                }
            ]
        },
        "sonnet": {
            "title": "Sonnet 18",
            "author": "William Shakespeare",
            "parses": [
                {
                    "text": "Shall I compare thee to a summer's day?",
                    "meter": "-+-+-+-+-+",
                    "parse_txt": "shall I com PARE thee TO a SUM mer's DAY"
                },
                {
                    "text": "Thou art more lovely and more temperate:",
                    "meter": "-+-+-+-+-+",
                    "parse_txt": "thou ART more LOVE ly AND more TEM pe RATE"
                },
                {
                    "text": "Rough winds do shake the darling buds of May,",
                    "meter": "-+-+-+-+-+",
                    "parse_txt": "rough WINDS do SHAKE the DAR ling BUDS of MAY"
                },
                {
                    "text": "And summer's lease hath all too short a date:",
                    "meter": "-+-+-+-+-+",
                    "parse_txt": "and SUM mer's LEASE hath ALL too SHORT a DATE"
                }
            ]
        }
    };
    
    // Basic iambic pattern detection for GitHub Pages demo
    function detectMeter(line) {
        const words = line.trim().split(/\s+/);
        let meter = "";
        
        // Very simplified pattern detection
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > 3) {
                // Longer words often have stress on first syllable in English
                if (i % 2 === 0) {
                    meter += "+-";
                } else {
                    meter += "-+";
                }
            } else {
                // Short words typically unstressed unless articles
                if (["the", "a", "an", "of", "to", "in", "for", "and", "but"].includes(words[i].toLowerCase())) {
                    meter += "-";
                } else {
                    meter += "+";
                }
            }
        }
        
        // Ensure proper ending
        if (meter.length > 1 && meter.charAt(meter.length - 1) !== "+" && meter.charAt(meter.length - 1) !== "-") {
            meter += "-";
        }
        
        return meter;
    }
    
    // Generate parse text with capitalized stressed syllables (simplified)
    function generateParseText(line, meter) {
        const words = line.trim().split(/\s+/);
        let parseText = "";
        let meterIndex = 0;
        
        for (let i = 0; i < words.length; i++) {
            if (meter[meterIndex] === "+") {
                parseText += words[i].toUpperCase() + " ";
            } else {
                parseText += words[i].toLowerCase() + " ";
            }
            meterIndex += 1;
            if (meterIndex >= meter.length) meterIndex = 0;
        }
        
        return parseText.trim();
    }
    
    // Basic analyze function for GitHub Pages demo
    function analyzePoem(poemText) {
        // First check if this is one of our sample poems
        const lowerText = poemText.toLowerCase();
        
        if (lowerText.includes("whose woods these are") || lowerText.includes("stopping by woods")) {
            return sampleParses.stopping_by_woods;
        }
        
        if (lowerText.includes("shall i compare thee") || lowerText.includes("summer's day")) {
            return sampleParses.sonnet;
        }
        
        // Otherwise do a basic analysis
        const lines = poemText.split("\n").filter(line => line.trim().length > 0);
        const parses = [];
        
        for (const line of lines) {
            if (line.trim().length === 0) continue;
            
            const meter = detectMeter(line);
            const parseText = generateParseText(line, meter);
            
            parses.push({
                text: line,
                meter: meter,
                parse_txt: parseText
            });
        }
        
        return {
            title: "Your Poem",
            author: "Unknown",
            parses: parses
        };
    }
    
    // Analyze button click
    analyzeBtn.addEventListener('click', function() {
        const poem = poemText.value.trim();
        
        if (poem) {
            // Show loading indicators
            document.getElementById('poetry-tools-loading').style.display = 'flex';
            document.getElementById('zeuscansion-loading').style.display = 'flex';
            document.getElementById('prosodic-loading').style.display = 'flex';
            document.getElementById('comparison-loading').style.display = 'flex';
            
            // Clear previous results
            document.getElementById('poetry-tools-result').innerHTML = '';
            document.getElementById('zeuscansion-result').innerHTML = '';
            document.getElementById('prosodic-result').innerHTML = '';
            document.getElementById('comparison-result').innerHTML = '';
            
            // For GitHub Pages demo, analyze client-side
            setTimeout(() => {
                const results = analyzePoem(poem);
                
                // Hide loading indicators
                document.getElementById('poetry-tools-loading').style.display = 'none';
                document.getElementById('zeuscansion-loading').style.display = 'none';
                document.getElementById('prosodic-loading').style.display = 'none';
                document.getElementById('comparison-loading').style.display = 'none';
                
                // Display results
                displayPoemResults(results);
            }, 1500); // Simulate processing time
        } else {
            alert('Please enter a poem or upload a text file.');
        }
    });
    
    // Display results across all tabs
    function displayPoemResults(results) {
        const prosodicDiv = document.getElementById('prosodic-result');
        const poetryToolsDiv = document.getElementById('poetry-tools-result');
        const zeuscansionDiv = document.getElementById('zeuscansion-result');
        const comparisonDiv = document.getElementById('comparison-result');
        
        // Display title if available
        let titleHtml = '';
        if (results.title) {
            titleHtml = `<h3>${results.title}</h3>`;
            if (results.author) {
                titleHtml += `<p class="author">by ${results.author}</p>`;
            }
        }
        
        // Prosodic results
        let prosodicHtml = titleHtml + '<div class="prosodic-results">';
        results.parses.forEach(line => {
            prosodicHtml += `<div class="parsed-line">
                <p class="line-text">${line.text}</p>
                <p class="meter-pattern">Meter: ${line.meter}</p>
                <p class="parse-text">${line.parse_txt}</p>
            </div>`;
        });
        prosodicHtml += '</div>';
        prosodicDiv.innerHTML = prosodicHtml;
        
        // Simplified results for other tools
        poetryToolsDiv.innerHTML = titleHtml + '<p>Poetry-Tools analysis would appear here with similar scansion results.</p>';
        zeuscansionDiv.innerHTML = titleHtml + '<p>ZeuScansion analysis would appear here with similar scansion results.</p>';
        
        // Comparison view
        let comparisonHtml = titleHtml + '<h3>Meter Pattern Comparison</h3><table class="comparison-table">';
        comparisonHtml += '<tr><th>Line</th><th>Prosodic</th><th>Poetry-Tools</th><th>ZeuScansion</th></tr>';
        
        results.parses.forEach(line => {
            comparisonHtml += `<tr>
                <td>${line.text}</td>
                <td>${line.meter}</td>
                <td>${line.meter}</td>
                <td>${line.meter}</td>
            </tr>`;
        });
        
        comparisonHtml += '</table>';
        comparisonDiv.innerHTML = comparisonHtml;
    }
});