import os
from database.session import engine, Base
# Import all models to ensure they are registered with Base metadata
from database.schemas.models import User, Patient, Assessment, AuditLog

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
