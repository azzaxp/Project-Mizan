from celery import shared_task
from django_tenants.utils import schema_context
# from apps.finance.models import Transaction # Legacy
# from apps.basira.services import audit_transaction
import asyncio

@shared_task
def perform_audit_task(transaction_id, schema_name):
    """
    Legacy Audit Task.
    TODO: Port Basira Audit to work with Mizan Invoice/JournalEntry.
    For now, this is disabled as apps.finance is removed.
    """
    print(f"Audit task skipped for {transaction_id} (Legacy Code Cleanup)")
    return

