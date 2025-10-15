#!/usr/bin/env python3
"""
Test script to demonstrate what SEPP form data is captured
This shows the actual structure of data that gets logged from exemption checks
"""

import json
from datetime import datetime

# Example of what gets captured when a user completes a Shed exemption check
shed_exemption_data = {
    "development_type": "Shed",
    "property_address": "Address not specified in SEPP form",
    "answers": {
        # SEPP Question responses in order
        "q1": "no",      # Heritage/draft heritage/offshore area
        "q2": "no",      # Replacing existing deck higher than 1m
        "q3": "RU1",     # Development zone
        "q4": 35.5,      # Floor area (m²)
        "q5": 2.8,       # Height above ground level (m)
        "q6": 8.2,       # Distance from lot boundary (m)
        "q7": "yes",     # Behind building line or road frontage
        "q8": "no",      # Is development a shipping container
        "q9": "yes",     # Roofwater disposed without disrupting neighbors
        "q10": "yes",    # Metal components low reflective and pre-colored
        "q11": "no",     # Built in bush fire prone area
        "q12": "no",     # In heritage/draft heritage conservation area
        "q13": "yes",    # Located in rear yard
        "q14": "no",     # Interferes with neighboring building safety
        "q15": "no",     # Class 10 building intended for residency
        "q16": 15.0,     # Distance from registered easement (m)
        "q17": None,     # Cabana connected to water/sewerage (N/A)
        "q18": 0,        # Number of existing developments on lot
        
        # System-added metadata
        "exemption_status": "exempt",
        "completion_time": "2025-10-11T14:30:22.123Z",
        "development_type": "shed"
    },
    "reference_numbers": "Section 2.17 1a of the SEPP (2008); Section 2.18 1b of the SEPP (2008); Section 2.18 1c of the SEPP (2008); Section 2.18 1d of the SEPP (2008)"
}

# Example of what gets captured for a Carport exemption check
carport_exemption_data = {
    "development_type": "Carport",
    "property_address": "Address not specified in SEPP form", 
    "answers": {
        "q1": "no",      # On heritage item/foreshore area
        "q2": "yes",     # Structure for storing vehicles with 2+ open sides
        "q3": "Other",   # Development zone
        "q4": "no",      # In rural area
        "q5": 450.0,     # Size of lot/property (m²)
        "q6": 18.5,      # Floor area of carport (m²)
        "q7": 2.6,       # Height above ground level (m)
        "q8": "no",      # Exceeds gutter line if attached to dwelling
        "q9": "yes",     # At least 1m behind building line
        "q10": 2.5,      # Distance from lot boundary (m)
        "q11": "yes",    # Metal components low reflective/pre-colored
        "q12": "no",     # New driveway/gutter crossing without consent
        "q13": "yes",    # Roofwater directed to stormwater system
        "q14": "yes",    # Fascia connection meets engineer specs
        "q15": "yes",    # Non-combustible if bushfire-prone <5m from dwelling
        "q16": "yes",    # In rear yard if heritage conservation area
        "q17": "no",     # Breaks access/parking/loading on lot
        "q18": 8.0,      # Min distance between roof and lot boundary
        "q19": 1,        # Number of groups occupying lot
        "q20": 1,        # Number of developments on property
        
        "exemption_status": "not_exempt",  # Failed some requirements
        "completion_time": "2025-10-11T14:35:15.456Z",
        "development_type": "carport"
    },
    "reference_numbers": "Section 2.19 of the SEPP (2008); Section 2.20 1a of the SEPP (2008); Section 2.20 1b of the SEPP (2008)"
}

def print_example_data():
    """Print examples of what data gets captured"""
    print("🏗️  SEPP Exemption Check Database Logging Examples")
    print("=" * 60)
    
    print("\n✅ EXEMPT Shed Example:")
    print("-" * 30)
    print(f"Development Type: {shed_exemption_data['development_type']}")
    print(f"Final Status: {shed_exemption_data['answers']['exemption_status']}")
    print(f"Questions Answered: {len([k for k in shed_exemption_data['answers'].keys() if k.startswith('q')])}")
    print("Key Answers:")
    print(f"  • Zone: {shed_exemption_data['answers']['q3']}")
    print(f"  • Floor Area: {shed_exemption_data['answers']['q4']}m²")
    print(f"  • Height: {shed_exemption_data['answers']['q5']}m")
    print(f"  • Heritage Area: {shed_exemption_data['answers']['q1']}")
    
    print("\n❌ NOT EXEMPT Carport Example:")
    print("-" * 30)
    print(f"Development Type: {carport_exemption_data['development_type']}")
    print(f"Final Status: {carport_exemption_data['answers']['exemption_status']}")
    print(f"Questions Answered: {len([k for k in carport_exemption_data['answers'].keys() if k.startswith('q')])}")
    print("Key Answers:")
    print(f"  • Zone: {carport_exemption_data['answers']['q3']}")
    print(f"  • Floor Area: {carport_exemption_data['answers']['q6']}m²")
    print(f"  • Distance from Boundary: {carport_exemption_data['answers']['q10']}m")
    print(f"  • Rural Area: {carport_exemption_data['answers']['q4']}")
    
    print("\n📊 Database Storage Format:")
    print("-" * 30)
    print("Table: submissions")
    print("Columns:")
    print("  • id (auto-increment)")
    print("  • dev_type ('Shed', 'Carport', 'Patio', 'Retaining Wall')")
    print("  • property_address ('Address not specified in SEPP form')")
    print("  • answers_json (complete JSON with all q1-qN answers)")
    print("  • reference_numbers (applicable SEPP sections)")
    print("  • timestamp (submission date/time)")
    
    print("\n🔍 What Questions Are Captured:")
    print("-" * 30)
    print("For Sheds (19 questions):")
    print("  • Heritage/conservation areas, zoning, measurements")
    print("  • Floor area, height, boundary distances")
    print("  • Materials, drainage, fire safety compliance")
    print("  • Building classifications and restrictions")
    
    print("For Carports (20 questions):")
    print("  • Heritage areas, vehicle storage definition")
    print("  • Zoning, rural areas, lot sizes")
    print("  • Height limits, boundary setbacks")
    print("  • Materials, drainage, access requirements")
    
    print("For Patios (27 questions):")
    print("  • Heritage areas, deck replacements")
    print("  • Area limits, lot sizes, dwelling areas")
    print("  • Height limits, wall restrictions")
    print("  • Farm premises, zoning, materials")
    
    print("For Retaining Walls (15 questions):")
    print("  • Heritage/environmental areas")
    print("  • Cut/fill depths, boundary distances")
    print("  • Water body proximity, drainage")
    print("  • Wall heights, materials, structural requirements")
    
    print("\n💾 JSON Structure Example:")
    print("-" * 30)
    print(json.dumps(shed_exemption_data['answers'], indent=2)[:500] + "...")

if __name__ == "__main__":
    print_example_data()
    print("\n🚀 To see live data, complete an exemption check at:")
    print("   http://localhost:5000/")
    print("📊 View logged data at:")
    print("   http://localhost:5000/admin")
    print("   http://localhost:5000/logs-viewer")