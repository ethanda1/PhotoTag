import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def test_aws_connection():
    try:
        # Test S3
        s3 = boto3.client('s3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        
        # List buckets
        buckets = s3.list_buckets()
        print("✅ S3 Connection Successful!")
        print("Your buckets:", [b['Name'] for b in buckets['Buckets']])
        
        # Test Rekognition
        rekognition = boto3.client('rekognition',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        print("✅ Rekognition Connection Successful!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Install requirements if you haven't
    # pip install boto3 python-dotenv
    
    test_aws_connection() 