from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ServiceQuery(db.Model):
    __tablename__ = 'service_queries'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    query_text = db.Column(db.String(255), nullable=True)
    response_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "query_text": self.query_text,
            "response_text": self.response_text,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S")
  }
      
