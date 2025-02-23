import boto3
import os
class RekognitionService:
    def __init__(self):
        self.rekognition = boto3.client('rekognition',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('AWS_REGION')
        )
    def detect_labels(self, bucket, key):
        print(bucket, key)
        try:
 
            response = self.rekognition.detect_labels(Image = {
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            })
            

            print("Rekognition Response:", response)
            
            # Check if Labels exists
            if 'Labels' not in response:
                print("No Labels in response:", response)
                return {
                    'error': 'No labels found',
                    'raw_response': response
                }
            
            return response

        except Exception as e:
            print(f"Error detecting labels: {e}")
            return {
                'error': str(e)
            }
