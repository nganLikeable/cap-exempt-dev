from flask import Flask, request, jsonify, render_template, send_from_directory
from datetime import datetime
import json
import sqlite3
import os

app = Flask(__name__, static_folder='.', static_url_path='')

def init_database():
    """Initialize the database with the proper schema"""
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    
    # Create the submissions table if it doesn't exist
    c.execute('''
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dev_type TEXT NOT NULL,
            property_address TEXT NOT NULL,
            answers_json TEXT NOT NULL,
            reference_numbers TEXT,
            timestamp TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def get_all_submissions():
    """Retrieve all submissions from the database"""
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    c.execute('''
        SELECT id, dev_type, property_address, answers_json, reference_numbers, timestamp 
        FROM submissions 
        ORDER BY timestamp DESC
    ''')
    submissions = c.fetchall()
    conn.close()
    
    # Convert to list of dictionaries for easier handling
    result = []
    for submission in submissions:
        result.append({
            'id': submission[0],
            'dev_type': submission[1],
            'property_address': submission[2],
            'answers_json': json.loads(submission[3]) if submission[3] else {},
            'reference_numbers': submission[4],
            'timestamp': submission[5]
        })
    
    return result

@app.route('/')
def home():
    # Serve the main index.html file directly
    with open('index.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/logs-viewer')
def logs_viewer():
    return render_template('logs.html')

@app.route('/admin')
def admin_dashboard():
    """Simple admin dashboard to view exemption check statistics"""
    try:
        submissions = get_all_submissions()
        
        # Calculate statistics
        stats = {
            'total_submissions': len(submissions),
            'exempt_count': len([s for s in submissions if s.get('answers_json', {}).get('exemption_status') == 'exempt']),
            'not_exempt_count': len([s for s in submissions if s.get('answers_json', {}).get('exemption_status') == 'not_exempt']),
            'incomplete_count': len([s for s in submissions if s.get('answers_json', {}).get('exemption_status') == 'incomplete']),
            'dev_types': {}
        }
        
        # Count by development type
        for submission in submissions:
            dev_type = submission.get('dev_type', 'Unknown')
            stats['dev_types'][dev_type] = stats['dev_types'].get(dev_type, 0) + 1
        
        return f'''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Exemption Check Admin Dashboard</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }}
                .container {{ max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .stats {{ display: flex; gap: 20px; margin: 20px 0; }}
                .stat-card {{ flex: 1; padding: 20px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; }}
                .stat-number {{ font-size: 2em; font-weight: bold; color: #007bff; }}
                .stat-label {{ color: #666; }}
                h1 {{ color: #333; text-align: center; }}
                .dev-types {{ margin: 20px 0; }}
                .dev-type-item {{ padding: 10px; margin: 5px 0; background: #e9ecef; border-radius: 4px; }}
                .links {{ text-align: center; margin: 20px 0; }}
                .links a {{ margin: 0 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }}
                .links a:hover {{ background: #0056b3; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏛️ Exemption Check Admin Dashboard</h1>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">{stats['total_submissions']}</div>
                        <div class="stat-label">Total Submissions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{stats['exempt_count']}</div>
                        <div class="stat-label">Exempt Applications</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{stats['not_exempt_count']}</div>
                        <div class="stat-label">Not Exempt</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{stats['incomplete_count']}</div>
                        <div class="stat-label">Incomplete</div>
                    </div>
                </div>
                
                <div class="dev-types">
                    <h3>Development Types</h3>
                    {''.join([f'<div class="dev-type-item"><strong>{dev_type}:</strong> {count} submissions</div>' for dev_type, count in stats['dev_types'].items()])}
                </div>
                
                <div class="links">
                    <a href="/">🏠 Main Form</a>
                    <a href="/logs-viewer">📊 Detailed Logs</a>
                    <a href="/logs">📋 JSON API</a>
                </div>
            </div>
        </body>
        </html>
        '''
        
    except Exception as e:
        return f"Error loading dashboard: {str(e)}", 500

@app.route('/submit', methods=['POST'])
def submit_log():
    try:
        data = request.get_json()
        
        # Extract data from the request
        development_type = data.get('development_type', '')
        property_address = data.get('property_address', '')
        answers = data.get('answers', {})
        reference_number = data.get('reference_number', '')
        submission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Validate required fields
        if not development_type or not property_address:
            return jsonify({"error": "Development type and property address are required"}), 400
        
        # Convert answers to JSON string
        answers_json = json.dumps(answers)
        
        # Insert into database using the correct column names
        conn = sqlite3.connect('logs.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO submissions (dev_type, property_address, answers_json, reference_numbers, timestamp)
            VALUES (?, ?, ?, ?, ?)
        ''', (development_type, property_address, answers_json, reference_number, submission_time))
        
        submission_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "✅ Log stored successfully!",
            "submission_id": submission_id,
            "timestamp": submission_time
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to store log: {str(e)}"}), 500

@app.route('/logs', methods=['GET'])
def get_logs():
    """Retrieve all logged submissions"""
    try:
        submissions = get_all_submissions()
        return jsonify({
            "submissions": submissions,
            "total_count": len(submissions)
        })
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve logs: {str(e)}"}), 500

@app.route('/logs/<int:submission_id>', methods=['GET'])
def get_log_by_id(submission_id):
    """Retrieve a specific submission by ID"""
    try:
        conn = sqlite3.connect('logs.db')
        c = conn.cursor()
        c.execute('''
            SELECT id, dev_type, property_address, answers_json, reference_numbers, timestamp 
            FROM submissions 
            WHERE id = ?
        ''', (submission_id,))
        
        submission = c.fetchone()
        conn.close()
        
        if submission:
            result = {
                'id': submission[0],
                'dev_type': submission[1],
                'property_address': submission[2],
                'answers_json': json.loads(submission[3]) if submission[3] else {},
                'reference_numbers': submission[4],
                'timestamp': submission[5]
            }
            return jsonify(result)
        else:
            return jsonify({"error": "Submission not found"}), 404
            
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve log: {str(e)}"}), 500

@app.route('/logs/search', methods=['GET'])
def search_logs():
    """Search logs by development type or property address"""
    try:
        dev_type = request.args.get('dev_type', '')
        address = request.args.get('address', '')
        
        conn = sqlite3.connect('logs.db')
        c = conn.cursor()
        
        query = '''
            SELECT id, dev_type, property_address, answers_json, reference_numbers, timestamp 
            FROM submissions 
            WHERE 1=1
        '''
        params = []
        
        if dev_type:
            query += ' AND dev_type LIKE ?'
            params.append(f'%{dev_type}%')
            
        if address:
            query += ' AND property_address LIKE ?'
            params.append(f'%{address}%')
            
        query += ' ORDER BY timestamp DESC'
        
        c.execute(query, params)
        submissions = c.fetchall()
        conn.close()
        
        result = []
        for submission in submissions:
            result.append({
                'id': submission[0],
                'dev_type': submission[1],
                'property_address': submission[2],
                'answers_json': json.loads(submission[3]) if submission[3] else {},
                'reference_numbers': submission[4],
                'timestamp': submission[5]
            })
        
        return jsonify({
            "submissions": result,
            "total_count": len(result)
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to search logs: {str(e)}"}), 500

if __name__ == '__main__':
    # Initialize the database when the app starts
    init_database()
    app.run(debug=True)
