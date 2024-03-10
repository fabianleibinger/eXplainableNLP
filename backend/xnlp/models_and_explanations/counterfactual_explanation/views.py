import json

from django.http import JsonResponse
from rest_framework.views import APIView

from . import cf_generator

from rest_framework.exceptions import ParseError


class CounterfactualExplanationView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        text = data.get('text')
        model = data.get('model')
        ctrl_code = data.get('ctrlCodes')

        if not text or not model:
            raise ParseError("Missing 'text' or 'model' in the request payload.")

        try:
            perturbations = cf_generator.generate_perturbations(
                orig_sent=text,
                ctrl_code=ctrl_code
            )
            predictions = cf_generator.get_predictions(perturbations, model)
            ctrl_codes = cf_generator.detect_ctrl_code(text, perturbations)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'perturbations': perturbations[:5], 'predictions': predictions[:5], 'ctrlCodes': ctrl_codes[:5]})
