from rest_framework import serializers

class ModelOutputSerializer(serializers.Serializer):
    label = serializers.CharField()
    score = serializers.DecimalField(max_digits=6, decimal_places=5)
