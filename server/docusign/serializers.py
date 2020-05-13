from app import ma


class EnvelopeSerializer(ma.Schema):
    class Meta:
        fields = ("envelope_id", "status", "status_date_time")