import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from ...models import User, Feedback
from ...middleware import JWTAuthentication

@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class MisclassifiedExampleView(APIView):
    def get(self, request):
        try:
            print("Log", request.user)
            misclassified_feedback = Feedback.objects.filter(classifiedCorrectly__in=[False])

            unique_combinations = set()
            misclassified_data = []

            for feedback in misclassified_feedback:
                combination = (feedback.inputString, feedback.model)

                if combination not in unique_combinations:
                    misclassified_data.append(
                        {'inputString': feedback.inputString, 'model': feedback.model})
                    unique_combinations.add(combination)

            print("LOG misclassified_data", misclassified_data)
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=500)
        return JsonResponse(
            {'misclassified': misclassified_data})
