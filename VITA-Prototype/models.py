from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'patient' or 'doctor'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor_profile = db.relationship('DoctorProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    patient_profile = db.relationship('PatientProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    appointments_as_doctor = db.relationship('Appointment', backref='doctor', 
                                          foreign_keys='Appointment.doctor_id', cascade='all, delete-orphan')
    appointments_as_patient = db.relationship('Appointment', backref='patient',
                                           foreign_keys='Appointment.patient_id', cascade='all, delete-orphan')
    documents = db.relationship('Document', backref='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_doctor(self):
        return self.user_type == 'doctor'
    
    def is_patient(self):
        return self.user_type == 'patient'
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f'<User {self.username}>'

class DoctorProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    specialty = db.Column(db.String(100), nullable=False)
    medical_license = db.Column(db.String(50), nullable=False, unique=True)
    years_of_experience = db.Column(db.Integer, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    
    def __repr__(self):
        return f'<DoctorProfile {self.specialty}>'

class PatientProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    date_of_birth = db.Column(db.Date, nullable=False)
    blood_type = db.Column(db.String(10))
    allergies = db.Column(db.Text)
    medical_history = db.Column(db.Text)
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_number = db.Column(db.String(20))
    
    # Relationships
    medical_records = db.relationship('MedicalRecord', backref='patient', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<PatientProfile user_id={self.user_id}>'

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, default=30)  # Duration in minutes
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Appointment {self.date} {self.time}>'

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # AI analysis results
    is_analyzed = db.Column(db.Boolean, default=False)
    analysis_results = db.Column(db.Text)
    simplified_content = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Document {self.file_name}>'

class MedicalRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient_profile.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor = db.relationship('User', foreign_keys=[doctor_id])
    date = db.Column(db.Date, nullable=False)
    diagnosis = db.Column(db.Text, nullable=False)
    treatment = db.Column(db.Text)
    prescription = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<MedicalRecord {self.date}>'
