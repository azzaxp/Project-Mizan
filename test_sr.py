
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_mizan.settings")
django.setup()

from apps.jamath.models import ServiceRequest

try:
    print("Checking ServiceRequest filtering...")
    qs = ServiceRequest.objects.filter(status='REJECTED')
    print(f"Count: {qs.count()}")
    for req in qs:
        print(f"ID: {req.id}, Status: {req.status}")
    print("Filtering successful.")
except Exception as e:
    print(f"Error: {e}")
