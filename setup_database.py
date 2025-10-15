#!/usr/bin/env python3
"""
Database setup and migration script for cap-exempt-dev
This script ensures the database has the correct schema for storing form submissions
"""

import sqlite3
import json
from datetime import datetime

def setup_database():
    """Set up the database with the correct schema"""
    print("Setting up logs database...")
    
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    
    # Check if the table exists and what columns it has
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='submissions';")
    table_exists = c.fetchone()
    
    if table_exists:
        print("Table 'submissions' already exists. Checking schema...")
        c.execute("PRAGMA table_info(submissions);")
        columns = c.fetchall()
        print("Current columns:", [col[1] for col in columns])
        
        # Check if we need to migrate
        expected_columns = ['id', 'dev_type', 'property_address', 'answers_json', 'reference_numbers', 'timestamp']
        current_columns = [col[1] for col in columns]
        
        if set(expected_columns).issubset(set(current_columns)):
            print("✅ Database schema is correct!")
        else:
            print("⚠️  Database schema needs updating...")
            # You might want to add migration logic here if needed
    else:
        print("Creating new submissions table...")
        c.execute('''
            CREATE TABLE submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dev_type TEXT NOT NULL,
                property_address TEXT NOT NULL,
                answers_json TEXT NOT NULL,
                reference_numbers TEXT,
                timestamp TEXT NOT NULL
            )
        ''')
        print("✅ Created submissions table!")
    
    conn.commit()
    
    # Add some sample data for testing (optional)
    add_sample_data = input("Add sample data for testing? (y/n): ").lower() == 'y'
    if add_sample_data:
        print("Adding sample data...")
        sample_data = [
            {
                'dev_type': 'Carport',
                'property_address': '123 Main Street, Albury NSW 2640',
                'answers_json': json.dumps({"q1": "yes", "q2": 1, "q3": "no", "exemption_status": "exempt"}),
                'reference_numbers': 'REF-2025-001',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                'dev_type': 'Shed',
                'property_address': '456 Oak Avenue, Albury NSW 2640',
                'answers_json': json.dumps({"q1": "no", "q2": 0, "q3": "yes", "exemption_status": "not_exempt"}),
                'reference_numbers': 'REF-2025-002',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                'dev_type': 'Retaining Wall',
                'property_address': '789 Pine Road, Albury NSW 2640',
                'answers_json': json.dumps({"q1": "yes", "q2": 1, "q3": "yes", "height": "1.2m", "exemption_status": "conditional"}),
                'reference_numbers': 'REF-2025-003',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        ]
        
        for data in sample_data:
            c.execute('''
                INSERT INTO submissions (dev_type, property_address, answers_json, reference_numbers, timestamp)
                VALUES (?, ?, ?, ?, ?)
            ''', (data['dev_type'], data['property_address'], data['answers_json'], data['reference_numbers'], data['timestamp']))
        
        print(f"✅ Added {len(sample_data)} sample records!")
    
    conn.commit()
    conn.close()
    print("✅ Database setup complete!")

def show_current_data():
    """Display current data in the database"""
    print("\n📊 Current database contents:")
    
    conn = sqlite3.connect('logs.db')
    c = conn.cursor()
    
    c.execute("SELECT COUNT(*) FROM submissions;")
    count = c.fetchone()[0]
    print(f"Total submissions: {count}")
    
    if count > 0:
        c.execute("SELECT id, dev_type, property_address, reference_numbers, timestamp FROM submissions ORDER BY timestamp DESC LIMIT 5;")
        recent = c.fetchall()
        
        print("\nMost recent submissions:")
        print("-" * 80)
        for row in recent:
            print(f"ID: {row[0]} | Type: {row[1]} | Address: {row[2][:30]}... | Ref: {row[3]} | Time: {row[4]}")
    
    conn.close()

if __name__ == "__main__":
    print("🔧 Cap-Exempt Database Setup")
    print("=" * 40)
    
    setup_database()
    show_current_data()
    
    print("\n🚀 You can now run your Flask app with: python app.py")
    print("📝 Form submission page: http://localhost:5000/")
    print("📊 Logs viewer page: http://localhost:5000/logs-viewer")