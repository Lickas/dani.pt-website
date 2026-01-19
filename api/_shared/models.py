from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ARRAY, Text
from sqlalchemy.sql import func
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Vehicle(Base):
    __tablename__ = 'vehicles'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    fuel_type = Column(String(50), nullable=False, index=True)
    mileage = Column(Integer, nullable=False)
    transmission = Column(String(50), nullable=False)
    color = Column(String(50), nullable=False)
    power = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    features = Column(ARRAY(String), default=[])
    images = Column(ARRAY(String), default=[])
    is_featured = Column(Boolean, default=False, index=True)
    is_sold = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class Campaign(Base):
    __tablename__ = 'campaigns'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    discount_percentage = Column(Integer, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    image_url = Column(String(500), nullable=True)
    applicable_vehicle_ids = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Contact(Base):
    __tablename__ = 'contacts'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class AdminUser(Base):
    __tablename__ = 'admin_users'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(200), nullable=False, unique=True, index=True)
    name = Column(String(200), nullable=False)
    supabase_user_id = Column(String(36), nullable=True, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class NewsletterSubscriber(Base):
    __tablename__ = 'newsletter_subscribers'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(200), nullable=False, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
