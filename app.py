from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from database.db import db, ServiceQuery
import os

app = Flask(__name__, 
            template_folder="../frontend/templates", 
            static_folder="../frontend/static")
CORS(app)

# Configure SQLite database inside backend/database/
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database', 'auraconnect.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Comprehensive Knowledge Base for Underserved Communities
SERVICES_KB = {
    "education": "Free government digital literacy courses are available via the National Digital Literacy Mission. You can register with your digital ID or visit the nearest common service center.",
    "healthcare": "Telemedicine services are available 24/7 through the National Telehealth Portal. Consult general physicians remotely for free, and check local clinic timings.",
    "employment": "Rural employment guarantee schemes, skill development programs, and local job placement drives are active. Register your skills today to get notified of local opportunities."
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query_service():
    data = request.json or {}
    category = data.get('category', '').lower()
    custom_query = data.get('query_text', '')

    response_text = SERVICES_KB.get(
        category, 
        "Please select a valid category: Education, Healthcare, or Employment to get started."
    )

    # Save interaction to SQLite database
    try:
        new_record = ServiceQuery(
            category=category if category in SERVICES_KB else "general",
            query_text=custom_query,
            response_text=response_text
        )
        db.session.add(new_record)
        db.session.commit()
    except Exception as e:
        print(f"Database error: {e}")

    return jsonify({
        "status": "success",
        "category": category,
        "response": response_text
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        queries = ServiceQuery.query.order_by(ServiceQuery.timestamp.desc()).limit(10).all()
        return jsonify([q.to_dict() for q in queries])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created successfully at:", db_path)
    app.run(debug=True, port=5000)
  
