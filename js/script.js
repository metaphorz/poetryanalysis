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
            
            // Call prosodic API
            analyzePoemWithProsodic(poem);
            
            // For demo purposes, simulate other analyses
            setTimeout(() => {
                document.getElementById('poetry-tools-loading').style.display = 'none';
                document.getElementById('poetry-tools-result').innerHTML = '<p>Poetry-Tools analysis would appear here.</p>';
                
                document.getElementById('zeuscansion-loading').style.display = 'none';
                document.getElementById('zeuscansion-result').innerHTML = '<p>ZeuScansion analysis would appear here.</p>';
                
                document.getElementById('comparison-loading').style.display = 'none';
                document.getElementById('comparison-result').innerHTML = '<p>Comparison of results would appear here.</p>';
            }, 2000);
        } else {
            alert('Please enter a poem or upload a text file.');
        }
    });
    
    function analyzePoemWithProsodic(poem) {
        // Get the state of the vowel syllabification checkbox
        const improveVowelSyllables = document.getElementById('improve-vowel-syllables').checked;
        
        // Call the prosodic web service
        fetch('http://127.0.0.1:8181/api/parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: poem,
                improveVowelSyllables: improveVowelSyllables
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            document.getElementById('prosodic-loading').style.display = 'none';
            
            // Process and display the results
            displayProsodicResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('prosodic-loading').style.display = 'none';
            document.getElementById('prosodic-result').innerHTML = 
                `<p class="error">Error connecting to Prosodic service. Make sure the service is running at http://127.0.0.1:8181.</p>
                 <p>To start the service, run: <code>cd /Users/paul/PoetryAnalysis/prosodic && prosodic web</code></p>`;
        });
    }
    
    function displayProsodicResults(data) {
        const resultDiv = document.getElementById('prosodic-result');
        
        if (data && data.parses) {
            let html = '<div class="prosodic-results">';
            
            // Display each line and its best parse
            data.parses.forEach((line, index) => {
                html += `<div class="parsed-line">
                    <p class="line-text">${line.text}</p>
                    <p class="meter-pattern">Meter: ${line.meter}</p>
                    <p class="parse-text">${line.parse_txt}</p>
                </div>`;
            });
            
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = '<p>No results returned from Prosodic.</p>';
        }
    }
});